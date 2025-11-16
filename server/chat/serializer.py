from rest_framework import serializers
from .models import Conversation, FileAttachment, Message

class FileAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = FileAttachment
        fields = ["id", "file_name", "file_url"]

    def get_file_url(self, obj):
        return obj.file.url

class MessageSerializer(serializers.ModelSerializer):
    files = FileAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Message
        fields = ["id", "role", "content", "files", "timeStamp"]

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = ["id", "user_id", "title", "created_at", "updated_at"]