// src/app/api/test-gmail/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    console.log('Testing Gmail with:', {
      to: email,
      from: process.env.GMAIL_USER,
      hasPassword: !!process.env.GMAIL_APP_PASSWORD
    });

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD?.trim()
      }
    });

    // Verify first
    await transporter.verify();
    console.log('Gmail verification successful!');

    // Send test email
    const result = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Test Email - School Management',
      html: '<h1>Test successful!</h1><p>Your Gmail configuration is working.</p>'
    });

    return NextResponse.json({
      success: true,
      message: 'Gmail test successful!',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Gmail test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Gmail test endpoint',
    usage: 'POST with {"email": "test@example.com"}'
  });
}