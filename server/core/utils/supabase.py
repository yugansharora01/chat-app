import jwt
import requests
import json
from jwt import PyJWKClient
from rest_framework import exceptions

JWKS_URL = "https://ujrlivuupaxnunvgagjk.supabase.co/auth/v1/.well-known/jwks.json"

def verify_supabase_token(token):
    try:
        # Use PyJWKClient to fetch and parse the key automatically
        jwks_client = PyJWKClient(JWKS_URL)
        signing_key = jwks_client.get_signing_key_from_jwt(token).key

        payload = jwt.decode(
            token,
            key=signing_key,
            algorithms=["ES256"],
            audience="authenticated",
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed("Token expired")
    except jwt.InvalidTokenError as e:
        raise exceptions.AuthenticationFailed(f"Invalid token: {str(e)}")
