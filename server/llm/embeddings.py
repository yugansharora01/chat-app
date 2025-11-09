from sentence_transformers import SentenceTransformer
import numpy as np

# Load a free local embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")  # small, 384-dim, great quality

def get_embedding(text: str):
    if not text:
        return np.zeros(384)
    return model.encode(text, convert_to_numpy=True)
