from fastapi import APIRouter, Query
import os

from app.ai.pdf_loader import extract_text_from_pdf
from app.ai.gemini_service import ask_gemini

router = APIRouter(
    tags=["AI Document"]
)


@router.get("/document/summary")
def document_summary(
    filename: str = Query(...)
):

    pdf_path = os.path.join("uploads", filename)

    if not os.path.exists(pdf_path):
        return {
            "message": "Document not found."
        }

    text = extract_text_from_pdf(pdf_path)

    prompt = f"""
You are SynapseAI, an Enterprise AI Assistant.

Analyze this uploaded document and generate:

1. Executive Summary

2. Key Topics

3. Important Concepts

4. Action Items

5. Risks

6. Recommendations

7. Keywords

Document:

{text}
"""

    summary = ask_gemini(
        text,
        prompt
    )

    return {
        "filename": filename,
        "document_summary": summary
    }