def split_text(text: str, chunk_size: int = 500, overlap: int = 100):
    """
    Split text into overlapping chunks.

    chunk_size = number of characters in each chunk
    overlap = characters repeated between consecutive chunks
    """

    chunks = []

    start = 0

    while start < len(text):

        end = start + chunk_size

        chunk = text[start:end]

        chunks.append(chunk)

        start += chunk_size - overlap

    return chunks