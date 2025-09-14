// src/lib/emailService-gmail.js
import nodemailer from 'nodemailer';

// Create Gmail transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

export async function sendOTPEmail(email, otp) {
  try {
    // Check if required environment variables are set
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPassword) {
      console.error('Gmail not properly configured:', {
        hasUser: !!gmailUser,
        hasPassword: !!gmailPassword
      });
      return { 
        success: false, 
        error: 'Gmail credentials not properly configured. Please check environment variables.' 
      };
    }

    console.log('Attempting to send OTP email via Gmail to:', email);
    console.log('Using Gmail account:', gmailUser);

    const transporter = createTransporter();

    const mailOptions = {
      from: gmailUser,
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
    
    console.log('OTP email sent successfully via Gmail to:', email);
    console.log('Message ID:', result.messageId);
    
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending OTP email via Gmail:', error);
    
    // Parse common Gmail SMTP errors
    let errorMessage = 'Failed to send email via Gmail';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Gmail authentication failed. Please check your app password.';
    } else if (error.code === 'ESOCKET') {
      errorMessage = 'Network connection error. Please check your internet connection.';
    } else if (error.responseCode === 535) {
      errorMessage = 'Invalid Gmail app password. Please generate a new app password.';
    }
    
    return { success: false, error: errorMessage, details: error.message };
  }
}