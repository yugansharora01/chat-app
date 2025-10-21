from django.db import models
from core.enums import Role

# Create your models here.
class Message(models.Model):
    user_id = models.UUIDField()
    role = models.CharField(max_length=10, choices=Role.choices())
    content = models.TextField()
    timeStamp = models.DateTimeField(auto_now_add=True) 

    class Meta:
        ordering = ["-timeStamp"]

    def __str__(self):
        return f"{self.role}: {self.content[:40]}"

