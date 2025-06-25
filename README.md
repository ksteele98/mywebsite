# mywebsite

This project uses Firebase Cloud Messaging (FCM) for push notifications. Use **data-only** payloads so that your service worker's `onBackgroundMessage` handler runs. Avoid including a top-level `notification` object.

Example `curl` request:

```bash
curl -X POST https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "token": "YOUR_FCM_TOKEN",
      "data": {
        "title": "Background Alert",
        "body": "This came through the service worker 🎉"
      }
    }
  }'
```

Ensure `firebase-messaging-sw.js` is served from the site root so it is reachable at:

```
https://ksteele98.github.io/mywebsite/firebase-messaging-sw.js
```

When the app receives a push while closed, this service worker's `onBackgroundMessage` callback displays the notification.

On mobile devices install the PWA ("Add to Home Screen") and tap the **Enable Notifications** button once signed in. Notifications will then appear even when the app isn't open.

## Event reminder pushes

Event reminders now use a Cloud Function to deliver data-only FCM payloads. Set `REMINDER_FUNCTION_URL` in `index.html` to your deployed function's HTTPS endpoint. The included `functions/index.js` exports a `sendReminder` function for Firebase Functions:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendReminder = functions.https.onRequest(async (req, res) => {
  const { token, title, body } = req.body || {};
  if (!token || !title || !body) return res.status(400).send('Missing fields');
  await admin.messaging().send({ token, data: { title, body } });
  res.send('ok');
});
```

Deploy this function and set the URL so scheduled reminders trigger background notifications.
