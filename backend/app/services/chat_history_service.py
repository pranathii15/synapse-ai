from app.database.database import db
from datetime import datetime

chat_history_collection = db["chat_history"]


def save_chat(feature, question, answer):

    chat_history_collection.insert_one({
        "feature": feature,
        "question": question,
        "answer": answer,
        "created_at": datetime.utcnow()
    })