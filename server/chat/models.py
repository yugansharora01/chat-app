from django.db import models

# Create your models here.
class Message(models.Model):
    user_id = models.UUIDField()
    role = models.CharField(max_length=10, choices=[('user', 'User'), ('assistant', 'Assistant')])
    content = models.TextField()
    timeStamp = models.DateTimeField(auto_now_add=True) 

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.role}: {self.content[:40]}"

    def __unicode__(self):
        return 
