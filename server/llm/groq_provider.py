import os
from groq import Groq
from .base import LLMProvider

class GroqProvider(LLMProvider):
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    def generate_response(self, messages):
        response = self.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages
        )
        return response.choices[0].message.content