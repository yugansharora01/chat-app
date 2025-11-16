from django.contrib import admin

from documents.models import Document, DocumentChunk

# Register your models here.
@admin.register(Document)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'file_attachment', 'filename', 'filename', 'created_at')

@admin.register(DocumentChunk)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'document',  'text', 'embedding','created_at')