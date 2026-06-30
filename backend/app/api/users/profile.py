from fastapi import APIRouter, Depends
from app.api.auth.dependencies import get_current_user
from app.services.auth_service import get_user_profile

router = APIRouter()


@router.get("/me")
def me(current_user=Depends(get_current_user)):

    email = current_user["sub"]

    user = get_user_profile(email)

    return {
        "message": "Profile Loaded Successfully",
        "user": user
    }