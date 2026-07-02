from fastapi import APIRouter
from datetime import datetime

from app.services.chat_history_service import chat_history_collection

router = APIRouter(
    tags=["AI Chat History"]
)


@router.post("/chat/history")
def save_chat(data: dict):

    data["created_at"] = datetime.utcnow()

    chat_history_collection.insert_one(data)

    return {
        "message": "Chat saved successfully."
    }


@router.get("/chat/history")
def get_history():

    history = list(
        chat_history_collection.find({}, {"_id": 0})
    )

    return {
        "history": history
    }