from ...services.products.product_service import (
    execute_get_all_products,
    execute_create_product,
)


def resolve_products(info):
    return execute_get_all_products()


def resolve_create_product(info, data):
    product_dict = {
        key: getattr(value, "value", value)
        for key, value in data.__dict__.items()
    }
    return execute_create_product(product_dict)
