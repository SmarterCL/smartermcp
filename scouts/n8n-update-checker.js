const axios = require('axios');

/**
 * Scout for checking n8n updates
 */
class N8NUpdateChecker {
  constructor() {
    this.serviceName = 'n8n';
    this.currentVersion = process.env.N8N_VERSION || '2.0.3'; // Default to the latest version 2.0.3
  }

  /**
   * Check for n8n updates by querying GitHub API
   */
  async checkForUpdates() {
    try {
      console.log(`🔍 Checking for ${this.serviceName} updates...`);
      
      // Query GitHub API for latest n8n release
      const response = await axios.get('https://api.github.com/repos/n8n-io/n8n/releases/latest', {
        headers: {
          'User-Agent': 'SmarterMCP-UpdateChecker/1.0'
        },
        timeout: 10000
      });

      const latestVersion = response.data.tag_name.replace('v', '');
      const currentVersion = this.currentVersion;

      console.log(`📦 Current ${this.serviceName} version: ${currentVersion}`);
      console.log(`🚀 Latest ${this.serviceName} version: ${latestVersion}`);

      const hasUpdate = this.compareVersions(currentVersion, latestVersion) < 0;

      return {
        service: this.serviceName,
        currentVersion,
        latestVersion,
        hasUpdate,
        updateAvailable: hasUpdate,
        releaseUrl: response.data.html_url,
        publishedAt: response.data.published_at,
        releaseNotes: response.data.body.substring(0, 500) + '...'
      };
    } catch (error) {
      console.error(`❌ Error checking ${this.serviceName} updates:`, error.message);
      return {
        service: this.serviceName,
        error: error.message,
        hasUpdate: false
      };
    }
  }

  /**
   * Compare two version strings
   * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
   */
  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const num1 = parts1[i] || 0;
      const num2 = parts2[i] || 0;

      if (num1 < num2) return -1;
      if (num1 > num2) return 1;
    }

    return 0;
  }

  /**
   * Get current n8n instance info (if accessible)
   */
  async getInstanceInfo() {
    // This would require access to the actual n8n instance
    // which may not be available depending on your setup
    try {
      // If n8n is accessible locally, you could query its API
      // This is a placeholder - adjust based on your actual n8n endpoint
      const n8nUrl = process.env.N8N_URL || 'http://n8n-store-service:5678';
      
      // Note: n8n API endpoints might require authentication
      // This is just a conceptual implementation
      return {
        url: n8nUrl,
        version: this.currentVersion,
        status: 'reachable' // This would be determined by actual connection
      };
    } catch (error) {
      console.error('❌ Error getting n8n instance info:', error.message);
      return {
        url: process.env.N8N_URL || 'http://n8n-store-service:5678',
        version: this.currentVersion,
        status: 'unreachable',
        error: error.message
      };
    }
  }

  /**
   * Main execution method for the scout
   */
  async execute() {
    console.log('🛡️ Running N8N Update Checker Scout...');
    
    const updateInfo = await this.checkForUpdates();
    const instanceInfo = await this.getInstanceInfo();

    const result = {
      scout: 'n8n-update-checker',
      timestamp: new Date().toISOString(),
      updateInfo,
      instanceInfo,
      recommendation: updateInfo.hasUpdate 
        ? `🚨 UPDATE AVAILABLE: ${this.serviceName} ${updateInfo.latestVersion} is available (current: ${updateInfo.currentVersion})`
        : `✅ ${this.serviceName} is up to date`
    };

    console.log(result.recommendation);
    return result;
  }
}

module.exports = N8NUpdateChecker;