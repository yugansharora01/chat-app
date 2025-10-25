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

class Conversation(models.Model):
    user_id = models.UUIDField()
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"Conversation {self.id} - {self.title}"