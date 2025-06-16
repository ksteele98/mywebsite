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

## Send a test push from Node

Use the provided `send-notification.js` script to deliver a data-only message. Set your FCM server key and target token as environment variables:

```bash
FCM_SERVER_KEY=YOUR_SERVER_KEY \
FCM_TOKEN=YOUR_FCM_TOKEN \
node send-notification.js
```

The script posts the payload shown above to the FCM endpoint so you can verify that background notifications work end-to-end.
