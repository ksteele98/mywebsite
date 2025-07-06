const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const pushoverToken = functions.config().pushover?.token || process.env.PUSHOVER_TOKEN;

async function sendPushover(userKey, message) {
  if (!pushoverToken || !userKey) return;
  try {
    const res = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        token: pushoverToken,
        user: userKey,
        title: 'Event Reminder',
        message
      })
    });
    if (!res.ok) {
      console.error('Pushover error:', await res.text());
    }
  } catch (err) {
    console.error('Pushover request failed:', err);
  }
}

// Sends email and push reminders for upcoming events.
exports.sendReminders = functions.pubsub
  .schedule('every 5 minutes').onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    const soon = admin.firestore.Timestamp.fromMillis(now.toMillis() + 5 * 60 * 1000);

    const snap = await db.collection('events')
      .where('emailSent', '==', false)
      .where('startTime', '<=', soon)
      .get();

    const promises = [];
    for (const doc of snap.docs) {
      const data = doc.data();
      const uid = data.uid;
      const email = data.email;
      const title = data.title;
      const startTime = data.startTime.toDate();

      // Send push notification if uid has token(s)
      if (uid) {
        promises.push(db.collection('users').doc(uid).get().then(uDoc => {
          if (!uDoc.exists) return null;
          const { fcmToken, pushoverKey } = uDoc.data();
          const tasks = [];
          if (fcmToken) {
            tasks.push(admin.messaging().send({
              token: fcmToken,
              notification: {
                title: 'Event Reminder',
                body: `${title} starts soon`
              }
            }));
          }
          if (pushoverKey) {
            tasks.push(sendPushover(pushoverKey, `${title} starts soon`));
          }
          return Promise.all(tasks);
        }));
      }

      // Queue email via "mail" collection if present
      if (email) {
        promises.push(db.collection('mail').add({
          to: email,
          message: {
            subject: `⏰ Reminder: ${title}`,
            html: `<p>${title} starts at ${startTime.toLocaleString()}</p>`
          },
          delivery: { startTime: admin.firestore.Timestamp.fromDate(startTime) }
        }));
      }

      promises.push(doc.ref.update({ emailSent: true }));
    }

    await Promise.all(promises);
    return null;
  });
