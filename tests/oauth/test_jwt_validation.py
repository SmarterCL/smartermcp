import pytest
import jwt
from datetime import datetime, timedelta
import os
from src.oauth.jwt_handler import generate_authorization_code, verify_authorization_code

# Config
SECRET = os.getenv("MCP_JWT_SECRET", "test-secret")

def test_generate_valid_code():
    """Test que genera un código válido con todos los claims"""
    user_id = "test-user"
    client_id = "test-client"
    scopes = ["invoices.read", "payments.read"]
    
    code = generate_authorization_code(user_id, client_id, scopes)
    
    # Verificar que es un JWT válido
    assert isinstance(code, str)
    assert len(code) > 50  # JWT típicamente largo
    
    # Decodificar sin verificar para inspeccionar claims
    decoded = jwt.decode(code, SECRET, algorithms=["HS256"], options={"verify_signature": False})
    
    assert decoded["user_id"] == user_id
    assert decoded["client_id"] == client_id
    assert set(decoded["scopes"]) == set(scopes)
    assert "exp" in decoded
    assert "iat" in decoded
    assert "type" in decoded
    assert "jti" in decoded
    assert "aud" in decoded
    assert decoded["aud"] == client_id

def test_verify_valid_code():
    """Test que verifica correctamente un código válido"""
    user_id = "test-user"
    client_id = "test-client"
    scopes = ["invoices.read"]
    
    code = generate_authorization_code(user_id, client_id, scopes)
    payload = verify_authorization_code(code, client_id)
    
    assert payload["user_id"] == user_id
    assert payload["client_id"] == client_id
    assert payload["scopes"] == scopes

def test_verify_invalid_audience():
    """Test que falla si el audience no coincide"""
    code = generate_authorization_code("user", "client1", ["read"])
    
    try:
        verify_authorization_code(code, "client2")
        assert False, "Debería haber fallado por audience incorrecto"
    except:
        assert True

def test_verify_expired_code():
    """Test que falla si el código expiró"""
    from src.oauth.jwt_handler import generate_expired_code
    
    expired_code = generate_expired_code("user", "client", ["read"])
    
    try:
        verify_authorization_code(expired_code, "client")
        assert False, "Debería haber fallado por expiración"
    except:
        assert True

def test_jti_uniqueness():
    """Test que cada código tiene un jti único"""
    code1 = generate_authorization_code("user", "client", ["read"])
    code2 = generate_authorization_code("user", "client", ["read"])
    
    decoded1 = jwt.decode(code1, SECRET, algorithms=["HS256"], options={"verify_signature": False})
    decoded2 = jwt.decode(code2, SECRET, algorithms=["HS256"], options={"verify_signature": False})
    
    assert decoded1["jti"] != decoded2["jti"]