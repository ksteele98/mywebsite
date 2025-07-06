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

## Reminders

When creating an event you can optionally pick a **Reminder Date** and **Reminder Time**. The page will queue an email through the `mail` collection and schedule a local notification. After saving an event you'll see a browser alert confirming the reminder time.


### Firebase Setup

Deploy the Cloud Functions in `functions/` and install the [Trigger Email](https://firebase.google.com/products/extensions/firestore-send-email) extension. The `sendReminders` scheduled function checks the `events` collection every five minutes and sends push notifications (using each user's `fcmToken`) and queues an email in the `mail` collection.

### Pushover Support

You can also receive reminders through the [Pushover](https://pushover.net/) service. Set your app's token using Firebase config:

```bash
firebase functions:config:set pushover.token="YOUR_APP_TOKEN"
```

Store each user's Pushover user key under `pushoverKey` in their `users/{uid}` document. When `sendReminders` runs it will send a message via Pushover in addition to FCM/email.
