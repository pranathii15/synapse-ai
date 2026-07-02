import faiss
import numpy as np
import os
import json

VECTOR_DB = "vector_store"

os.makedirs(VECTOR_DB, exist_ok=True)


def save_embeddings(embeddings, chunks):

    vectors = np.array(embeddings).astype("float32")

    dimension = vectors.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(vectors)

    faiss.write_index(
        index,
        os.path.join(VECTOR_DB, "index.faiss")
    )

    with open(
        os.path.join(VECTOR_DB, "chunks.json"),
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(chunks, f, ensure_ascii=False, indent=2)

    return {
        "vectors_saved": index.ntotal,
        "dimension": dimension
    }


def search_vectors(query_embedding, top_k=10):

    index = faiss.read_index(
        os.path.join(VECTOR_DB, "index.faiss")
    )

    query = np.array([query_embedding]).astype("float32")

    distances, indices = index.search(query, top_k)

    return indices[0].tolist()

def get_chunks(indices):

    with open(
        os.path.join(VECTOR_DB, "chunks.json"),
        encoding="utf-8"
    ) as f:

        chunks = json.load(f)

    return [
        chunks[i]
        for i in indices
        if i < len(chunks)
    ]