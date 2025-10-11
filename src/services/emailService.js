/**
 * Email service using nodemailer
 */

import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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

    const mailOptions = {
      from: `"Dealistaan" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
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
