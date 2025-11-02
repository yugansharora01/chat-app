from abc import ABC, abstractmethod
from typing import Dict, List

Message = Dict[str,str]

class LLMProvider(ABC):
    @abstractmethod
    def generate_response(self,messages:List[Message]):
        raise NotImplementedError