import ollama
from .base import LLMProvider

class OllamaProvider(LLMProvider):
    def generate_response(self, messages):
        response = ollama.chat(model="llama3",messages=messages)