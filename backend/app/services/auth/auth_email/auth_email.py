from app.db import supabase


def execute(email: str) -> dict | None:
    response = (
        supabase.table("users")
        .select("*")
        .eq("email", email)  
        .execute()
    )
    data = getattr(response, "data", None)
    if not data:
        return None
    return data[0]