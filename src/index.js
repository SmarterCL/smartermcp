console.log('🚀 MCP INDEX LOADED', __filename);

const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// Import update checker, tools and middleware
const UpdateChecker = require('../scouts/update-checker');
const OdooCreateTenantAction = require('../actions/odoo-create-tenant-action');
const N8nOdooConnector = require('../tools/n8n-odoo-connector');
const MCPAuthMiddleware = require('../middleware/auth');

const app = express();
app.use(express.json());

// Initialize authentication middleware
const authMiddleware = new MCPAuthMiddleware();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'smartermcp', version: '1.0.0' });
});

// Listar tenants
app.get('/api/tenants', async (req, res) => {
  const { data, error } = await supabase
    .from('tenants')
    .select('*');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Crear tenant (preparación 24h)
app.post('/api/tenants', async (req, res) => {
  const { name, email, phone, rut, products } = req.body;

  const { data, error } = await supabase
    .from('tenants')
    .insert([{
      name,
      email,
      phone,
      rut,
      products: JSON.stringify(products),
      status: 'preparing',
      created_at: new Date().toISOString()
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });

  // Enviar notificación (24h)
  console.log(`📧 Notificación enviada a ${email}`);
  console.log(`📱 WhatsApp a ${phone}: Tenant en preparación (24h)`);

  res.json(data[0]);
});

// Aprovisionar tenant
app.post('/api/tenants/:id/provision', async (req, res) => {
  const { id } = req.params;

  console.log(`🔧 Aprovisionando tenant ${id}...`);

  // Aquí irán los scouts
  // - Scout Cloudflare: DNS
  // - Scout Supabase: DB
  // - Scout Dokploy: Deploy
  // - Scout WhatsApp: Configuración

  const { data, error } = await supabase
    .from('tenants')
    .update({ status: 'active', provisioned_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Tenant aprovisionado', data: data[0] });
});

// Nuevo endpoint para ejecutar acciones MCP
app.post('/api/mcp/execute', async (req, res) => {
  const { tenant, action, context } = req.body;

  console.log(`🚀 Executing MCP action: ${action} for tenant: ${tenant}`);

  // Validar contrato MCP
  if (!tenant || !action) {
    return res.status(400).json({
      error: 'Missing required fields: tenant and action'
    });
  }

  // Verificar que el tenant exista y tenga suscripción activa
  const { data: tenantData, error: tenantError } = await supabase
    .from('tenants')
    .select('*')
    .eq('business_name', tenant)
    .single();

  if (tenantError || !tenantData) {
    return res.status(404).json({
      error: `Tenant ${tenant} not found`,
      state: 'SAFE-BLOCK'
    });
  }

  if (tenantData.status !== 'active') {
    console.log(`🔒 Tenant ${tenant} is not active, blocking execution`);
    return res.status(403).json({
      error: `Subscription for tenant ${tenant} is not active`,
      state: 'SAFE-BLOCK'
    });
  }

  // Validar que haya secretos disponibles para el proveedor
  const provider = action.split('.')[0]; // Extraer proveedor de la acción
  const hasSecrets = await validateSecrets(tenant, provider);

  if (!hasSecrets) {
    console.log(`🔒 Required secrets not available for tenant: ${tenant}, provider: ${provider}`);
    return res.status(403).json({
      error: `Required secrets not available for ${provider}`,
      state: 'SAFE-BLOCK'
    });
  }

  try {
    // Ejecutar la acción específica
    let result;

    switch (action) {
      case 'odoo.create_tenant':
        const odooAction = new OdooCreateTenantAction();
        result = await odooAction.execute({ tenant, action, context });
        break;

      default:
        return res.status(400).json({
          error: `Action ${action} not supported`,
          state: 'SAFE-BLOCK'
        });
    }

    // Registrar la ejecución
    console.log(`📋 Execution result for ${action} on ${tenant}:`, result);

    res.json(result);
  } catch (error) {
    console.error(`❌ Error executing action ${action} for tenant ${tenant}:`, error);
    res.status(500).json({
      error: error.message,
      state: 'ERROR'
    });
  }
});

// Validar que los secretos estén disponibles
async function validateSecrets(tenant, provider) {
  // En una implementación real, esto verificaría en el sistema de Vault
  // Por ahora, simulamos que los secretos están disponibles si existen variables de entorno
  switch (provider) {
    case 'odoo':
      return process.env.ODOO_ADMIN_TOKEN && process.env.ODOO_MASTER_DB && process.env.ODOO_HOST;
    case 'cloudflare':
      return process.env.CF_API_TOKEN && process.env.CF_ACCOUNT_ID && process.env.CF_ZONE_ID;
    case 'n8n':
      return process.env.N8N_API_KEY && process.env.N8N_HOST;
    default:
      return false;
  }
}

// Check for updates across services
app.get('/api/updates', async (req, res) => {
  console.log('🔍 Request to check for service updates...');

  try {
    const updateChecker = new UpdateChecker();
    const updateResults = await updateChecker.execute();

    res.json(updateResults);
  } catch (error) {
    console.error('❌ Error checking for updates:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check for updates for a specific service
app.get('/api/updates/:service', async (req, res) => {
  const { service } = req.params;
  console.log(`🔍 Request to check for ${service} updates...`);

  try {
    const updateChecker = new UpdateChecker();
    const results = await updateChecker.checkAllUpdates();

    if (results[service]) {
      res.json(results[service]);
    } else {
      res.status(404).json({ error: `Service ${service} not found` });
    }
  } catch (error) {
    console.error('❌ Error checking for updates:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint for n8n-Odoo connector via MCP
app.post('/api/mcp/odoo', authMiddleware.authenticate, async (req, res) => {
  const { tenant, operation, context } = req.body;

  // Verify the token belongs to the requested tenant
  if (req.tenant !== tenant) {
    console.log(`🔒 Tenant mismatch. Token tenant: ${req.tenant}, Requested tenant: ${tenant}`);
    return res.status(403).json({
      error: 'Tenant mismatch',
      state: 'FORBIDDEN'
    });
  }

  console.log(`🚀 Executing Odoo operation: ${operation} for tenant: ${tenant}`);

  // Validate required fields
  if (!tenant || !operation) {
    return res.status(400).json({
      error: 'Missing required fields: tenant and operation'
    });
  }

  // Verify tenant exists and is active
  const { data: tenantData, error: tenantError } = await supabase
    .from('tenants')
    .select('*')
    .eq('business_name', tenant)
    .single();

  if (tenantError || !tenantData) {
    return res.status(404).json({
      error: `Tenant ${tenant} not found`,
      state: 'SAFE-BLOCK'
    });
  }

  if (tenantData.status !== 'active') {
    console.log(`🔒 Tenant ${tenant} is not active, blocking execution`);
    return res.status(403).json({
      error: `Subscription for tenant ${tenant} is not active`,
      state: 'SAFE-BLOCK'
    });
  }

  // Validate Odoo credentials are available
  const hasOdooCredentials = await validateOdooCredentials();
  if (!hasOdooCredentials) {
    console.log(`🔒 Required Odoo credentials not available`);
    return res.status(403).json({
      error: 'Required Odoo credentials not available',
      state: 'SAFE-BLOCK'
    });
  }

  try {
    const odooConnector = new N8nOdooConnector();

    let result;
    switch (operation) {
      case 'search_read':
        result = await odooConnector.searchRead(context);
        break;
      case 'create':
        result = await odooConnector.create(context);
        break;
      case 'update':
        result = await odooConnector.update(context);
        break;
      case 'delete':
        result = await odooConnector.delete(context);
        break;
      case 'execute_custom':
        result = await odooConnector.executeCustom(context);
        break;
      case 'get_model_fields':
        result = await odooConnector.getModelFields(context);
        break;
      default:
        return res.status(400).json({
          error: `Operation ${operation} not supported`,
          state: 'SAFE-BLOCK'
        });
    }

    console.log(`📋 Odoo operation result for ${operation} on ${tenant}:`, result);

    res.json(result);
  } catch (error) {
    console.error(`❌ Error executing Odoo operation ${operation} for tenant ${tenant}:`, error);
    res.status(500).json({
      error: error.message,
      state: 'ERROR'
    });
  }
});

// Validate Odoo credentials
async function validateOdooCredentials() {
  return process.env.ODOO_HOST && process.env.ODOO_DB && process.env.ODOO_USERNAME && process.env.ODOO_PASSWORD;
}

// Endpoint to generate authentication tokens
app.post('/api/token/generate', async (req, res) => {
  const { tenant, userId, permissions } = req.body;

  if (!tenant || !userId) {
    return res.status(400).json({
      error: 'Tenant and userId are required'
    });
  }

  // Verify tenant exists and is active
  const { data: tenantData, error: tenantError } = await supabase
    .from('tenants')
    .select('*')
    .eq('business_name', tenant)
    .single();

  if (tenantError || !tenantData) {
    return res.status(404).json({
      error: `Tenant ${tenant} not found`
    });
  }

  if (tenantData.status !== 'active') {
    return res.status(403).json({
      error: `Subscription for tenant ${tenant} is not active`
    });
  }

  // Generate token
  const token = authMiddleware.generateToken(tenant, userId, permissions || []);

  res.json({
    success: true,
    token: token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  });
});

const PORT = process.env.MCP_PORT || 3100;
app.listen(PORT, () => {
  console.log(`✅ SmarterMCP running on port ${PORT}`);
});
