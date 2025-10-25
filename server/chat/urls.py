from django.urls import path
from .views import ConversationView, MessageView

urlpatterns = [
        # Conversations
    path("conversations/", ConversationView.as_view(), name="conversation-list"),
    
    # Messages
    path("messages/", MessageView.as_view(), name="message-view"),
]