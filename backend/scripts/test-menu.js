const fs = require('fs');
const { execSync } = require('child_process');

if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing project dependencies...');
  execSync('npm install', { stdio: 'inherit' });
}

if (!fs.existsSync('node_modules/prompts')) {
  console.log('📦 Installing "prompts"...');
  execSync('npm install --save-dev prompts prompts', { stdio: 'inherit' });
}

const prompts = require('prompts');

(async () => {
  const response = await prompts({
    type: 'select',
    name: 'value',
    message: 'Which test do you want to run?',
    choices: [
      { title: '✅ Unit Tests', value: 'test:unit' },
      { title: '🧪 E2E Tests', value: 'test:e2e' },
      { title: '📊 Coverage Report', value: 'test:cov' },
      { title: '❌ Cancel', value: 'cancel' },
    ],
  });

  if (response.value !== 'cancel') {
    console.log(`🚀 Running: npm run ${response.value}`);
    execSync(`npm run ${response.value}`, { stdio: 'inherit' });
  } else {
    console.log('❌ No option selected. Exiting...');
  }
})();
