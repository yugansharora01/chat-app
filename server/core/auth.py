from rest_framework import authentication, exceptions

from core.utils.supabase import verify_supabase_token

class SupabaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None
        token = auth_header.split(" ")[1]
        payload = verify_supabase_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise exceptions.AuthenticationFailed("Invalid token payload")
        return (type("User", (), {"id": user_id})(), None)
