import random
from datetime import datetime, timedelta, timezone
from app.db import supabase
import os
import smtplib
from email.mime.text import MIMEText

SENDER_EMAIL = "butique66@gmail.com"
SENDER_PASSWORD = os.getenv("APP_PASS") 

def execute(email: str) -> dict:
    # Validate BU email
    if not email.endswith("@bu.edu"):
        return {"success": False, "message": "Email must be a BU email."}
    # Check for existing unexpired OTP
    existing = (
        supabase.table("otps")
        .select("expires_at")
        .eq("email", email)
        .eq("used", False)
        .gt("expires_at", datetime.now(timezone.utc).isoformat())
        .limit(1)
        .execute()
    ).data

    if existing:
        return {
            "success": False,
            "message": "A verification code has already been sent. Please check your email."
        }


    # Generate and store new OTP
    otp = random.randint(100000, 999999)
    
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=3)
    expires_at_str = expires_at.isoformat()

    supabase.table("otps").insert({
        "email": email,
        "otp": otp,
        "expires_at": expires_at_str,
        "used": False
    }).execute()

    #Email Section
    msg = MIMEText(f"<p>Your verification code is <b>{otp}</b></p>", "html")
    msg["Subject"] = "Your BU Verification Code"
    msg["From"] = "butique66@gmail.com"
    msg["To"] = email

    smtp_server = "smtp.gmail.com"
    port = 587


    with smtplib.SMTP(smtp_server, port) as server:
        server.starttls()
        server.login("butique66@gmail.com", SENDER_PASSWORD)
        server.sendmail("butique66@gmail.com", [email], msg.as_string())

    return {"success": True, "message": "OTP sent to BU email"}
