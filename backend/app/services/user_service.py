from app.database.database import db

users_collection = db["users"]


def create_user(user_data):
    return users_collection.insert_one(user_data)


def get_user_by_email(email: str):
    return users_collection.find_one({"email": email})