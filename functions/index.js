const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

// Get the key from environment config
const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendTestEmail = functions.https.onCall(async (data, context) => {
  const msg = {
    to: data.to, // recipient email
    from: 'kyleasteele98@gmail.com', // must be a verified sender in SendGrid
    subject: data.subject,
    text: data.text,
  };
  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
});
