import faiss
import numpy as np
import os
import pickle
# llm/vector_store.py
from documents.models import DocumentChunk
import math

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
    distances, ids = index.search(query_embedding, top_k * 3)  # search wider

    results = []
    for idx in ids[0]:
        if idx == -1:
            continue
        meta = metadata[idx]
        if filter_conv and meta.get("conversation_id") != filter_conv:
            continue

        results.append(meta)
        if len(results) >= top_k:
            break

    return results


def _cosine(a, b):
    # a, b are lists of floats
    dot = sum(x*y for x,y in zip(a,b))
    norm_a = math.sqrt(sum(x*x for x in a))
    norm_b = math.sqrt(sum(x*x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

def save_chunks_for_document(document, chunks_texts, embeddings):
    """
    document: Document instance
    chunks_texts: list[str]
    embeddings: list[list[float]]
    """
    objects = []
    for text, emb in zip(chunks_texts, embeddings):
        objects.append(DocumentChunk(document=document, text=text, embedding=emb))
    DocumentChunk.objects.bulk_create(objects)

def search_chunks(owner_id=None, conversation_id=None, query_embedding=None, top_k=5):
    """
    Search chunks by owner or conversation. If owner_id provided, filter by document.owner.
    Returns list of DocumentChunk ordered by similarity desc.
    """
    qs = DocumentChunk.objects.select_related("document")
    if owner_id:
        qs = qs.filter(document__owner_id=owner_id)
    if conversation_id:
        qs = qs.filter(document__file_attachment__message__conversation_id=conversation_id)
    # naive approach: compute similarity in Python
    results = []
    for chunk in qs:
        if not chunk.embedding:
            continue
        score = _cosine(query_embedding, chunk.embedding)
        results.append((score, chunk))
    results.sort(key=lambda x: x[0], reverse=True)
    return [c for s,c in results[:top_k]]
