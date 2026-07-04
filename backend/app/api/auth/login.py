from fastapi import APIRouter, HTTPException
from app.schemas.login_schema import UserLogin
from app.services.auth_service import get_user_by_email
from app.core.security import verify_password, create_access_token

router = APIRouter()


@router.post("/login")
def login(user: UserLogin):

    db_user = get_user_by_email(user.email)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid Email or Password")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid Email or Password")

    token = create_access_token(
        {
            "sub": db_user["email"]
        }
    )

    return {
        "message": "Login Successful",
        "access_token": token,
        "token": token,
        "token_type": "bearer",
        "user": {
            "name": db_user.get("name") or db_user.get("full_name") or db_user.get("email"),
            "email": db_user["email"],
            "role": db_user.get("role", "Software Engineer"),
            "department": db_user.get("department", "Engineering"),
            "skills": db_user.get("skills", []),
            "experience": db_user.get("experience", 0),
            "currentWorkload": db_user.get("workload", 0),
            "avatar": db_user.get("avatar", "")
        }
    }