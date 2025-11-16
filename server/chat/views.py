from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.views import APIView
from chat.models import Conversation
from chat.serializer import ConversationSerializer, MessageSerializer
from documents.services.document_service import process_file_attachment
from llm.embeddings import embed
from llm.services import generate_with_history
from llm.vector_store import search_chunks
from .services import add_message, create_conversation, create_file_attachments, get_all_messages, generate_response, get_messages_for_llm, retrieve_relevant_messages, trim_messages_by_chars
import core.utils.response as response
from core.enums import Role
from django.db import transaction

# Create your views here.
class MessageView(APIView):
    permissionClasses = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Fetch chat history for the logged-in user.
        """
        conversation_id = request.query_params.get("conversation_id")
        if not conversation_id:
            return response.error("conversation_id is required", status=status.HTTP_400_BAD_REQUEST)

        cursor = request.query_params.get("cursor")
        limit = int(request.query_params.get("limit", 20))
        messages,next_cursor = get_all_messages(conversation_id, cursor, limit)
        serialized_messages = MessageSerializer(messages, many=True).data
        payload = {
            "messages": serialized_messages,
            "meta": {
                "next_cursor": next_cursor,
            },
        }
        return response.success(payload)
    
    @transaction.atomic
    def post(self,request):
        """
        Send a user message and get AI response.
        """
        user = request.user
        
        files = request.FILES.getlist("files")
        message_content = request.data.get("message")
        conversation_id = request.data.get("conversation_id")
        if not message_content:
            return response.error("Message content is required", status=status.HTTP_400_BAD_REQUEST)
        
        # if conversation_id is not provided, create a new one
        if not conversation_id:
            conversation = create_conversation(user.id, message_content[:20])  # use first 20 chars as title
        else:
            conversation = get_object_or_404(Conversation, id=conversation_id)

        # Save user message
        user_message = add_message(conversation.id, Role.USER.value, message_content)

        created_attachments = create_file_attachments(files,user_message)

        print("created_attachments: ",created_attachments)

        for fa in created_attachments:
            # process synchronously (or put into background later)
            try:
                process_file_attachment(fa.id,owner_id=user.id)
            except Exception as e:
                # don't crash chat; log and continue
                import logging
                logging.exception("Error processing attachment %s: %s", fa.id, str(e))

        # 2) build history for LLM
        messages = retrieve_relevant_messages(conversation.id, message_content, top_k=8)

        # RAG: embed question & search chunks (owner = user id or conversation)
        question_emb = embed(message_content)
        print("message_content: ",message_content)
        print("question_emb: ",question_emb)
        top_chunks = search_chunks(owner_id=user.id,conversation_id=conversation.id, query_embedding=question_emb, top_k=3)
        print("top_chunks: ",top_chunks)

        # prepare RAG system messages
        rag_contexts = []
        for chunk in top_chunks:
            rag_contexts.append({"role": "system", "content": f"Document context:\n{chunk.text}"})

        
        # add a system prompt at the beginning
        system_prompt = {"role": "system", "content": "You are a helpful assistant."}
        messages = [system_prompt] + rag_contexts + list(reversed(messages))

        print("rag_contexts: ",rag_contexts)
        print("messages: ",messages)

        # 3) trim context if needed
        messages = trim_messages_by_chars(messages, max_chars=25000)

        # 4) call the LLM provider
        bot_response = generate_with_history(messages)

        ai_message = add_message(conversation.id, Role.AI.value, bot_response)

        # Serialize both messages
        user_serialized = MessageSerializer(user_message).data
        ai_serialized = MessageSerializer(ai_message).data

        serializedConversation = ConversationSerializer(conversation).data

        payload = {
            "messages": [user_serialized, ai_serialized],
            "meta": {
                "conversation": serializedConversation,  
            },
        }
        return response.success(payload)
    
class ConversationView(APIView):
    permissionClasses = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Fetch all conversations for the logged-in user.
        """
        user = request.user
        conversations = Conversation.objects.filter(user_id=user.id).order_by('-updated_at')
        serialized_conversations = ConversationSerializer(conversations, many=True).data
        return response.success({"conversations": serialized_conversations})
    
    def post(self, request):
        user = request.user
        user_id = user.id
        is_initial = request.data.get("is_initial", False)
        title = request.data.get("title", "New conversation")

        if not user_id:
            return response.success({"error": "userId required"}, status=400)

        if is_initial:
            # Create only if the user has no conversations yet
            has_existing = Conversation.objects.filter(user_id=user_id).exists()
            if not has_existing:
                conversation = create_conversation(user_id, title)
                return response.success({"conversation_id": str(conversation.id), "created": True})
            else:
                return response.success({"message": "User already has a conversation", "created": False})

        # Normal conversation creation
        
        conversation = create_conversation(user_id,title)
        return response.success({"conversation_id": str(conversation.id), "created": True})

    def update(self, request):
        """
        Update conversation title.
        """
        conversation_id = request.data.get("conversation_id")
        new_title = request.data.get("title")
        if not conversation_id or not new_title:
            return response.error("conversation_id and title are required", status=status.HTTP_400_BAD_REQUEST)
        
        try:
            conversation = Conversation.objects.get(id=conversation_id)
            conversation.title = new_title
            conversation.save()
            serialized_conversations = ConversationSerializer(conversation).data
            return response.success(serialized_conversations, status=status.HTTP_200_OK)
        except Conversation.DoesNotExist:
            return response.error("Conversation not found", status=status.HTTP_404_NOT_FOUND)