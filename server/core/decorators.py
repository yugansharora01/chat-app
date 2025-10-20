from rest_framework.permissions import BasePermission

class IsSubscribed(BasePermission):
    def has_permission(self, request, view):
        return getattr(request.user, "is_premium", False)
