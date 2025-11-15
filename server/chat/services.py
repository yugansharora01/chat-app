from core.enums import Role
from .models import Message , Conversation
from typing import List, Optional
from llm.embeddings import get_embedding
from llm.vector_store import add_to_index, search_index

def add_message(conversation_id, role, content, file=None):
    message = Message(conversation_id=conversation_id, role=role, content=content,file=file,fileName=file.name if file else None)
    message.save()
     # Store vector
    embedding = get_embedding(content)
    add_to_index(embedding, {
        "id": message.id,
        "conversation_id": conversation_id,
        "role": role,
        "content": content
    })
    return message


def get_all_messages(conversation_id, cursor=None, limit=20):
    qs = Message.objects.filter(conversation_id=conversation_id)

    if cursor:
        qs = qs.filter(id__lt=cursor)  # get messages older than cursor

    messages = list(qs[:limit])  # convert to list to avoid slicing issues
    next_cursor = messages[-1].id if messages else None  # get last item's ID safely
    messages.reverse()  # oldest first

    return messages, next_cursor

def generate_response(user_message):
    # Placeholder for actual response generation logic
    return "This is a generated response to: " + user_message


def create_conversation(user_id, title):
    conversation = Conversation(user_id=user_id, title=title)
    conversation.save()
    add_message(conversation.id, Role.AI.value, "Hello! How can I assist you today?")
    return conversation

def get_conversations(user_id):
    return Conversation.objects.filter(user_id=user_id).order_by('-updated_at')

def update_conversation_title(conversation_id, new_title):
    try:
        conversation = Conversation.objects.get(id=conversation_id)
        conversation.title = new_title
        conversation.save()
        return conversation
    except Conversation.DoesNotExist:
        return None
    
def convert_messages_to_llm_format(all_messages:list[Message]):
    messages = []
    for m in all_messages:
        # normalize role to lowercase: 'user' or 'assistant' or 'system'
        role = m.role.lower()
        messages.append({"role": role, "content": m.content})
    return messages

def get_messages_for_llm(conversation_id:int,limit:int = 50)->List[Message]:
    all_messages, _ = get_all_messages(conversation_id,None,limit)
    return convert_messages_to_llm_format(all_messages)

def trim_messages_by_chars(messages,max_chars=30000):
    """
    Keep as many recent messages as will fit under max_chars.
    Returns messages in chronological order.
    """
    total = 0
    kept = []
    for m in reversed(messages):
        l = len(m["content"])
        if total + l > max_chars and kept:
            break
        kept.append(m)
        total += l
    return list(reversed(kept))

def retrieve_relevant_messages(conversation_id, query, top_k=8):
    query_emb = get_embedding(query)
    results = search_index(query_emb, top_k=top_k, filter_conv=conversation_id)
    return [
        {"role": r["role"], "content": r["content"]}
        for r in results
    ]