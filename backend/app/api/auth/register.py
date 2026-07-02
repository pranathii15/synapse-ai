from fastapi import APIRouter
from datetime import datetime

from app.schemas.user_schema import UserCreate
from app.core.security import hash_password
from app.services.user_service import create_user, get_user_by_email

router = APIRouter()


@router.post("/register")
def register(user: UserCreate):

    existing = get_user_by_email(user.email)

    if existing:
        return {"message": "Email already exists"}

    user_data = user.model_dump()

    user_data["password"] = hash_password(user.password)

    user_data["created_at"] = datetime.utcnow()

    create_user(user_data)

    return {
        "message": "User Registered Successfully ✅"
    }