from models import Message

def add_message(user_id, role, content):
    message = Message(user_id=user_id, role=role, content=content)
    message.save()
    return message

def get_messages(user_id):
    return Message.objects.filter(user_id=user_id)

def generate_response(user_message):
    # Placeholder for actual response generation logic
    return "This is a generated response to: " + user_message