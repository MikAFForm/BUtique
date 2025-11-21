from app.db import supabase
from app.utils.datetime import parse_datetime


def execute(name: str, email: str, password: str) -> dict:
    # Insert user with name/email
    user_response = (
        supabase.table("users")
        .insert({"name": name, "email": email})
        .execute()
    )
    user_data = getattr(user_response, "data", None)
    if not user_data:
        raise RuntimeError("Supabase returned no user data for create_user.")
    user = user_data[0]

    # Insert password tied to user_id
    pwd_response = (
        supabase.table("passwords")
        .insert({"user_id": user["id"], "password": password})
        .execute()
    )
    pwd_data = getattr(pwd_response, "data", None)
    if not pwd_data:
        raise RuntimeError("Supabase returned no password data for create_user.")

    user["created_at"] = parse_datetime(user.get("created_at"))
    user["updated_at"] = parse_datetime(user.get("updated_at"))

    return user
