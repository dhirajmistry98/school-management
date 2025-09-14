// src/app/api/test-sendgrid/route.js
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function GET() {
  try {
    // Test SendGrid configuration
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    
    console.log('SendGrid API Key (first 20 chars):', apiKey?.substring(0, 20));
    console.log('SendGrid From Email:', fromEmail);
    
    if (!apiKey || !fromEmail) {
      return NextResponse.json({
        status: 'error',
        message: 'SendGrid API key or from email not configured',
        config: {
          hasApiKey: !!apiKey,
          hasFromEmail: !!fromEmail
        }
      }, { status: 400 });
    }
    
    sgMail.setApiKey(apiKey);
    
    // Test with a simple message to yourself
    const msg = {
      to: fromEmail, // Send to the same email that's configured as sender
      from: fromEmail,
      subject: 'SendGrid Test Email',
      text: 'This is a test email to verify SendGrid integration.',
      html: '<p>This is a test email to verify SendGrid integration.</p>'
    };
    
    const result = await sgMail.send(msg);
    
    return NextResponse.json({
      status: 'success',
      message: 'Test email sent successfully',
      messageId: result[0].headers['x-message-id'],
      statusCode: result[0].statusCode
    });
    
  } catch (error) {
    console.error('SendGrid test error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error.message,
      code: error.code,
      response: error.response?.body || 'No response body',
      config: {
        hasApiKey: !!process.env.SENDGRID_API_KEY,
        hasFromEmail: !!process.env.SENDGRID_FROM_EMAIL,
        apiKeyPrefix: process.env.SENDGRID_API_KEY?.substring(0, 10)
      }
    }, { status: 500 });
  }
}