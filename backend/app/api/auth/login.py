from fastapi import APIRouter
from app.schemas.login_schema import UserLogin
from app.services.auth_service import get_user_by_email
from app.core.security import verify_password, create_access_token

router = APIRouter()


@router.post("/login")
def login(user: UserLogin):

    db_user = get_user_by_email(user.email)

    if not db_user:
        return {
            "message": "Invalid Email or Password"
        }

    if not verify_password(user.password, db_user["password"]):
        return {
            "message": "Invalid Email or Password"
        }

    token = create_access_token(
        {
            "sub": db_user["email"]
        }
    )

    return {
        "message": "Login Successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "full_name": db_user["full_name"],
            "email": db_user["email"],
            "role": db_user["role"],
            "team": db_user["team"]
        }
    }