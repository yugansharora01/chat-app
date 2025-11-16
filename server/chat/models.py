from django.db import models
from core.enums import Role

# Create your models here.
class Message(models.Model):
    role = models.CharField(max_length=10, choices=Role.choices())
    conversation = models.ForeignKey('Conversation', on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    timeStamp = models.DateTimeField(auto_now_add=True) 

    class Meta:
        ordering = ["-timeStamp"]

    def __str__(self):
        return f"{self.role}: {self.content[:40]}"
    
class FileAttachment(models.Model):
    message = models.ForeignKey("Message", on_delete=models.CASCADE, related_name="files")
    file = models.FileField(upload_to="chat_files/")
    file_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name


class Conversation(models.Model):
    user_id = models.UUIDField()
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"Conversation {self.id} - {self.title}"