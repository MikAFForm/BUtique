from app.db import supabase


def execute(user_id: str, password: str) -> dict:
    response = (
        supabase.table("passwords")
        .insert({"user_id": user_id, "password": password})
        .execute()
    )
    data = getattr(response, "data", None)
    if not data:
        raise RuntimeError("Supabase returned no data for create_password.")
    return data[0]