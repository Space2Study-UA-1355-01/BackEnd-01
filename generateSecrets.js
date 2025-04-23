const fs = require('fs');
const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(64).toString('base64'); 
}

const accessSecret = generateSecret();
const refreshSecret = generateSecret();
const resetSecret = generateSecret();
const confirmationSecret = generateSecret();

const envFilePath = '.env.local';
let envContent = '';

try {
  if (fs.existsSync(envFilePath)) {
    envContent = fs.readFileSync(envFilePath, 'utf8');
    console.log('Existing .env.local file found.');
  } else {
    console.log('No .env.local file found, will create a new one.');
  }
} catch (error) {
  console.error(`Error reading ${envFilePath}: ${error.message}`);
  process.exit(1);
}

function updateEnvContent(envContent, key, value) {
  const regex = new RegExp(`^${key}=.*`, 'm');
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    envContent += `\n${key}=${value}`;
  }
  return envContent;
}

envContent = updateEnvContent(envContent, 'JWT_ACCESS_SECRET', accessSecret);
envContent = updateEnvContent(envContent, 'JWT_REFRESH_SECRET', refreshSecret);
envContent = updateEnvContent(envContent, 'JWT_RESET_SECRET', resetSecret);
envContent = updateEnvContent(envContent, 'JWT_CONFIRM_SECRET', confirmationSecret);

try {
  fs.writeFileSync(envFilePath, envContent, 'utf8');
  console.log('.env.local updated successfully!');
  console.log('JWT secrets have been generated and saved.');
} catch (error) {
  console.error(`Error writing to ${envFilePath}: ${error.message}`);
  process.exit(1);
}
