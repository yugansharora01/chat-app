from huggingface_hub import InferenceClient
import os

client = InferenceClient(
    provider="hf-inference",
    api_key=os.getenv("HF_API_KEY"),
)

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

def embed(texts):
    """
    Accepts:
      - single string -> returns list[float]
      - list of strings -> returns list[list[float]]
    """

    # Case 1: single string
    if isinstance(texts, str):
        embedding = client.feature_extraction(texts, model=MODEL_NAME)
        return embedding.tolist() if hasattr(embedding, "tolist") else embedding

    # Case 2: list[str] -> batch embedding
    if isinstance(texts, list):
        embeddings = client.feature_extraction(texts, model=MODEL_NAME)
        # HF sometimes returns numpy-like arrays
        if hasattr(embeddings, "tolist"):
            return embeddings.tolist()
        return embeddings

    raise ValueError("embed() received invalid type. Must be str or list[str].")
