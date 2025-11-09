import faiss
import numpy as np
import os
import pickle

INDEX_PATH = "faiss_index.bin"
META_PATH = "faiss_meta.pkl"

# Create or load index
def load_index(dimension=384):
    if os.path.exists(INDEX_PATH) and os.path.exists(META_PATH):
        index = faiss.read_index(INDEX_PATH)
        with open(META_PATH, "rb") as f:
            metadata = pickle.load(f)
    else:
        index = faiss.IndexFlatL2(dimension)
        metadata = []
    return index, metadata

def save_index(index, metadata):
    faiss.write_index(index, INDEX_PATH)
    with open(META_PATH, "wb") as f:
        pickle.dump(metadata, f)

def add_to_index(embedding, meta):
    index, metadata = load_index(len(embedding))
    embedding = np.array([embedding]).astype("float32")
    index.add(embedding)
    metadata.append(meta)
    save_index(index, metadata)

def search_index(query_embedding, top_k=5, filter_conv=None):
    index, metadata = load_index(len(query_embedding))
    if index.ntotal == 0:
        return []

    query_embedding = np.array([query_embedding]).astype("float32")
    distances, ids = index.search(query_embedding, top_k)

    results = []
    for idx in ids[0]:
        if idx == -1: 
            continue
        meta = metadata[idx]
        if filter_conv and meta.get("conversation_id") != filter_conv:
            continue
        results.append(meta)
    return results
