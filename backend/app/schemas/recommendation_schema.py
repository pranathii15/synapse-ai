from pydantic import BaseModel, Field

class RecommendationRequest(BaseModel):

    project_name: str

    required_skills: list[str] = Field(..., min_items=1)