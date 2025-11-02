import os
from llm.base import Message
from .groq_provider import GroqProvider
from .ollama_provider import OllamaProvider

def get_provider():
    provider = os.getenv("LLM_PROVIDER","ollama").lower()
    if(provider == "groq"):
        return GroqProvider()
    return OllamaProvider()

provider = get_provider()

def generate_with_history(messages: list[Message]):
    return provider.generate_response(messages)