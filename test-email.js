import dotenv from 'dotenv';
import { sendEmail, verifyEmailConfig } from './src/services/emailService.js';

// Load environment variables
dotenv.config();

console.log('=== Email Configuration Test ===');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
console.log('');

async function testEmailConfig() {
    try {
        console.log('Testing email configuration...');
        const result = await verifyEmailConfig();
        console.log('Configuration test result:', result);
        
        if (result.success) {
            console.log('✅ Email configuration is valid!');
            
            // Test sending an email
            console.log('Testing email send...');
            const emailResult = await sendEmail({
                to: process.env.EMAIL_USER, // Send to yourself for testing
                subject: 'Test Email - Dealistaan',
                html: `
                    <h2>Email Test Successful!</h2>
                    <p>This is a test email from your Dealistaan server.</p>
                    <p>If you receive this, your email configuration is working correctly.</p>
                `
            });
            
            console.log('Email send result:', emailResult);
        } else {
            console.log('❌ Email configuration failed:', result.message);
        }
    } catch (error) {
        console.error('❌ Email test failed:', error.message);
    }
}

testEmailConfig();
