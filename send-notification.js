const https = require('https');

const serverKey = process.env.FCM_SERVER_KEY;
const fcmToken  = process.env.FCM_TOKEN;

if (!serverKey || !fcmToken) {
  console.error('Usage: FCM_SERVER_KEY=... FCM_TOKEN=... node send-notification.js');
  process.exit(1);
}

const payload = JSON.stringify({
  to: fcmToken,
  priority: 'high',
  data: {
    title: 'Background Alert',
    body:  'This came through the service worker \uD83C\uDF89'
  }
});

const options = {
  hostname: 'fcm.googleapis.com',
  path: '/fcm/send',
  method: 'POST',
  headers: {
    'Authorization': `key=${serverKey}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, res => {
  console.log('Status:', res.statusCode);
  res.on('data', d => process.stdout.write(d));
});

req.on('error', err => console.error('Request error:', err));
req.write(payload);
req.end();
