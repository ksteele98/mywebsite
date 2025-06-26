const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const cors = require('cors')({ origin: true });

sgMail.setApiKey(functions.config().sendgrid.key);


exports.sendEmailReminder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { email, name, event_name, event_time } = req.body || {};

    if (!email || !event_name || !event_time) {
      return res.status(400).send('Missing fields');
    }

    const msg = {
      to: email,
      from: 'kyleasteele98@gmail.com', // 🔁 Must match verified sender identity in SendGrid
      subject: `Reminder: ${event_name}`,
      html: `
        <h3>Hey ${name || 'there'},</h3>
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
});

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { to, subject, html } = req.body || {};

    if (!to || !subject || !html) {
      return res.status(400).send('Missing fields');
    }

    const msg = {
      to,
      from: 'kyleasteele98@gmail.com', // 🔁 Must match verified sender identity in SendGrid
      subject,
      html,
    };

    try {
      await sgMail.send(msg);
      res.status(200).send('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Failed to send email.');
    }
  });
});
const admin = require('firebase-admin');
admin.initializeApp();

exports.scheduleEmailReminders = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
  const now = new Date();
  const in5Min = new Date(now.getTime() + 5 * 60 * 1000);

  const snapshot = await admin.firestore().collection('events')
    .where('emailSent', '==', false)
    .get();

  for (const doc of snapshot.docs) {
    const event = doc.data();
    const eventTime = new Date(event.startTime);

    if (eventTime >= now && eventTime <= in5Min) {
      const emailPayload = {
        email: event.email,
        name: event.name || '',
        event_name: event.title,
        event_time: eventTime.toLocaleString()
      };

      try {
        await sgMail.send({
          to: emailPayload.email,
          from: 'kyleasteele98@gmail.com',
          subject: `Reminder: ${emailPayload.event_name}`,
          html: `<h3>Hey ${emailPayload.name || 'there'},</h3><p>This is your reminder for <strong>${emailPayload.event_name}</strong>.</p><p>It starts at: <strong>${emailPayload.event_time}</strong></p>`
        });

        await doc.ref.update({ emailSent: true });
        console.log('📨 Sent email for:', event.title);
      } catch (err) {
        console.error('❌ Failed to send:', err);
      }
    }
  }
});

