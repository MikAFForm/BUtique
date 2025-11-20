from app.services.users.create_user.create_user import execute as create_user_execute
from app.services.users.create_password.create_password import execute as create_password_execute


def resolve_create_user(name: str, email: str, password: str) -> dict:
    user = create_user_execute(name, email)
    create_password_execute(user["id"], password)
    return user


    
