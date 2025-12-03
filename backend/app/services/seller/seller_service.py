from datetime import datetime, timezone
from ...db import supabase
from ...utils.datetime import parse_datetime
from ...services.interests.interest_service import get_interested_buyers
from ...services.products.product_service import get_seller_name

def _get_user_id(info):
    return info.context.get("user_id")


def get_seller_product_detail(info, product_id: str):
    user_id = _get_user_id(info)

    resp = (
        supabase.table("products")
        .select("*")
        .eq("id", product_id)
        .maybe_single()
        .execute()
    )

    product = resp.data
    if not product:
        return None

    if product["seller_id"] != user_id:
        product["interested_count"] = 0
        product["interested_buyers"] = []
        return product


    product["created_at"] = parse_datetime(product["created_at"])
    product["updated_at"] = parse_datetime(product["updated_at"])


    interest = get_interested_buyers(product_id)
    product["interested_count"] = interest["count"]
    product["interested_buyers"] = interest["buyers"]

    return product


def delete_product(info, product_id: str) -> bool:
    user_id = _get_user_id(info)

    product = get_seller_product_detail(info, product_id)
    if not product or product.get("seller_id") != user_id:
        return False

    supabase.table("products").delete().eq("id", product_id).execute()
    supabase.table("buyers").delete().eq("product_id", product_id).execute()

    return True


def update_product(info, product_id: str, data: dict):
    user_id = _get_user_id(info)

    existing = get_seller_product_detail(info, product_id)
    if not existing or existing.get("seller_id") != user_id:
        return None

    for field in ["condition", "status", "category"]:
        if hasattr(data.get(field), "value"):
            data[field] = data[field].value

    data.pop("created_at", None)

    data["updated_at"] = datetime.now(timezone.utc).isoformat()

    resp = (
        supabase.table("products")
        .update(data)
        .eq("id", product_id)
        .execute()
    )

    updated = resp.data[0]
    updated["seller_name"] = get_seller_name(updated["seller_id"])

    interest = get_interested_buyers(product_id)
    updated["interested_count"] = interest["count"]
    updated["interested_buyers"] = interest["buyers"]

    updated["created_at"] = parse_datetime(existing["created_at"])
    updated["updated_at"] = parse_datetime(updated["updated_at"])

    return updated
