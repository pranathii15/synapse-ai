from fastapi import FastAPI
from app.database.database import db
from app.api.users.profile import router as profile_router
from app.api.auth.login import router as login_router
from app.api.projects.project import router as project_router
from app.api.auth.register import router as register_router
from app.api.teams.team import router as team_router
from app.api.tasks.task import router as task_router
from app.api.documents.upload import router as upload_router
from app.api.ai.pdf import router as pdf_router
from app.api.ai.meeting import router as meeting_router
from app.api.ai.recommendation import router as recommendation_router
from app.api.ai.summary import router as summary_router
from app.api.ai.document_summary import router as document_summary_router
from app.api.ai.daily_summary import router as daily_summary_router
from app.api.ai.reminders import router as reminder_router
from app.api.ai.tomorrow import router as tomorrow_router
from app.api.ai.notifications import router as notification_router
from app.api.ai.chat_history import router as chat_history_router


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
app.include_router(pdf_router)
app.include_router(meeting_router)
app.include_router(recommendation_router)
app.include_router(summary_router)
app.include_router(document_summary_router)
app.include_router(daily_summary_router)
app.include_router(reminder_router)
app.include_router(tomorrow_router)
app.include_router(notification_router)
app.include_router(chat_history_router)

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