from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime
from fastapi import Query
from app.schemas.project_schema import ProjectFile
from app.schemas.project_schema import ProjectCreate
from app.services.project_service import project_collection
from app.api.auth.dependencies import get_current_user

router = APIRouter(tags=["Projects"])


# Create Project
@router.post("/projects")
def create_project(
    project: ProjectCreate,
    current_user=Depends(get_current_user)
):
    project_data = {
        "title": project.title,
        "description": project.description,
        "owner": current_user["sub"],
        "status": "Active",
        "created_at": datetime.utcnow()
    }

    result = project_collection.insert_one(project_data)

    return {
        "message": "Project Created Successfully",
        "project_id": str(result.inserted_id)
    }


# Get My Projects
@router.get("/projects")
def get_projects(current_user=Depends(get_current_user)):
    projects = list(
        project_collection.find(
            {"owner": current_user["sub"]}
        )
    )

    for project in projects:
        project["_id"] = str(project["_id"])

    return projects

@router.get("/projects/search")
def search_projects(
    keyword: str = Query(...),
    current_user=Depends(get_current_user)
):
    projects = list(
        project_collection.find(
            {
                "owner": current_user["sub"],
                "title": {
                    "$regex": keyword,
                    "$options": "i"
                }
            },
            {
                "_id": 0
            }
        )
    )

    return projects

# Update Project
@router.put("/projects/{project_id}")
def update_project(
    project_id: str,
    project: ProjectCreate,
    current_user=Depends(get_current_user)
):
    existing_project = project_collection.find_one(
        {
            "_id": ObjectId(project_id),
            "owner": current_user["sub"]
        }
    )

    if not existing_project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    project_collection.update_one(
        {"_id": ObjectId(project_id)},
        {
            "$set": {
                "title": project.title,
                "description": project.description,
                "updated_at": datetime.utcnow()
            }
        }
    )

    return {
        "message": "Project Updated Successfully"
    }

@router.delete("/projects/{project_id}")
def delete_project(
    project_id: str,
    current_user=Depends(get_current_user)
):
    existing_project = project_collection.find_one(
        {
            "_id": ObjectId(project_id),
            "owner": current_user["sub"]
        }
    )

    if not existing_project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    project_collection.delete_one(
        {
            "_id": ObjectId(project_id)
        }
    )

    return {
        "message": "Project Deleted Successfully"
    }


@router.put("/projects/{project_id}/attach")
def attach_file(
    project_id: str,
    file: ProjectFile,
    current_user=Depends(get_current_user)
):

    project_collection.update_one(
        {
            "_id": ObjectId(project_id),
            "owner": current_user["sub"]
        },
        {
            "$push": {
                "files": file.filename
            }
        }
    )

    return {
        "message": "File Attached Successfully"
    }