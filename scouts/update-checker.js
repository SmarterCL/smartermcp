const axios = require('axios');

/**
 * General Update Checker Scout for various services
 */
class UpdateChecker {
  constructor() {
    this.services = {
      n8n: {
        currentVersion: process.env.N8N_VERSION || '2.0.3',
        repo: 'n8n-io/n8n',
        url: process.env.N8N_URL || 'http://n8n-store-service:5678'
      },
      // Add more services as needed
    };
  }

  /**
   * Check for updates for all configured services
   */
  async checkAllUpdates() {
    const results = {};
    
    for (const [serviceName, config] of Object.entries(this.services)) {
      results[serviceName] = await this.checkServiceUpdates(serviceName, config);
    }
    
    return results;
  }

  /**
   * Check for updates for a specific service
   */
  async checkServiceUpdates(serviceName, config) {
    try {
      console.log(`🔍 Checking for ${serviceName} updates...`);
      
      const response = await axios.get(`https://api.github.com/repos/${config.repo}/releases/latest`, {
        headers: {
          'User-Agent': 'SmarterMCP-UpdateChecker/1.0'
        },
        timeout: 10000
      });

      const latestVersion = response.data.tag_name.replace('v', '');
      const currentVersion = config.currentVersion;

      console.log(`📦 Current ${serviceName} version: ${currentVersion}`);
      console.log(`🚀 Latest ${serviceName} version: ${latestVersion}`);

      const hasUpdate = this.compareVersions(currentVersion, latestVersion) < 0;

      return {
        service: serviceName,
        currentVersion,
        latestVersion,
        hasUpdate,
        updateAvailable: hasUpdate,
        releaseUrl: response.data.html_url,
        publishedAt: response.data.published_at,
        releaseNotes: response.data.body.substring(0, 500) + '...',
        downloadUrl: response.data.tarball_url
      };
    } catch (error) {
      console.error(`❌ Error checking ${serviceName} updates:`, error.message);
      return {
        service: serviceName,
        error: error.message,
        hasUpdate: false
      };
    }
  }

  /**
   * Compare two version strings
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
   * Main execution method for the scout
   */
  async execute() {
    console.log('🛡️ Running General Update Checker Scout...');
    
    const results = await this.checkAllUpdates();

    const summary = {
      scout: 'update-checker',
      timestamp: new Date().toISOString(),
      services: results,
      summary: {
        totalServices: Object.keys(results).length,
        updatesAvailable: Object.values(results).filter(r => r.hasUpdate).length,
        upToDate: Object.values(results).filter(r => !r.hasUpdate).length
      }
    };

    // Log summary
    console.log(`📊 Update check completed for ${summary.summary.totalServices} services`);
    console.log(`📈 ${summary.summary.updatesAvailable} services have updates available`);
    console.log(`✅ ${summary.summary.upToDate} services are up to date`);

    // Log specific recommendations
    for (const [serviceName, result] of Object.entries(results)) {
      if (result.hasUpdate) {
        console.log(`🚨 UPDATE AVAILABLE: ${serviceName} ${result.latestVersion} (current: ${result.currentVersion})`);
      } else if (!result.error) {
        console.log(`✅ ${serviceName} is up to date (${result.currentVersion})`);
      }
    }

    return summary;
  }
}

module.exports = UpdateChecker;