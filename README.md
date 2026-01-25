# SmarterMCP OAuth Platform

OAuth 2.0 authorization_code flow implementation with JWT-based authorization codes, following MCP-first architecture.

## Features
- ✅ JWT authorization codes with `aud` and `jti` validation
- ✅ One-time use codes (optional Redis-based)
- ✅ Audience validation to prevent cross-client token reuse
- ✅ MCP as single authority (no direct Odoo access)
- ✅ Full audit logging
- ✅ Automated end-to-end testing

## Quick Start
```bash
# Install dependencies
pip install -r requirements.txt

# Run tests
make test-headless

# Run server
make run
```

## Endpoints
- `GET /oauth/consent` - Authorization consent screen
- `POST /oauth/token` - Token exchange (code → access_token)

## Environment Variables
```bash
export MCP_JWT_SECRET="your-jwt-secret"
export MCP_ACCESS_TOKEN_SECRET="your-access-token-secret"  
export MCP_REFRESH_TOKEN_SECRET="your-refresh-token-secret"
```

## Testing
```bash
# Unit tests
make test

# End-to-end tests
make test-headless
```

## Architecture
```
Client App → /oauth/consent → MCP → Supabase (validate session/scopes) → Generate JWT code
Client App → /oauth/token → MCP → Verify JWT code → Generate access_token
```

## Security
- JWT codes expire in 2 minutes
- Audience validation prevents token reuse
- JTI prevents replay attacks
- All flows audited in `audit_log`