from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.views import APIView
from chat.models import Conversation
from chat.serializer import ConversationSerializer, MessageSerializer
from llm.services import generate_with_history
from .services import add_message, create_conversation, get_all_messages, generate_response, get_messages_for_llm, retrieve_relevant_messages, trim_messages_by_chars
import core.utils.response as response
from core.enums import Role

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
    
    def post(self,request):
        """
        Send a user message and get AI response.
        """
        user = request.user
        
        file = request.FILES.get("file")
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
        user_message = add_message(conversation.id, Role.USER.value, message_content, file)

       # 2) build history for LLM
        messages = retrieve_relevant_messages(conversation.id, message_content, top_k=8)
        
        # add a system prompt at the beginning
        system_prompt = {"role": "system", "content": "You are a helpful assistant."}
        messages = [system_prompt] + list(reversed(messages))

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