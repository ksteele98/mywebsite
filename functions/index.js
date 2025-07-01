const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

// Replace with your actual SendGrid API key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

exports.sendTestEmail = functions.https.onCall(async (data, context) => {
  const msg = {
    to: data.to, // recipient email
    from: 'YOUR_VERIFIED_SENDER@YOURDOMAIN.COM', // must be a verified sender in SendGrid
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
