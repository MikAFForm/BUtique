from datetime import datetime, timezone
from app.db import supabase

def execute(email: str, otp: int) -> bool:
    now = datetime.now(timezone.utc).isoformat()

    result = (
        supabase.table("otps")
        .update({"used": True})
        .eq("email", email)
        .eq("otp", otp)
        .eq("used", False)
        .gt("expires_at", now)
        .execute()
    ).data

    return bool(result)
