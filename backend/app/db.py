import os
from functools import lru_cache

from dotenv import load_dotenv
from supabase import Client, create_client

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
ENV_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", ".env.local"))
load_dotenv(ENV_PATH)


@lru_cache
def get_supabase_client() -> Client:
    url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not service_role_key:
        raise RuntimeError(
            "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
        )

    return create_client(url, service_role_key)


supabase = get_supabase_client()
