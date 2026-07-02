from pydantic import BaseModel, Field


class MeetingRequest(BaseModel):
    transcript: str = Field(..., min_length=20)