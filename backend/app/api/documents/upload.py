from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from uuid import uuid4
import shutil
import os

router = APIRouter(tags=["Documents"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
def upload_file(file: UploadFile = File(...)):
    filename = f"{uuid4()}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    print("UPLOAD FOLDER:", UPLOAD_FOLDER)
    print("FILE PATH:", filepath)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "File Uploaded Successfully",
        "filename": filename
    }


@router.get("/files/{filename}")
def get_file(filename: str):
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    return FileResponse(
        filepath,
        filename=filename
    )