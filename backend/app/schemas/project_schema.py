from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    title: str
    description: str


class ProjectFile(BaseModel):
    filename: str

class ProjectCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=5, max_length=500)