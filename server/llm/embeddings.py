from huggingface_hub import InferenceClient
import os

def get_embedding(text: str):
    client = InferenceClient(
        provider="hf-inference",
        api_key=os.getenv("HF_API_KEY"),
    )

    embedding = client.feature_extraction(
        text,
        model="sentence-transformers/all-MiniLM-L6-v2",
    )

    # Handle numpy-like array or list of floats
    if hasattr(embedding, "tolist"):
        return embedding.tolist()
    elif isinstance(embedding, list):
        # Sometimes already a flat list
        return embedding
    else:
        raise ValueError(f"Unexpected response type: {type(embedding)}")
