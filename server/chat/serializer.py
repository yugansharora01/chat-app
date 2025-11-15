from rest_framework import serializers
from .models import Conversation, Message

class MessageSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = ["id", "conversation_id", "role", "content","file_url", "fileName", "timeStamp"]
    
    def get_file_url(self, obj):
        return obj.file.url if obj.file else None

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ["id", "user_id", "title", "created_at", "updated_at"]