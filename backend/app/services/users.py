from ..db import supabase


def create_user(name: str, email: str) -> dict:
    response = (
        supabase.table("users")
        .insert({"name": name, "email": email})
        .select("*")
        .single()
        .execute()
    )
    data = getattr(response, "data", None)
    if data is None:
        raise RuntimeError("Supabase returned no data for create_user.")
    return data
