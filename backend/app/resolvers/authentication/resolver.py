from app.services.auth.auth_email.auth_email import execute as auth_email_execute
from app.services.auth.auth_password.auth_password import execute as auth_password_execute

def resolve_login_user(email: str, password: str):
    email = email.strip().lower()
    user_row = auth_email_execute(email)
    if user_row is None:
        return {
            "success": False,
            "message": "Invalid email or password.",
            "user": None,
        }

    password_row = auth_password_execute(user_row["id"], password)
    if password_row is None:
        return {
            "success": False,
            "message": "Invalid email or password.",
            "user": None,
        }

    # The schema will turn this dict into a User type
    return {
        "success": True,
        "message": "Valid Email and Password!",
        "user": user_row,  # <--- raw user dict
    }
