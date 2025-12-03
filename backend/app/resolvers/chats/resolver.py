from app.services.chats.chat_sessions import fetch_sessions, create_session
from app.services.chats.messages import fetch_messages_by_session, create_message


def resolve_chat_sessions(
    buyer_id: str | None = None,
    seller_id: str | None = None,
    product_id: str | None = None,
):
    return fetch_sessions(buyer_id=buyer_id, seller_id=seller_id, product_id=product_id)


def resolve_messages_by_session(session_id: str):
    return fetch_messages_by_session(session_id)


def resolve_create_chat_session(product_id: str, buyer_id: str, seller_id: str):
    return create_session(product_id=product_id, buyer_id=buyer_id, seller_id=seller_id)


def resolve_send_message(session_id: str, sender_id: str, body: str):
    return create_message(session_id=session_id, sender_id=sender_id, body=body)
