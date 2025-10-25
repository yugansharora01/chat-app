from core.enums import Role
from .models import Message , Conversation
from typing import Optional

def add_message(conversation_id, role, content):
    message = Message(conversation_id=conversation_id, role=role, content=content)
    message.save()
    return message


def get_all_messages(conversation_id, cursor=None, limit=20):
    qs = Message.objects.filter(conversation_id=conversation_id).order_by('-id')  # newest first

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