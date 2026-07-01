from pydantic import BaseModel, Field
from typing import Optional


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=5)
    project_id: str


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, min_length=5,max_length=500)
    status: Optional[str] = None


class AssignTask(BaseModel):
    assigned_to: str


class TaskStatus(BaseModel):
    status: str