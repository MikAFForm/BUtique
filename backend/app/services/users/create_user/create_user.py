from app.db import supabase


def execute(name: str, email: str) -> dict:
    response = (
        supabase.table("users")
        .insert({"name": name, "email": email})
        .execute()
    )
    data = getattr(response, "data", None)
    if not data:
        raise RuntimeError("Supabase returned no data for create_user.")
    return data[0]
