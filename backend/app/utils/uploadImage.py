import base64
import uuid
from app.db import supabase

BUCKET_NAME = "product-images"


def upload_base64_image(base64_str: str) -> str:
    try:
        if "," in base64_str:
            _, encoded = base64_str.split(",", 1)
        else:
            encoded = base64_str

        missing_padding = len(encoded) % 4
        if missing_padding:
            encoded += "=" * (4 - missing_padding)

        file_bytes = base64.b64decode(encoded) 
        file_name = f"{uuid.uuid4()}.jpg"

        supabase.storage.from_(BUCKET_NAME).upload(
            file_name,
            file_bytes,
            {"content-type": "image/jpeg"}
        )

        return supabase.storage.from_(BUCKET_NAME).get_public_url(file_name)

    except Exception as e:
        raise ValueError(f"Invalid image format: {str(e)}")
