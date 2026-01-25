require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Configurar cliente de Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function createMaestroyaTenant() {
  console.log('Creando tenant maestroya...');

  const { data, error } = await supabase
    .from('tenants')
    .insert([{
      rut: '76.123.456-7',
      business_name: 'MaestroYa',
      contact_email: 'maestroya@smarterbot.store',
      clerk_user_id: 'maestroya_user',
      services_enabled: { bot: true, crm: true, erp: true, workflows: true },
      chatwoot_inbox_id: null,
      botpress_workspace_id: null,
      odoo_company_id: null,
      n8n_project_id: 'maestroya_default',
      metabase_card_id: null,
      status: 'draft',  // Estado inicial
      plan: 'basic',
      primary_domain: 'maestroya.smarterbot.store',
      trial_expires_at: null,
      notes: { service: 'MaestroYa', created_by: 'mvp_setup' }
    }])
    .select();

  if (error) {
    console.error('Error creando tenant:', error);
    return;
  }

  console.log('Tenant maestroya creado exitosamente:', data);
}

// Función para simular el evento de pago que activa la suscripción
async function activateMaestroyaSubscription() {
  console.log('Activando suscripción para maestroya...');

  const { data, error } = await supabase
    .from('tenants')
    .update({
      status: 'active',
      plan: 'standard',
      updated_at: new Date().toISOString()
    })
    .eq('business_name', 'MaestroYa')
    .select();

  if (error) {
    console.error('Error activando suscripción:', error);
    return;
  }

  console.log('Suscripción de maestroya activada exitosamente:', data);
}

// Función para verificar el estado del tenant
async function checkTenantStatus() {
  console.log('Verificando estado del tenant maestroya...');

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('business_name', 'MaestroYa');

  if (error) {
    console.error('Error obteniendo estado del tenant:', error);
    return;
  }

  console.log('Estado actual del tenant maestroya:', data);
}

// Ejecutar las funciones
async function main() {
  await createMaestroyaTenant();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
  await checkTenantStatus();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
  await activateMaestroyaSubscription();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
  await checkTenantStatus();
}

main().catch(console.error);