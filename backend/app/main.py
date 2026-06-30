from fastapi import FastAPI
from app.database.database import db
from app.api.auth.register import router as register_router


app = FastAPI(
    title="SynapseAI API",
    version="1.0.0",
    description="Enterprise AI Workspace Backend"
)
app.include_router(register_router)

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