from app.db import supabase


def execute(user_id: str, password: str) -> dict | None:
    response = (
        supabase.table("passwords")
        .select("*")
        .eq("user_id", user_id)
        .eq("password", password)   
        .execute()
    )
    data = getattr(response, "data", None)
    if not data:
        return None
    return data[0]