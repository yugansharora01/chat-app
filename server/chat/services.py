from .models import Message

def add_message(user_id, role, content):
    message = Message(user_id=user_id, role=role, content=content)
    message.save()
    return message

from typing import Optional

def get_all_messages(user_id, cursor=None, limit=20):
    qs = Message.objects.filter(user_id=user_id).order_by('-id')  # newest first

    if cursor:
        qs = qs.filter(id__lt=cursor)  # get messages older than cursor

    messages = list(qs[:limit])  # convert to list to avoid slicing issues
    next_cursor = messages[-1].id if messages else None  # get last item's ID safely
    messages.reverse()  # oldest first

    return messages, next_cursor



def generate_response(user_message):
    # Placeholder for actual response generation logic
    return "This is a generated response to: " + user_message