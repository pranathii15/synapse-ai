from app.database.database import db

users_collection = db["users"]


def get_user_by_email(email: str):
    return users_collection.find_one({"email": email})


def get_user_profile(email: str):
    user = users_collection.find_one(
        {"email": email},
        {"password": 0}
    )

    if user:
        user["_id"] = str(user["_id"])

    return user