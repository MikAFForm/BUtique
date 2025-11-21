from ...db import supabase

class ProductDTO:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


def _to_dto(row: dict) -> ProductDTO:
    return ProductDTO(**row)


def get_seller_name(seller_id: str) -> str | None:
    resp = (
        supabase.table("users")
        .select("name")
        .eq("id", seller_id)
        .maybe_single()
        .execute()
    )

    data = getattr(resp, "data", None)
    return data["name"] if data else None


def execute_get_all_products():
    resp = (
        supabase
        .table("products")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    if getattr(resp, "error", None):
        raise RuntimeError(resp.error)
    return resp.data or []



def execute_create_product(data: dict):
    seller_id = data.get("seller_id")
    if not seller_id:
        raise ValueError("seller_id is required")

    data["seller_name"] = get_seller_name(seller_id)

    resp = supabase.table("products").insert(data).execute()

    if getattr(resp, "error", None):
        raise RuntimeError(resp.error)

    row = resp.data[0]
    return _to_dto(row)