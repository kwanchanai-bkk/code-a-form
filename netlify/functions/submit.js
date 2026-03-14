const https = require('https');
const { URL } = require('url');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const PA_URL = 'https://default395a193340e1411995204d18b413d5.fe.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/38d8acb847164659904a8b9b16664649/triggers/manual/paths/invoke?api-version=1';

  try {
    const body = event.body;
    const parsedUrl = new URL(PA_URL);

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, status: result.status })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
