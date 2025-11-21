from ...db import supabase
from ...utils.datetime import parse_datetime


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

    rows = resp.data or []

    for row in rows:
        row["created_at"] = parse_datetime(row.get("created_at"))
        row["updated_at"] = parse_datetime(row.get("updated_at"))

        if not row.get("seller_name") and row.get("seller_id"):
            row["seller_name"] = get_seller_name(row["seller_id"])

    return rows


def execute_create_product(data: dict):
    seller_id = data.get("seller_id")
    if not seller_id:
        raise ValueError("seller_id is required")

    data["seller_name"] = get_seller_name(seller_id)

    resp = supabase.table("products").insert(data).execute()

    if getattr(resp, "error", None):
        raise RuntimeError(resp.error)

    row = resp.data[0]
    row["created_at"] = parse_datetime(row.get("created_at"))
    row["updated_at"] = parse_datetime(row.get("updated_at"))

    return _to_dto(row)
