const http = require('http');

// Test backend connection
const testBackend = () => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/health',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`Backend Status: ${res.statusCode}`);
    res.on('data', (data) => {
      console.log('Backend Response:', data.toString());
    });
  });

  req.on('error', (err) => {
    console.error('Backend Connection Error:', err.message);
  });

  req.on('timeout', () => {
    console.error('Backend Connection Timeout');
    req.destroy();
  });

  req.end();
};

console.log('Testing backend connection...');
testBackend();