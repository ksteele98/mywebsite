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
