/**
 * n8n-Odoo Connector Tool for SmartMCP
 * Enables n8n workflows to securely interact with Odoo ERP through MCP protocol
 */

const axios = require('axios');

class N8nOdooConnector {
  constructor() {
    this.odooHost = process.env.ODOO_HOST || 'http://odoo-backend:8069';
    this.odooDb = process.env.ODOO_DB || 'smarterbot';
    this.odooUsername = process.env.ODOO_USERNAME || 'admin';
    this.odooPassword = process.env.ODOO_PASSWORD || 'admin';
    
    // Initialize Odoo session
    this.sessionId = null;
  }

  /**
   * Execute an Odoo operation via XML-RPC
   */
  async executeOdooOperation(model, method, args = [], kwargs = {}) {
    try {
      const response = await axios.post(`${this.odooHost}/xmlrpc/2/object`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [this.odooDb, this.odooUsername, this.odooPassword, model, method, args, kwargs]
        },
        id: Math.floor(Math.random() * 1000000000)
      });

      if (response.data.error) {
        throw new Error(`Odoo error: ${response.data.error.message}`);
      }

      return response.data.result;
    } catch (error) {
      console.error('Error executing Odoo operation:', error.message);
      throw error;
    }
  }

  /**
   * Get Odoo records
   */
  async getRecords(model, domain = [], fields = [], offset = 0, limit = 80, order = '') {
    try {
      const result = await this.executeOdooOperation(
        model,
        'search_read',
        [domain],
        { fields, offset, limit, order }
      );
      
      return {
        success: true,
        data: result,
        count: result.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create Odoo record
   */
  async createRecord(model, values) {
    try {
      const result = await this.executeOdooOperation(
        model,
        'create',
        [values]
      );
      
      return {
        success: true,
        id: Array.isArray(result) ? result[0] : result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update Odoo record
   */
  async updateRecord(model, id, values) {
    try {
      const result = await this.executeOdooOperation(
        model,
        'write',
        [[id], values]
      );
      
      return {
        success: true,
        updated: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete Odoo record
   */
  async deleteRecord(model, id) {
    try {
      const result = await this.executeOdooOperation(
        model,
        'unlink',
        [[id]]
      );
      
      return {
        success: true,
        deleted: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * MCP Tool: Search and read Odoo records
   */
  async searchRead(context) {
    const { model, domain = [], fields = [], limit = 80, order = '' } = context;

    if (!model) {
      return {
        success: false,
        error: 'Model name is required'
      };
    }

    console.log(`🔍 Searching Odoo records in model: ${model}`);
    
    return await this.getRecords(model, domain, fields, 0, limit, order);
  }

  /**
   * MCP Tool: Create Odoo record
   */
  async create(context) {
    const { model, values } = context;

    if (!model || !values) {
      return {
        success: false,
        error: 'Model name and values are required'
      };
    }

    console.log(`➕ Creating Odoo record in model: ${model}`);
    
    return await this.createRecord(model, values);
  }

  /**
   * MCP Tool: Update Odoo record
   */
  async update(context) {
    const { model, id, values } = context;

    if (!model || !id || !values) {
      return {
        success: false,
        error: 'Model name, ID, and values are required'
      };
    }

    console.log(`✏️ Updating Odoo record in model: ${model}, ID: ${id}`);
    
    return await this.updateRecord(model, id, values);
  }

  /**
   * MCP Tool: Delete Odoo record
   */
  async delete(context) {
    const { model, id } = context;

    if (!model || !id) {
      return {
        success: false,
        error: 'Model name and ID are required'
      };
    }

    console.log(`🗑️ Deleting Odoo record in model: ${model}, ID: ${id}`);
    
    return await this.deleteRecord(model, id);
  }

  /**
   * MCP Tool: Execute custom Odoo method
   */
  async executeCustom(context) {
    const { model, method, args = [], kwargs = {} } = context;

    if (!model || !method) {
      return {
        success: false,
        error: 'Model name and method are required'
      };
    }

    console.log(`⚙️ Executing custom Odoo method: ${model}.${method}`);
    
    try {
      const result = await this.executeOdooOperation(model, method, args, kwargs);
      
      return {
        success: true,
        result: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * MCP Tool: Get Odoo model fields
   */
  async getModelFields(context) {
    const { model } = context;

    if (!model) {
      return {
        success: false,
        error: 'Model name is required'
      };
    }

    try {
      // Call fields_get to get model fields
      const result = await this.executeOdooOperation(
        model,
        'fields_get',
        [],
        { attributes: ['string', 'help', 'type', 'required', 'readonly'] }
      );
      
      return {
        success: true,
        fields: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = N8nOdooConnector;