from ...services.products.product_service import (
    execute_get_all_products,
    execute_create_product,
)

def resolve_products(info):
    return execute_get_all_products(info)


def resolve_create_product(info, data):
    return execute_create_product(data.__dict__)
