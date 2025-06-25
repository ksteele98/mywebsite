const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendReminder = functions.https.onRequest(async (req, res) => {
  const { token, title, body } = req.body || {};
  if (!token || !title || !body) {
    res.status(400).send('Missing fields');
    return;
  }
  try {
    await admin.messaging().send({ token, data: { title, body } });
    res.status(200).send('ok');
  } catch (err) {
    console.error('sendReminder error', err);
    res.status(500).send('error');
  }
});
