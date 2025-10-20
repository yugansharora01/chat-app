from core.utils.supabase import verify_supabase_jwt

class SupabaseAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.user = verify_supabase_jwt(request)
        return self.get_response(request)
