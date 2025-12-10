from app.db import supabase
from app.utils.datetime import parse_datetime


def execute(email: str, password: str) -> dict:
    # Lookup user by email
    user_response = (
        supabase.table("users")
        .select("*")
        .eq("email", email)
        .execute()
    )
    user_data = getattr(user_response, "data", None) or []
    if not user_data:
        return {
            "success": False,
            "message": "Invalid email",
            "user": None,
        }
    user_row = user_data[0]

    # Verify password from passwords table
    pwd_response = (
        supabase.table("passwords")
        .select("*")
        .eq("user_id", user_row["id"])
        .eq("password", password)
        .execute()
    )
    pwd_data = getattr(pwd_response, "data", None) or []
    if not pwd_data:
        return {
            "success": False,
            "message": "Invalid password",
            "user": None,
        }

    user_row["created_at"] = parse_datetime(user_row.get("created_at"))
    user_row["updated_at"] = parse_datetime(user_row.get("updated_at"))

    return {
        "success": True,
        "message": "Valid Email and Password!",
        "user": user_row,
    }
