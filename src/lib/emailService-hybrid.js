// src/lib/emailService-hybrid.js
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

// SendGrid setup
const sendGridApiKey = process.env.SENDGRID_API_KEY;
const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL;

if (sendGridApiKey) {
  sgMail.setApiKey(sendGridApiKey);
}

// Gmail setup - Fixed the function call
const createGmailTransporter = () => {
  return nodemailer.createTransporter({ // Fixed: was createTransporter, should be createTransporter
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

async function sendWithSendGrid(email, otp) {
  if (!sendGridApiKey || !sendGridFromEmail) {
    throw new Error('SendGrid not configured');
  }

  const msg = {
    to: email,
    from: sendGridFromEmail,
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
  return { success: true, messageId: result[0].headers['x-message-id'], service: 'SendGrid' };
}

async function sendWithGmail(email, otp) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Gmail not configured');
  }

  const transporter = createGmailTransporter();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'School Management - Login OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">School Management System</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Login OTP Code</h2>
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #007bff; font-size: 36px; margin: 0; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
          </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <p style="color: #666; font-size: 16px; margin-bottom: 10px;">This code will expire in <strong>10 minutes</strong></p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated message from School Management System. Please do not reply to this email.
        </p>
      </div>
    `
  };

  const result = await transporter.sendMail(mailOptions);
  return { success: true, messageId: result.messageId, service: 'Gmail' };
}

export async function sendOTPEmail(email, otp) {
  console.log('Starting email sending process...');
  console.log('Environment check:', {
    hasSendGridKey: !!sendGridApiKey,
    hasSendGridFrom: !!sendGridFromEmail,
    hasGmailUser: !!process.env.GMAIL_USER,
    hasGmailPass: !!process.env.GMAIL_APP_PASSWORD
  });

  // Try SendGrid first only if properly configured
  if (sendGridApiKey && sendGridFromEmail) {
    try {
      console.log('Attempting to send via SendGrid...');
      const result = await sendWithSendGrid(email, otp);
      console.log(`OTP sent successfully via ${result.service} to:`, email);
      return result;
    } catch (error) {
      console.log('SendGrid failed:', error.message);
      
      // Check for specific SendGrid errors
      if (error.response?.body?.errors) {
        console.log('SendGrid error details:', JSON.stringify(error.response.body.errors, null, 2));
      }
      
      console.log('Trying Gmail fallback...');
    }
  } else {
    console.log('SendGrid not configured, skipping to Gmail...');
  }

  // Fallback to Gmail
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      console.log('Attempting to send via Gmail...');
      const result = await sendWithGmail(email, otp);
      console.log(`OTP sent successfully via ${result.service} to:`, email);
      return result;
    } catch (error) {
      console.error('Gmail failed:', error.message);
      console.error('Gmail error details:', error);
      
      return { 
        success: false, 
        error: `Gmail failed: ${error.message}`,
        details: error.stack
      };
    }
  }

  return { 
    success: false, 
    error: 'No email service configured properly. Please check SendGrid or Gmail configuration.' 
  };
}