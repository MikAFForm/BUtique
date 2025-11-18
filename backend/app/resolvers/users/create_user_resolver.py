from ....services.users.create_user.create_user import execute as create_user_execute


def resolve(name: str, email: str) -> dict:
    return create_user_execute(name, email)
