from rest_framework import permissions, status
from rest_framework.views import APIView
from chat.serializer import MessageSerializer
from .services import add_message, get_all_messages, generate_response
import core.utils.response as response
from core.enums import Role

# Create your views here.
class MessageView(APIView):
    permissionClasses = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Fetch chat history for the logged-in user.
        """
        user = request.user
        messages = get_all_messages(user.id)
        serialized_messages = MessageSerializer(messages, many=True).data
        return response.success(serialized_messages)
    
    def post(self,request):
        """
        Send a user message and get AI response.
        """
        user = request.user
        print(f"Authenticated user: {user} {user.id}")
        message_content = request.data.get("message")
        if not message_content:
            return response.error("Message content is required", status=status.HTTP_400_BAD_REQUEST)
        
        # Save user message
        user_message = add_message(user.id, Role.USER, message_content)

        # Generate AI response
        bot_response = generate_response(message_content)
        ai_message = add_message(user.id, Role.AI, bot_response)

        # Serialize both messages
        user_serialized = MessageSerializer(user_message).data
        ai_serialized = MessageSerializer(ai_message).data

        payload = {
            "messages": [user_serialized, ai_serialized],
            "meta": {
                "model": "",  
            },
        }
        return response.success(payload)