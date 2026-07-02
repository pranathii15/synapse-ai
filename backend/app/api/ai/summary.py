from fastapi import APIRouter
from bson import ObjectId

from app.services.project_service import project_collection
from app.services.task_service import task_collection

from app.ai.gemini_service import ask_gemini

router = APIRouter(
    tags=["AI Summary"]
)


@router.get("/project/{project_id}/summary")
def project_summary(project_id: str):

    project = project_collection.find_one(
        {
            "_id": ObjectId(project_id)
        }
    )

    if not project:
        return {
            "message": "Project not found"
        }

    tasks = list(
        task_collection.find(
            {
                "project_id": project_id
            }
        )
    )

    context = f"""
Project Name:
{project.get("title")}

Description:
{project.get("description")}

Status:
{project.get("status")}

Tasks:
"""

    for task in tasks:

        context += f"""

Task:
{task.get("title")}

Assigned To:
{task.get("assigned_to")}

Status:
{task.get("status")}
"""

    prompt = f"""
You are an Enterprise AI Project Manager.

Generate:

1. Overall Project Summary

2. Current Progress

3. Risks

4. Suggestions

5. Next Steps

Project Information:

{context}
"""

    summary = ask_gemini(context, prompt)

    return {
        "project_summary": summary
    }