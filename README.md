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

## Event reminder emails

Event reminders are sent using a Cloud Function that emails the user via SendGrid. Set `REMINDER_EMAIL_FUNCTION_URL` in `index.html` to your deployed function's HTTPS endpoint. The included `functions/index.js` exports a `sendEmailReminder` function:

```javascript
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendEmailReminder = functions.https.onRequest(async (req, res) => {
  const { email, name, event_name, event_time } = req.body || {};
  if (!email || !name || !event_name || !event_time) {
    return res.status(400).send('Missing fields');
  }
  const msg = {
    to: email,
    from: 'kyleasteele98@gmail.com', // Must match verified sender identity in SendGrid
    subject: `Reminder: ${event_name}`,
    html: `
      <h3>Hey ${name},</h3>
      <p>This is your reminder for <strong>${event_name}</strong>.</p>
      <p>It starts at: <strong>${event_time}</strong></p>
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email.');
  }
});
```

Deploy this function and set the URL so scheduled reminders send an email to the signed-in user.
