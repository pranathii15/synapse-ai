from pydantic import BaseModel, EmailStr


class Member(BaseModel):
    email: EmailStr