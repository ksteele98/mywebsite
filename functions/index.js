const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

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

      // Send push notification if uid has fcmToken
      if (uid) {
        promises.push(db.collection('users').doc(uid).get().then(uDoc => {
          const token = uDoc.exists ? uDoc.data().fcmToken : null;
          if (token) {
            return admin.messaging().send({
              token,
              notification: {
                title: 'Event Reminder',
                body: `${title} starts soon`
              }
            });
          }
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
