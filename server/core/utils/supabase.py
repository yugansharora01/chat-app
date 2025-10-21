import time
import os
from jwt import PyJWKClient, decode, ExpiredSignatureError, InvalidTokenError
from rest_framework import exceptions

# JWKS URL from Supabase
SUPABASE_URL = os.environ["SUPABASE_URL"]  # Will raise KeyError if not set
JWKS_URL = f"https://{SUPABASE_URL}/auth/v1/.well-known/jwks.json"


# Cache the JWKs client for a certain amount of time (e.g., 1 hour)
class CachedPyJWKClient:
    def __init__(self, url, cache_ttl: int = 3600):
        self.url = url
        self.cache_ttl = cache_ttl
        self._jwks_client = None
        self._last_fetch_time = 0

    def get_signing_key(self, token):
        current_time = time.time()
        if self._jwks_client is None or current_time - self._last_fetch_time > self.cache_ttl:
            self._jwks_client = PyJWKClient(self.url)
            self._last_fetch_time = current_time
        return self._jwks_client.get_signing_key_from_jwt(token).key


# Instantiate cached client
cached_jwks_client = CachedPyJWKClient(JWKS_URL)


def verify_supabase_token(token: str):
    """
    Verify a Supabase JWT with caching for JWKS
    """
    try:
        signing_key = cached_jwks_client.get_signing_key(token)

        payload = decode(
            token,
            key=signing_key,
            algorithms=["ES256"],
            audience="authenticated",
        )
        return payload

    except ExpiredSignatureError:
        raise exceptions.AuthenticationFailed("Token expired")
    except InvalidTokenError as e:
        raise exceptions.AuthenticationFailed(f"Invalid token: {str(e)}")
