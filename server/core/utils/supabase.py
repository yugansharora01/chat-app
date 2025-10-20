import jwt
from django.conf import settings

def verify_supabase_jwt(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SUPABASE_PUBLIC_KEY, algorithms=["HS256"])
        return type("User", (), {"id": payload.get("sub")})()  # simple user object
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None