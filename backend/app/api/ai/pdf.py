from fastapi import APIRouter
from app.ai.pdf_loader import extract_text_from_pdf
from app.ai.text_splitter import split_text
from app.ai.embeddings import generate_embeddings
from app.ai.vector_store import save_embeddings
from app.ai.vector_store import search_vectors
from app.ai.embeddings import generate_query_embedding
from fastapi import Query
from app.ai.gemini_service import ask_gemini
from app.ai.vector_store import get_chunks

router = APIRouter(tags=["AI"])


@router.get("/pdf/test")
def test_pdf():

    pdf_path = "uploads/442a2a80-41b1-4671-87d3-82aea5b5a61c_DSA Roadmap.pdf"

    text = extract_text_from_pdf(pdf_path)

    chunks = split_text(text)

    embeddings = generate_embeddings(chunks)
    faiss_info = save_embeddings(
    embeddings,
    chunks
    )

    return {
    "characters": len(text),
    "total_chunks": len(chunks),
    "embedding_dimension": len(embeddings[0]),
    "vectors_saved": faiss_info["vectors_saved"],
    "faiss_dimension": faiss_info["dimension"]
    }

@router.get("/pdf/chat")
def chat_pdf(question: str):

    query_embedding = generate_query_embedding(question)

    indices = search_vectors(query_embedding)

    context_chunks = get_chunks(indices)

    context = "\n\n".join(context_chunks)

    answer = ask_gemini(
        context,
        question
    )

    return {
        "question": question,
        "answer": answer
    }