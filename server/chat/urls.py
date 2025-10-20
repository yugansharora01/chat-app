from django.urls import paths
from .views import MessageView

urlpatterns = [
    paths('', MessageView.as_view(), name='chat'),
]