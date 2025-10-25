from django.contrib import admin
from .models import Conversation, Message

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation_id', 'role', 'content', 'timeStamp')

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'created_at', 'updated_at', 'title')
