from fastapi import FastAPI
from app.database.database import db
from app.api.users.profile import router as profile_router
from app.api.auth.login import router as login_router
from app.api.projects.project import router as project_router
from app.api.auth.register import router as register_router
from app.api.teams.team import router as team_router
from app.api.tasks.task import router as task_router
from app.api.documents.upload import router as upload_router

app = FastAPI(
    title="SynapseAI API",
    version="1.0.0",
    description="Enterprise AI Workspace Backend"
)
app.include_router(register_router)
app.include_router(login_router)
app.include_router(profile_router)
app.include_router(project_router)
app.include_router(team_router)
app.include_router(task_router)
app.include_router(upload_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to SynapseAI 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "Running Successfully ✅"
    }

@app.get("/db-test")
def db_test():
    collections = db.list_collection_names()

    return {
        "database": "Connected Successfully ✅",
        "collections": collections
    }