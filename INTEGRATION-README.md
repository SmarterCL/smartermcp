# SmarterMCP - n8n to Odoo Integration

This project implements a secure connection between n8n workflow automation and Odoo ERP through the SmarterMCP governance layer.

## Architecture

```
n8n Workflow → MCP Protocol → SmarterMCP → Odoo ERP
     ↑              ↓           ↑         ↓
  (Triggers)   (Governance)  (Auth)   (Business Logic)
```

## Components

### 1. SmarterMCP Server (`/src/index.js`)
- Main MCP server with authentication
- Tenant isolation
- Odoo operation endpoints
- Token generation

### 2. MCP Tools (`/tools/n8n-odoo-connector.js`)
- Odoo XML-RPC connector
- Supported operations:
  - `search_read`: Search and read records
  - `create`: Create new records
  - `update`: Update existing records
  - `delete`: Delete records
  - `execute_custom`: Execute custom methods
  - `get_model_fields`: Get model field definitions

### 3. Authentication Middleware (`/middleware/auth.js`)
- JWT-based authentication
- Tenant isolation
- Permission validation

### 4. n8n Workflows
- `enhanced-odoo-mcp-workflow.json`: Generic MCP-Odoo integration
- `odoo-crm-mcp-workflow.json`: CRM-specific operations

## Setup

### Environment Variables

Create a `.env` file in the `smartermcp` directory:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
MCP_PORT=3100
MCP_JWT_SECRET=your_jwt_secret
ODOO_HOST=http://your-odoo-host:8069
ODOO_DB=your_database_name
ODOO_USERNAME=your_username
ODOO_PASSWORD=your_password
```

### Starting the Server

```bash
cd /root/smartermcp
npm install
npm start
```

## Usage

### 1. Generate Authentication Token

```bash
curl -X POST http://localhost:3100/api/token/generate \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": "your-tenant-name",
    "userId": "your-user-id",
    "permissions": ["odoo.read", "odoo.write"]
  }'
```

### 2. Execute Odoo Operations

```bash
curl -X POST http://localhost:3100/api/mcp/odoo \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tenant": "your-tenant-name",
    "operation": "search_read",
    "context": {
      "model": "res.partner",
      "domain": [],
      "fields": ["id", "name", "email"],
      "limit": 10
    }
  }'
```

### Supported Operations

- `search_read`: Search and read records
  ```json
  {
    "operation": "search_read",
    "context": {
      "model": "res.partner",
      "domain": [["name", "ilike", "John"]],
      "fields": ["id", "name", "email"],
      "limit": 10
    }
  }
  ```

- `create`: Create new records
  ```json
  {
    "operation": "create",
    "context": {
      "model": "crm.lead",
      "values": {
        "name": "New Lead",
        "email_from": "contact@example.com"
      }
    }
  }
  ```

- `update`: Update existing records
  ```json
  {
    "operation": "update",
    "context": {
      "model": "crm.lead",
      "id": 1,
      "values": {
        "stage_id": 2
      }
    }
  }
  ```

- `get_model_fields`: Get model field definitions
  ```json
  {
    "operation": "get_model_fields",
    "context": {
      "model": "crm.lead"
    }
  }
  ```

## n8n Integration

To use this integration in n8n:

1. Deploy the workflow files to your n8n instance
2. Configure the HTTP Request node to point to your MCP server
3. Set up authentication with your JWT token
4. Use the webhook endpoints to trigger operations

## Security Features

- JWT-based authentication
- Tenant isolation
- Permission-based access control
- Request validation
- Safe operation blocking

## Testing

Run the integration tests:

```bash
node /root/test-mcp-odoo-integration.js
```

## Troubleshooting

- Ensure all environment variables are set correctly
- Verify network connectivity between services
- Check that the Odoo instance is accessible
- Validate JWT tokens are properly formatted
- Confirm tenant names match between systems