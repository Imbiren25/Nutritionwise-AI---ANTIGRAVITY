const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
    console.log('.env.local file not found.');
    process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const lines = content.split('\n');
const env = {};

lines.forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        env[key] = value;
    }
});

const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID'
];

console.log('Checking Firebase Configuration:');
let allPresent = true;
requiredKeys.forEach(key => {
    if (env[key] && env[key].length > 0) {
        console.log(`${key}: Present`);
    } else {
        console.log(`${key}: MISSING`);
        allPresent = false;
    }
});

if (allPresent) {
    console.log('\nAll required Firebase configuration keys are present.');
} else {
    console.log('\nSome Firebase configuration keys are missing.');
}
