from ...services.seller.seller_service import (
    get_seller_product_detail,
    update_product,
    delete_product
)

def resolve_seller_product_detail(info, product_id: str):
    return get_seller_product_detail(info, product_id)

def resolve_delete_product(info, product_id: str):
    return delete_product(info, product_id)

def resolve_update_product(info, product_id: str, data: dict):
    return update_product(info, product_id, data)
