from django.contrib import admin

from documents.models import Document, DocumentChunk

# Register your models here.
@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'file_attachment','owner_id', 'file_name', 'extracted_text', 'created_at')

@admin.register(DocumentChunk)
class DocumentChunkAdmin(admin.ModelAdmin):
    list_display = ('id', 'document',  'text', 'embedding','created_at')