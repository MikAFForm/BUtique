from app.services.auth.auth_login.auth_login import execute as auth_login_execute
from app.services.auth.create_OTP.create_otp import execute as create_otp_execute
from app.services.auth.auth_OTP.auth_otp import execute as auth_otp_execute

def resolve_login_user(email: str, password: str):
    return auth_login_execute(email=email, password=password)

def resolve_create_otp(email: str):
    return create_otp_execute(email=email)

def resolve_auth_otp(email: str, otp : int):
    return auth_otp_execute(email=email, otp=otp)
