from app.services.auth.auth_login.auth_login import execute as auth_login_execute


def resolve_login_user(email: str, password: str):
    return auth_login_execute(email=email, password=password)
