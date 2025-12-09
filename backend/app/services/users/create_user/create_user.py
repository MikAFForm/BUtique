from app.db import supabase
from app.utils.datetime import parse_datetime
import re


def execute(name: str, email: str, password: str) -> dict:
    # Make sure email is valid
    if not email.endswith("@bu.edu"):
        raise ValueError("Email must end with @bu.edu")

    # Make sure password is valid
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters")

    if not re.search(r"[A-Z]", password):
        raise ValueError("Password must contain an uppercase letter")

    if not re.search(r"[a-z]", password):
        raise ValueError("Password must contain a lowercase letter")

    if not re.search(r"\d", password):
        raise ValueError("Password must contain a number")

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise ValueError("Password must contain a special character")



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
