const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// Import update checker
const UpdateChecker = require('../scouts/update-checker');

const app = express();
app.use(express.json());

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

const PORT = process.env.MCP_PORT || 3100;
app.listen(PORT, () => {
  console.log(`✅ SmarterMCP running on port ${PORT}`);
});
