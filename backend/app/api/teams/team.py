from fastapi import APIRouter, Depends
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException

from app.schemas.member_schema import Member
from app.schemas.team_schema import TeamCreate
from app.services.team_service import team_collection
from app.api.auth.dependencies import get_current_user

router = APIRouter(tags=["Teams"])


@router.post("/teams")
def create_team(
    team: TeamCreate,
    current_user=Depends(get_current_user)
):

    team_data = {
        "name": team.name,
        "description": team.description,
        "owner": current_user["sub"],
        "members": [current_user["sub"]],
        "created_at": datetime.utcnow()
    }

    result = team_collection.insert_one(team_data)

    return {
        "message": "Team Created Successfully",
        "team_id": str(result.inserted_id)
    }

@router.get("/teams")
def get_teams(current_user=Depends(get_current_user)):
    teams = list(
        team_collection.find(
            {"owner": current_user["sub"]}
        )
    )

    for team in teams:
        team["_id"] = str(team["_id"])

    return teams

@router.put("/teams/{team_id}")
def update_team(
    team_id: str,
    team: TeamCreate,
    current_user=Depends(get_current_user)
):
    existing_team = team_collection.find_one(
        {
            "_id": ObjectId(team_id),
            "owner": current_user["sub"]
        }
    )

    if not existing_team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    team_collection.update_one(
        {
            "_id": ObjectId(team_id)
        },
        {
            "$set": {
                "name": team.name,
                "description": team.description,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {
        "message": "Team Updated Successfully"
    }

@router.delete("/teams/{team_id}")
def delete_team(
    team_id: str,
    current_user=Depends(get_current_user)
):
    existing_team = team_collection.find_one(
        {
            "_id": ObjectId(team_id),
            "owner": current_user["sub"]
        }
    )

    if not existing_team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    team_collection.delete_one(
        {
            "_id": ObjectId(team_id)
        }
    )

    return {
        "message": "Team Deleted Successfully"
    }

@router.post("/teams/{team_id}/members")
def add_member(
    team_id: str,
    member: Member,
    current_user=Depends(get_current_user)
):

    existing_team = team_collection.find_one(
        {
            "_id": ObjectId(team_id),
            "owner": current_user["sub"]
        }
    )

    if not existing_team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    team_collection.update_one(
        {
            "_id": ObjectId(team_id)
        },
        {
            "$addToSet": {
                "members": member.email
            }
        }
    )

    return {
        "message": "Member Added Successfully"
    }

@router.delete("/teams/{team_id}/members/{email}")
def remove_member(
    team_id: str,
    email: str,
    current_user=Depends(get_current_user)
):

    existing_team = team_collection.find_one(
        {
            "_id": ObjectId(team_id),
            "owner": current_user["sub"]
        }
    )

    if not existing_team:
        raise HTTPException(
            status_code=404,
            detail="Team not found"
        )

    team_collection.update_one(
        {
            "_id": ObjectId(team_id)
        },
        {
            "$pull": {
                "members": email
            }
        }
    )

    return {
        "message": "Member Removed Successfully"
    }