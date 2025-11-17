// Test script to verify Supabase connection
const https = require('https');

const supabaseUrl = 'https://tlkatprzzigjqhclwius.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsa2F0cHJ6emlnanFoY2x3aXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzg5OTAsImV4cCI6MjA3ODcxNDk5MH0.L9hSHUCXsbprZPLI9WgGX_gQtWDZL0lvvZFU-DzCdfs';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsa2F0cHJ6emlnanFoY2x3aXVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzEzODk5MCwiZXhwIjoyMDc4NzE0OTkwfQ.baJqkZ7snmxAd8Oq1r5G51eeBgQj_I70VCkJP7nQbRo';

let anonSuccess = false;
let serviceSuccess = false;
let hasFailed = false;

function handleError(test, err) {
  if (hasFailed) return;
  hasFailed = true;
  
  if (err && err.message && err.message.includes('Invalid')) {
    console.error(`❌ FAILED: Invalid ${test} key`);
  } else if (err && (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED')) {
    console.error('❌ FAILED: Cannot reach Supabase server (check URL)');
  } else {
    console.error(`❌ FAILED: ${test} connection error`);
  }
  process.exit(1);
}

function testConnection(key, keyType) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${supabaseUrl}/rest/v1/`);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      },
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      // Any response means connection works (200, 404, etc. are all fine)
      if (res.statusCode === 401) {
        reject({ message: 'Invalid API key' });
      } else {
        resolve();
      }
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject({ code: 'ETIMEDOUT' });
    });

    req.end();
  });
}

// Test anon key
testConnection(supabaseAnonKey, 'anon')
  .then(() => {
    anonSuccess = true;
    if (anonSuccess && serviceSuccess) {
      console.log('✅ SUCCESS: Supabase connection verified');
      process.exit(0);
    }
  })
  .catch((err) => {
    handleError('anon', err);
  });

// Test service role key
testConnection(supabaseServiceKey, 'service role')
  .then(() => {
    serviceSuccess = true;
    if (anonSuccess && serviceSuccess) {
      console.log('✅ SUCCESS: Supabase connection verified');
      process.exit(0);
    }
  })
  .catch((err) => {
    handleError('service role', err);
  });

