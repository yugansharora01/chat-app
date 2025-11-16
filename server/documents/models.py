from django.db import models

from chat.models import FileAttachment

# Create your models here.

class Document(models.Model):
    file_attachment = models.ForeignKey(FileAttachment,on_delete=models.CASCADE,related_name="documents")
    owner_id = models.CharField(max_length=255)
    filename = models.CharField(max_length=512)
    extracted_text  = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.filename}"
    
class DocumentChunk(models.Model):
    document = models.ForeignKey(Document,on_delete=models.CASCADE,related_name="chunks")
    text = models.TextField()
    embedding = models.JSONField()  # list[float]
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chunk {self.pk} of {self.document.filename}"