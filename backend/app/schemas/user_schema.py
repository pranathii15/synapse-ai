from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):

    name: str = Field(..., min_length=3, max_length=100)

    email: EmailStr

    password: str = Field(..., min_length=6)

    role: str = "Software Engineer"

    department: str = "Engineering"

    skills: list[str] = []

    experience: int = 0

    workload: int = 0