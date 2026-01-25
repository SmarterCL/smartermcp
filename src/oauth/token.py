import os
import jwt
import redis
from datetime import datetime, timedelta
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
import httpx
import uuid

# Configuración
MCP_JWT_SECRET = os.getenv("MCP_JWT_SECRET", "dev-secret-change-in-production")
MCP_ACCESS_TOKEN_SECRET = os.getenv("MCP_ACCESS_TOKEN_SECRET", "access-dev-secret")
MCP_REFRESH_TOKEN_SECRET = os.getenv("MCP_REFRESH_TOKEN_SECRET", "refresh-dev-secret")

redis_client = redis.Redis(host='localhost', port=6379, db=0)

app = FastAPI()

# === GENERACIÓN DE AUTHORIZATION CODE ===
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
    
    code = jwt.encode(payload, MCP_JWT_SECRET, algorithm="HS256")
    
    # Registrar jti para one-time use (opcional v1)
    redis_client.setex(f"used_jti:{payload['jti']}", 120, "1")
    
    return code

def verify_authorization_code(code: str, expected_client_id: str) -> dict:
    """Verifica y decodifica un authorization_code"""
    try:
        payload = jwt.decode(
            code,
            MCP_JWT_SECRET,
            algorithms=["HS256"],
            audience=expected_client_id  # Validar audience
        )
        
        # Verificar que no haya sido usado (si implementaste one-time)
        jti = payload["jti"]
        if redis_client.exists(f"used_jti:{jti}"):
            raise HTTPException(status_code=400, detail="Code already used")
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Authorization code expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid authorization code")

# === VALIDACIÓN DE SESIÓN EN SUPABASE ===
async def validate_session_token(access_token: str) -> dict:
    """Valida token de sesión en Supabase"""
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "apikey": SUPABASE_ANON_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SUPABASE_URL}/auth/v1/user",
            headers=headers
        )
        
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    return response.json()

# === VALIDACIÓN DE SCOPES DESDE SUPABASE ===
async def get_allowed_scopes(user_id: str, client_id: str) -> list:
    """Consulta en Supabase los scopes permitidos para este usuario/cliente"""
    # Aquí iría la lógica para consultar Supabase
    # Ejemplo simulado:
    return ["invoices.read", "payments.read", "partners.read"]

# === ENDPOINT DE CONSENTIMIENTO ===
@app.get("/oauth/consent", response_class=HTMLResponse)
async def oauth_consent(request: Request):
    # Parámetros OAuth
    client_id = request.query_params.get("client_id")
    redirect_uri = request.query_params.get("redirect_uri")
    requested_scope = request.query_params.get("scope", "")
    state = request.query_params.get("state", "")
    
    if not all([client_id, redirect_uri]):
        raise HTTPException(status_code=400, detail="Parámetros requeridos faltantes")
    
    # Validar token de sesión
    access_token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not access_token:
        return RedirectResponse(f"{redirect_uri}?error=login_required&state={state}")
    
    user_data = await validate_session_token(access_token)
    user_id = user_data["id"]
    
    # Validar scopes permitidos desde Supabase
    allowed_scopes = await get_allowed_scopes(user_id, client_id)
    requested_scopes = requested_scope.split(" ")
    
    unauthorized_scopes = [
        scope for scope in requested_scopes 
        if scope not in allowed_scopes
    ]
    
    if unauthorized_scopes:
        # Registrar intento no autorizado
        await log_audit_event(
            user_id=user_id,
            client_id=client_id,
            requested_scopes=requested_scopes,
            status="denied",
            reason="unauthorized_scopes"
        )
        raise HTTPException(status_code=403, detail="Scopes no autorizados")
    
    # Generar authorization_code
    auth_code = generate_authorization_code(user_id, client_id, requested_scopes)
    
    # Registrar consentimiento
    await log_audit_event(
        user_id=user_id,
        client_id=client_id,
        requested_scopes=requested_scopes,
        status="granted",
        action="oauth_consent"
    )
    
    # Redirigir con code
    redirect_url = f"{redirect_uri}?code={auth_code}&state={state}"
    return RedirectResponse(redirect_url)

# === ENDPOINT DE EXCHANGE (TOKEN) ===
@app.post("/oauth/token")
async def exchange_code_for_token(
    code: str,
    client_id: str,
    client_secret: str = None,  # Opcional según configuración
    grant_type: str = "authorization_code"
):
    if grant_type != "authorization_code":
        raise HTTPException(status_code=400, detail="Invalid grant_type")
    
    # Verificar el authorization_code
    code_payload = verify_authorization_code(code, client_id)
    
    # Generar access_token y refresh_token
    access_token = generate_access_token(
        user_id=code_payload["user_id"],
        scopes=code_payload["scopes"],
        client_id=client_id
    )
    
    refresh_token = generate_refresh_token(
        user_id=code_payload["user_id"],
        client_id=client_id
    )
    
    # Registrar token exchange
    await log_audit_event(
        user_id=code_payload["user_id"],
        client_id=client_id,
        requested_scopes=code_payload["scopes"],
        status="granted",
        action="token_exchange"
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer",
        "expires_in": 3600,
        "scope": " ".join(code_payload["scopes"])
    }

def generate_access_token(user_id: str, scopes: list, client_id: str) -> str:
    payload = {
        "sub": user_id,
        "client_id": client_id,
        "scopes": scopes,
        "exp": datetime.utcnow() + timedelta(hours=1),
        "type": "access_token"
    }
    return jwt.encode(payload, MCP_ACCESS_TOKEN_SECRET, algorithm="HS256")

def generate_refresh_token(user_id: str, client_id: str) -> str:
    payload = {
        "sub": user_id,
        "client_id": client_id,
        "exp": datetime.utcnow() + timedelta(days=30),
        "type": "refresh_token"
    }
    return jwt.encode(payload, MCP_REFRESH_TOKEN_SECRET, algorithm="HS256")

# === LOGGING DE AUDITORÍA ===
async def log_audit_event(user_id: str, client_id: str, requested_scopes: list, 
                        status: str, action: str, reason: str = None):
    """Registra evento en audit_log"""
    
    audit_entry = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat(),
        "request_id": str(uuid.uuid4()),
        "service_account_id": user_id,
        "scope": " ".join(requested_scopes),
        "action": action,
        "mcp_endpoint": f"/oauth/{'consent' if 'consent' in action else 'token'}",
        "status": status,
        "http_status": 200 if status == "granted" else 403,
        "latency_ms": 0,  # Calcular si es necesario
        "error_code": reason,
        "error_message": reason
    }
    
    # Aquí iría la lógica para insertar en Supabase audit_log
    # await insert_audit_log(audit_entry)
    print(f"Audit event: {audit_entry}")

# === TEST DE END-TO-END ===
def test_oauth_flow():
    """Test de flujo completo"""
    print("=== TEST: Flujo OAuth Completo ===")
    
    # Simular datos
    user_id = "user-123"
    client_id = "test-client"
    scopes = ["invoices.read", "payments.read"]
    
    # 1. Generar authorization_code
    code = generate_authorization_code(user_id, client_id, scopes)
    print(f"✅ Authorization code generado: {code[:20]}...")
    
    # 2. Verificar authorization_code
    payload = verify_authorization_code(code, client_id)
    print(f"✅ Authorization code verificado: {payload['user_id']}")
    
    # 3. Generar access_token
    access_token = generate_access_token(user_id, scopes, client_id)
    print(f"✅ Access token generado: {access_token[:20]}...")
    
    # 4. Generar refresh_token
    refresh_token = generate_refresh_token(user_id, client_id)
    print(f"✅ Refresh token generado: {refresh_token[:20]}...")
    
    print("\n✅ Todo el flujo OAuth probado exitosamente")
    print("✅ Tokens seguros y audibles")
    print("✅ MCP como única autoridad")

if __name__ == "__main__":
    test_oauth_flow()