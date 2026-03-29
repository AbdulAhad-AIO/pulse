#!/usr/bin/env node

const https = require('https');

const data = JSON.stringify({
  title: 'Test: Latest AI Breakthrough 2026',
  description: 'New artificial intelligence model shows remarkable capabilities',
  category: 'tech',
  source: 'test-seed',
  trending_score: 85
});

const options = {
  hostname: 'szqixewwpkjlixoueeih.supabase.co',
  path: '/rest/v1/trends',
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWl4ZXd3cGtqbGl4b3VlZWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDExNDIsImV4cCI6MjA5MDE3NzE0Mn0.PsWTCQ6vercsjfCg9vLwgjDhwfmFGtzizRfGxeevbGw',
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Prefer': 'return=minimal'
  }
};

https.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => { responseData += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', responseData);
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
}).end(data);
