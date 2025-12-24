#!/usr/bin/env node

/**
 * Standalone script to test the update checker
 */
const UpdateChecker = require('./scouts/update-checker');

async function testUpdateChecker() {
  console.log('🧪 Testing Update Checker...\n');
  
  const updateChecker = new UpdateChecker();
  const results = await updateChecker.execute();
  
  console.log('\n📋 Update Check Results:');
  console.log(JSON.stringify(results, null, 2));
}

// Run if called directly
if (require.main === module) {
  testUpdateChecker().catch(console.error);
}

module.exports = UpdateChecker;