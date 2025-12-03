from ...db import supabase
from ...utils.datetime import parse_datetime


def is_user_interested(user_id: str, product_id: str) -> bool:
    resp = (
        supabase.table("buyers")
        .select("id")
        .eq("user_id", user_id)
        .eq("product_id", product_id)
        .limit(1) 
        .execute()
    )

    if resp is None:
        return False 

    data = resp.data or []
    return len(data) > 0


def add_interest(user_id: str, product_id: str) -> dict:
    if is_user_interested(user_id, product_id):
        return {"message": "already_interested", "liked": True}

    supabase.table("buyers").insert({
        "user_id": user_id,
        "product_id": product_id,
    }).execute()

    return {"message": "interest_added", "liked": True}


def remove_interest(user_id: str, product_id: str) -> dict:
    if not is_user_interested(user_id, product_id):
        return {"message": "not_interested", "liked": False}

    supabase.table("buyers").delete() \
        .eq("user_id", user_id) \
        .eq("product_id", product_id) \
        .execute()

    return {"message": "interest_removed", "liked": False}


def toggle_interest(user_id: str, product_id: str) -> dict:
    # Prevent a user from toggling interest on their own product
    seller_resp = (
        supabase.table("products")
        .select("seller_id")
        .eq("id", product_id)
        .maybe_single()
        .execute()
    )
    seller_data = getattr(seller_resp, "data", None) or {}
    if seller_data.get("seller_id") == user_id:
        return {"message": "cannot_toggle_own_product", "liked": None}

    if is_user_interested(user_id, product_id):
        return remove_interest(user_id, product_id)
    return add_interest(user_id, product_id)


def get_interested_buyers(product_id: str):
    resp = (
        supabase.table("buyers")
        .select("user_id, users(name)")
        .eq("product_id", product_id)
        .execute()
    )

    rows = resp.data or []

    buyers = [
        {"user_id": row["user_id"], "name": row["users"]["name"]}
        for row in rows
        if row.get("users") is not None
    ]

    return {
        "count": len(buyers),
        "buyers": buyers,
    }


def get_interested_products(user_id: str):
    resp = (
        supabase.table("buyers")
        .select("product_id, products(*)")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    rows = resp.data or []

    products = []
    for row in rows:
        product = row.get("products") or {}
        if "created_at" in product:
            product["created_at"] = parse_datetime(product["created_at"])
        if "updated_at" in product:
            product["updated_at"] = parse_datetime(product["updated_at"])
        products.append(product)

    return products
