/**
 * Email service using nodemailer
 */

import nodemailer from 'nodemailer';

// Create transporter function (lazy loading)
const createTransporter = () => {
  console.log('Email Service Configuration:');
  console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
  console.log('SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'Not set');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'Not set');

  // Use EMAIL_* variables first, fallback to SMTP_* variables
  const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const emailService = process.env.EMAIL_SERVICE || 'gmail';

  console.log('Using email credentials:');
  console.log('User:', emailUser ? 'Set' : 'Not set');
  console.log('Pass:', emailPass ? 'Set' : 'Not set');

  return nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

/**
 * Send email using nodemailer
 * @param {Object} emailData - Email data
 * @param {string} emailData.to - Recipient email
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.html - Email HTML content
 * @param {string} emailData.text - Email text content (optional)
 * @returns {Promise<Object>} - Send result
 */
export const sendEmail = async (emailData) => {
  try {
    const { to, subject, html, text } = emailData;
    
    if (!to || !subject || !html) {
      throw new Error('Missing required email fields: to, subject, html');
    }

    // Create transporter when needed
    const transporter = createTransporter();
    const emailUser = process.env.EMAIL_USER || process.env.SMTP_USER;

    const mailOptions = {
      from: `"Dealistaan" <${emailUser}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Verify email configuration
 * @returns {Promise<Object>} - Verification result
 */
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return {
      success: true,
      message: 'Email configuration is valid'
    };
  } catch (error) {
    console.error('Email configuration error:', error);
    return {
      success: false,
      message: 'Email configuration is invalid',
      error: error.message
    };
  }
};

export default {
  sendEmail,
  verifyEmailConfig
};
