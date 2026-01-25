const OdooTenantCreator = require('./odoo/odoo-tenant-creator');

class OdooCreateTenantAction {
  constructor() {
    // Obtener configuración desde variables de entorno
    this.odooHost = process.env.ODOO_HOST || 'http://odoo.smarterbot.store';
    this.masterDb = process.env.ODOO_MASTER_DB || 'master';
    this.adminPassword = process.env.ODOO_ADMIN_PASSWORD || process.env.ODOO_ADMIN_TOKEN;
  }

  async execute(contract) {
    console.log(`Executing odoo.create_tenant action for tenant: ${contract.tenant}`);
    
    // Verificar que haya suscripción activa
    if (!this.isSubscriptionActive(contract.tenant)) {
      console.log(`Subscription not active for tenant: ${contract.tenant}`);
      return {
        success: false,
        error: 'Subscription not active',
        state: 'SAFE-BLOCK'
      };
    }
    
    // Verificar que haya secretos disponibles
    if (!this.hasRequiredSecrets()) {
      console.log(`Required secrets not available for tenant: ${contract.tenant}`);
      return {
        success: false,
        error: 'Required secrets not available',
        state: 'SAFE-BLOCK'
      };
    }
    
    try {
      const creator = new OdooTenantCreator(this.odooHost, this.masterDb, this.adminPassword);
      
      // Crear base de datos para el tenant
      const dbResult = await creator.createTenantDb(contract.tenant);
      if (!dbResult.success) {
        return {
          success: false,
          error: dbResult.error,
          state: 'ERROR'
        };
      }
      
      // Registrar el tenant
      const registrationResult = await creator.registerTenant(
        contract.tenant,
        {
          dbName: dbResult.dbName,
          createdAt: new Date().toISOString(),
          contract: contract
        }
      );
      
      if (!registrationResult.success) {
        return {
          success: false,
          error: registrationResult.error,
          state: 'ERROR'
        };
      }
      
      // Generar URL para el tenant
      const tenantUrl = await creator.generateTenantUrl(contract.tenant, dbResult.dbName);
      
      console.log(`Tenant ${contract.tenant} created successfully with URL: ${tenantUrl}`);
      
      return {
        success: true,
        state: 'COMPLETE',
        result: {
          tenantId: contract.tenant,
          dbName: dbResult.dbName,
          url: tenantUrl,
          message: dbResult.message
        }
      };
      
    } catch (error) {
      console.error(`Error executing odoo.create_tenant for ${contract.tenant}:`, error);
      return {
        success: false,
        error: error.message,
        state: 'ERROR'
      };
    }
  }
  
  isSubscriptionActive(tenantName) {
    // En una implementación real, esto verificaría en la base de datos
    // si la suscripción del tenant está activa
    console.log(`Checking subscription status for tenant: ${tenantName}`);
    
    // Simular verificación de suscripción activa
    // En el sistema real, esto consultaría la tabla de tenants en Supabase
    return true; // Asumiendo que está activo para el MVP
  }
  
  hasRequiredSecrets() {
    // Verificar que los secretos requeridos estén disponibles
    return this.adminPassword && this.masterDb && this.odooHost;
  }
}

module.exports = OdooCreateTenantAction;