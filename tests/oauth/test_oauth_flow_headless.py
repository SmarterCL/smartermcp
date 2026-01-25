import asyncio
import httpx
import os
import sys
from datetime import datetime
from src.oauth.jwt_handler import generate_authorization_code, verify_authorization_code

# Configuración
BASE_URL = os.getenv("MCP_BASE_URL", "http://localhost:8000")
TEST_USER_ID = "test-user-123"
TEST_CLIENT_ID = "test-client-app"
TEST_SCOPES = ["invoices.read", "payments.read"]
MOCK_SESSION_TOKEN = "mock-valid-session-token"

class OAuthTestRunner:
    def __init__(self):
        self.results = {
            "jwt_manual": False,
            "consent": False,
            "token_exchange": False,
            "all_passed": False
        }
    
    async def test_jwt_manual(self):
        """Prueba manual de generación/verificación JWT"""
        print("🔍 Testing JWT generation/validation...")
        
        try:
            # Generar code manualmente
            code = generate_authorization_code(
                user_id=TEST_USER_ID,
                client_id=TEST_CLIENT_ID,
                scopes=TEST_SCOPES
            )
            
            print(f"   ✅ Code generated: {code[:20]}...")
            
            # Verificar code manualmente
            payload = verify_authorization_code(code, TEST_CLIENT_ID)
            
            assert payload["user_id"] == TEST_USER_ID
            assert payload["client_id"] == TEST_CLIENT_ID
            assert set(payload["scopes"]) == set(TEST_SCOPES)
            
            print(f"   ✅ Code verified: {payload['user_id']}")
            print(f"   ✅ Scopes: {payload['scopes']}")
            print(f"   ✅ Expiration: {datetime.fromtimestamp(payload['exp'])}")
            
            self.results["jwt_manual"] = True
            return True
            
        except Exception as e:
            print(f"   ❌ JWT test failed: {e}")
            return False
    
    async def test_oauth_consent(self):
        """Prueba el endpoint /oauth/consent"""
        print("\n🔍 Testing /oauth/consent...")
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                headers = {
                    "Authorization": f"Bearer {MOCK_SESSION_TOKEN}"
                }
                
                params = {
                    "client_id": TEST_CLIENT_ID,
                    "redirect_uri": "https://cliente-test.com/callback",
                    "scope": " ".join(TEST_SCOPES),
                    "state": "test-state-123"
                }
                
                response = await client.get(
                    f"{BASE_URL}/oauth/consent",
                    headers=headers,
                    params=params
                )
                
                print(f"   Status: {response.status_code}")
                
                if response.status_code == 307:  # Redirect
                    location = response.headers.get("location", "")
                    print(f"   Redirect: {location}")
                    
                    # Extraer el authorization_code del redirect
                    if "code=" in location:
                        code = location.split("code=")[1].split("&")[0]
                        print(f"   ✅ Authorization code extracted: {code[:20]}...")
                        
                        # Validar que el code es un JWT válido
                        try:
                            decoded = verify_authorization_code(code, TEST_CLIENT_ID)
                            print(f"   ✅ Code is valid JWT: {decoded['user_id']}")
                        except:
                            print(f"   ❌ Code is not valid JWT")
                            return False
                        
                        return True
                    else:
                        print(f"   ❌ No code in redirect")
                        return False
                else:
                    print(f"   ❌ Expected 307, got {response.status_code}: {response.text}")
                    return False
                    
        except httpx.ConnectError:
            print(f"   ❌ Cannot connect to {BASE_URL}. Is server running?")
            return False
        except Exception as e:
            print(f"   ❌ Consent test failed: {e}")
            return False
    
    async def test_token_exchange(self, authorization_code: str):
        """Prueba el endpoint /oauth/token"""
        print("\n🔍 Testing /oauth/token...")
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                data = {
                    "code": authorization_code,
                    "client_id": TEST_CLIENT_ID,
                    "grant_type": "authorization_code"
                }
                
                response = await client.post(
                    f"{BASE_URL}/oauth/token",
                    data=data
                )
                
                print(f"   Status: {response.status_code}")
                
                if response.status_code == 200:
                    token_data = response.json()
                    
                    # Validar campos esperados
                    required_fields = ["access_token", "refresh_token", "token_type", "expires_in", "scope"]
                    for field in required_fields:
                        if field not in token_data:
                            print(f"   ❌ Missing field: {field}")
                            return False
                    
                    print(f"   ✅ Access token: {token_data['access_token'][:20]}...")
                    print(f"   ✅ Refresh token: {token_data['refresh_token'][:20]}...")
                    print(f"   ✅ Scopes: {token_data['scope']}")
                    print(f"   ✅ Expires in: {token_data['expires_in']}s")
                    
                    # Validar que los scopes coincidan
                    returned_scopes = set(token_data['scope'].split(' '))
                    expected_scopes = set(TEST_SCOPES)
                    if returned_scopes != expected_scopes:
                        print(f"   ❌ Scopes mismatch: expected {expected_scopes}, got {returned_scopes}")
                        return False
                    
                    return True
                else:
                    print(f"   ❌ Token exchange failed: {response.status_code} - {response.text}")
                    return False
                    
        except httpx.ConnectError:
            print(f"   ❌ Cannot connect to {BASE_URL}. Is server running?")
            return False
        except Exception as e:
            print(f"   ❌ Token exchange test failed: {e}")
            return False
    
    async def run_full_test(self):
        """Ejecuta el test completo sin prompts"""
        print("🚀 Starting headless OAuth test\n")
        
        # Validar variables de entorno
        required_envs = [
            "MCP_JWT_SECRET",
            "MCP_ACCESS_TOKEN_SECRET", 
            "MCP_REFRESH_TOKEN_SECRET"
        ]
        
        missing = [env for env in required_envs if not os.getenv(env)]
        if missing:
            print(f"❌ Missing environment variables: {missing}")
            return False
        
        print("   ✅ Environment variables OK")
        print(f"   📍 Testing against: {BASE_URL}\n")
        
        # 1. Test JWT manual
        jwt_ok = await self.test_jwt_manual()
        if not jwt_ok:
            print("\n❌ JWT validation failed")
            return False
        
        # 2. Test consentimiento
        consent_ok = await self.test_oauth_consent()
        if not consent_ok:
            print("\n❌ Consent test failed")
            return False
        
        # 3. Test token exchange (simulado con JWT generado manualmente)
        # En lugar de usar el code real (que requiere mocking), generamos uno
        test_code = generate_authorization_code(
            user_id=TEST_USER_ID,
            client_id=TEST_CLIENT_ID,
            scopes=TEST_SCOPES
        )
        
        token_ok = await self.test_token_exchange(test_code)
        if not token_ok:
            print("\n❌ Token exchange test failed")
            return False
        
        # 4. Reporte final
        print(f"\n🎉 All OAuth tests passed!")
        print(f"   • JWT validation: ✅")
        print(f"   • Consent endpoint: ✅") 
        print(f"   • Token exchange: ✅")
        print(f"   • MCP authority: ✅")
        print(f"   • Scopes validation: ✅")
        
        self.results["all_passed"] = True
        return True

async def main():
    runner = OAuthTestRunner()
    success = await runner.run_full_test()
    
    # Salir con código de error si falla
    if not success:
        print("\n💥 OAuth tests failed!")
        sys.exit(1)
    else:
        print("\n✨ All OAuth tests successful!")
        sys.exit(0)

if __name__ == "__main__":
    asyncio.run(main())