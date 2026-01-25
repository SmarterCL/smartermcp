const axios = require('axios');

class OdooTenantCreator {
  constructor(odooHost, masterDb, adminPassword) {
    this.odooHost = odooHost;
    this.masterDb = masterDb;
    this.adminPassword = adminPassword;
  }

  async createTenantDb(tenantName) {
    try {
      // Endpoint para crear base de datos en Odoo
      const response = await axios.post(`${this.odooHost}/jsonrpc`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'db',
          method: 'duplicate_database',
          args: [this.masterDb, `${tenantName}_${Date.now()}`, this.adminPassword, tenantName]
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error.message || 'Error creating database');
      }

      return {
        success: true,
        dbName: response.data.result,
        message: `Database ${response.data.result} created successfully`
      };
    } catch (error) {
      console.error('Error creating tenant database:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async registerTenant(tenantName, tenantData) {
    // Aquí se registraría el tenant en el sistema
    // En una implementación real, esto conectaría con el sistema de registro de tenants
    console.log(`Registering tenant: ${tenantName}`, tenantData);
    
    return {
      success: true,
      tenantId: tenantName,
      message: `Tenant ${tenantName} registered successfully`
    };
  }

  async generateTenantUrl(tenantName, dbName) {
    // Generar la URL para el tenant
    const subdomain = tenantName.replace(/\s+/g, '').toLowerCase();
    return `https://${subdomain}.odoo.smarterbot.store`;
  }
}

module.exports = OdooTenantCreator;