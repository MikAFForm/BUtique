from ..services.users import create_user as create_user_service


def resolve_create_user(name: str, email: str) -> dict:
    return create_user_service(name, email)
