const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(functions.config().sendgrid.key);


exports.sendEmailReminder = functions.https.onRequest(async (req, res) => {
  const { email, name, event_name, event_time } = req.body || {};

  if (!email || !name || !event_name || !event_time) {
    return res.status(400).send("Missing fields");
  }

  const msg = {
    to: email,
    from: 'kyleasteele98@gmail.com', // 🔁 Must match verified sender identity in SendGrid
    subject: `Reminder: ${event_name}`,
    html: `
      <h3>Hey ${name},</h3>
      <p>This is your reminder for <strong>${event_name}</strong>.</p>
      <p>It starts at: <strong>${event_time}</strong></p>
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});

