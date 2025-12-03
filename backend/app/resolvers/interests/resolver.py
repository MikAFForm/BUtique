from ...services.interests.interest_service import (
    add_interest,
    remove_interest,
    is_user_interested,
    toggle_interest,
    get_interested_buyers,
    get_interested_products,
)

def resolve_add_interest(info, user_id: str, product_id: str):
    return add_interest(user_id, product_id)


def resolve_remove_interest(info, user_id: str, product_id: str):
    return remove_interest(user_id, product_id)


def resolve_is_user_interested(info, user_id: str, product_id: str) -> bool:
    return is_user_interested(user_id, product_id)


def resolve_toggle_interest(info, user_id: str, product_id: str):
    return toggle_interest(user_id, product_id)


def resolve_interested_buyers(info, product_id: str):
    return get_interested_buyers(product_id)


def resolve_interested_products(info, user_id: str):
    return get_interested_products(user_id)
