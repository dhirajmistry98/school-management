// src/lib/emailService.js
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;

if (!apiKey) {
  console.error('SENDGRID_API_KEY is not set in environment variables');
}

if (!fromEmail) {
  console.error('SENDGRID_FROM_EMAIL is not set in environment variables');
}

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export async function sendOTPEmail(email, otp) {
  try {
    // Check if required environment variables are set
    if (!apiKey || !fromEmail) {
      console.error('SendGrid not properly configured:', {
        hasApiKey: !!apiKey,
        hasFromEmail: !!fromEmail
      });
      return { 
        success: false, 
        error: 'SendGrid not properly configured. Please check environment variables.' 
      };
    }

    console.log('Attempting to send OTP email to:', email);
    console.log('Using SendGrid API key (first 10 chars):', apiKey.substring(0, 10));
    console.log('From email:', fromEmail);

    const msg = {
      to: email,
      from: fromEmail,
      subject: 'School Management - Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">School Management System</h2>
          <p>Your login OTP code is:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `
    };

    const result = await sgMail.send(msg);
    
    console.log('OTP email sent successfully to:', email);
    console.log('SendGrid response status:', result[0].statusCode);
    console.log('Message ID:', result[0].headers['x-message-id']);
    
    return { success: true, messageId: result[0].headers['x-message-id'] };
    
  } catch (error) {
    console.error('Error sending OTP email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.response?.status,
      body: JSON.stringify(error.response?.body, null, 2)
    });
    
    // Parse SendGrid error messages
    let errorMessage = 'Failed to send email';
    
    if (error.code === 401) {
      errorMessage = 'SendGrid API key is invalid or unauthorized';
    } else if (error.code === 403) {
      errorMessage = 'SendGrid API key does not have permission to send emails';
    } else if (error.response?.body?.errors) {
      errorMessage = error.response.body.errors.map(err => err.message).join(', ');
    }
    
    return { success: false, error: errorMessage, details: error.message };
  }
}