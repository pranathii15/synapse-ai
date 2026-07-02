from fastapi import APIRouter

from app.schemas.recommendation_schema import RecommendationRequest
from app.services.recommendation_service import recommend_members

router = APIRouter(
    tags=["AI Recommendation"]
)


@router.post("/recommend/team")
def recommend_team(data: RecommendationRequest):

    members = recommend_members(
        data.required_skills
    )

    return {
        "recommended_members": members
    }