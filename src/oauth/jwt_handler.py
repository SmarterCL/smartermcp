import jwt
import os
import redis
from datetime import datetime, timedelta
import uuid

# Config
SECRET = os.getenv("MCP_JWT_SECRET")

def generate_authorization_code(user_id: str, client_id: str, scopes: list) -> str:
    """Genera un authorization_code firmado con todas las validaciones"""
    payload = {
        "user_id": user_id,
        "client_id": client_id,
        "scopes": scopes,
        "exp": datetime.utcnow() + timedelta(minutes=2),  # 2 min
        "iat": datetime.utcnow(),
        "type": "authorization_code",
        "jti": os.urandom(16).hex(),  # Anti-replay
        "aud": client_id  # Audience validation
    }
    
    code = jwt.encode(payload, SECRET, algorithm="HS256")
    
    # Registrar jti para one-time use
    redis_client = redis.Redis(host='localhost', port=6379, db=0)
    redis_client.setex(f"used_jti:{payload['jti']}", 120, "1")
    
    return code

def verify_authorization_code(code: str, expected_client_id: str) -> dict:
    """Verifica y decodifica un authorization_code"""
    try:
        payload = jwt.decode(
            code,
            SECRET,
            algorithms=["HS256"],
            audience=expected_client_id  # Validar audience
        )
        
        # Verificar que no haya sido usado
        redis_client = redis.Redis(host='localhost', port=6379, db=0)
        jti = payload["jti"]
        if redis_client.exists(f"used_jti:{jti}"):
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail="Code already used")
        
        return payload
        
    except jwt.ExpiredSignatureError:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Authorization code expired")
    except jwt.InvalidTokenError:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Invalid authorization code")

def generate_expired_code(user_id: str, client_id: str, scopes: list) -> str:
    """Helper para tests - genera código ya expirado"""
    payload = {
        "user_id": user_id,
        "client_id": client_id,
        "scopes": scopes,
        "exp": datetime.utcnow() - timedelta(minutes=1),  # Ya expiró
        "iat": datetime.utcnow(),
        "type": "authorization_code",
        "jti": "expired-jti",
        "aud": client_id
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")