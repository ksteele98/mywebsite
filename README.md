# mywebsite

This project uses Firebase Cloud Messaging (FCM) for push notifications. To ensure background notifications are handled correctly, send **data-only** messages to the FCM API. Avoid a top-level `notification` block in the payload so that your `onBackgroundMessage` handler in `firebase-messaging-sw.js` runs.

Example `curl` request:

```bash
curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=YOUR_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_FCM_TOKEN",
    "priority": "high",
    "data": {
      "title": "Background Alert",
      "body": "This came through the service worker 🎉"
    }
  }'
```

Ensure `firebase-messaging-sw.js` is served from the site root so it is reachable at:

```
https://ksteele98.github.io/mywebsite/firebase-messaging-sw.js
```

When the app receives a push while closed, this service worker's `onBackgroundMessage` callback displays the notification.
