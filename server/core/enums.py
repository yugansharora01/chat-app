# core/enums.py
from enum import Enum

class Role(Enum):
    USER = "user"
    AI = "assistant"
    ADMIN = "admin"

    @classmethod
    def choices(cls):
        return [(key.value, key.value) for key in cls]

