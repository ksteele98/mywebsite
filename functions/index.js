const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Sends FCM push reminders for upcoming events.
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
      const title = data.title;
      const startTime = data.startTime.toDate();

      // Send push notification if uid has token(s)
      if (uid) {
        promises.push(db.collection('users').doc(uid).get().then(uDoc => {
          if (!uDoc.exists) return null;
          const { fcmToken } = uDoc.data();
          if (!fcmToken) return null;
          return admin.messaging().send({
            token: fcmToken,
            notification: {
              title: 'Event Reminder',
              body: `${title} starts soon`
            }
          });
        }));
      }



      promises.push(doc.ref.update({ emailSent: true }));
    }

    await Promise.all(promises);
    return null;
  });

