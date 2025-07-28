// backend/services/emailService.js
const nodemailer = require('nodemailer');

// --- Create a "transporter" ---
// This is the object that can actually send emails. We configure it to use SendGrid.
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey', // This is a literal string, don't change it
    pass: process.env.SENDGRID_API_KEY, // Your API key from the .env file
  },
});

/**
 * Sends the analysis report email to a user.
 * @param {string} recipientEmail - The email address of the user.
 * @param {string} downloadUrl - The public S3 URL for the generated PDF report.
 */
async function sendAnalysisCompleteEmail(recipientEmail, downloadUrl) {
  // Create the HTML content for the email with a nice-looking button
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Your Pitch Deck Analysis is Complete!</h2>
      <p>Hello,</p>
      <p>Thank you for using InvestLens. Your detailed investment thesis report has been generated and is ready for you to view.</p>
      <p>You can download your report by clicking the button below:</p>
      <a href="${downloadUrl}" style="background-color: #00e676; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-weight: bold;">
        Download Report
      </a>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Best Regards,<br/>The InvestLens Team</p>
    </div>
  `;

  // Define the email options
  const mailOptions = {
    from: `InvestLens Analyzer <${process.env.VERIFIED_SENDER_EMAIL}>`, // The "from" name and verified email
    to: recipientEmail,
    subject: 'Your Pitch Deck Analysis Report is Ready!',
    html: emailHtml, // We use HTML for a richer email body
  };

  try {
    // Send the email and wait for the result
    await transporter.sendMail(mailOptions);
    console.log('Analysis report email sent successfully to:', recipientEmail);
  } catch (error) {
    console.error('Error sending email:', error);
    // We throw the error so the calling function knows something went wrong.
    throw new Error('Failed to send analysis email.');
  }
}

module.exports = { sendAnalysisCompleteEmail };