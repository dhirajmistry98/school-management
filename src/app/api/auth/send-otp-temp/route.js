// src/app/api/auth/send-otp-temp/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generateOTP, hashOTP } from '@/lib/auth';

// Temporary email function that just logs to console
async function sendOTPToConsole(email, otp) {
  console.log('\n' + '='.repeat(60));
  console.log('📧 OTP EMAIL - DEVELOPMENT MODE');
  console.log('='.repeat(60));
  console.log(`📧 To: ${email}`);
  console.log(`🔢 OTP Code: ${otp}`);
  console.log('⏰ Valid for: 10 minutes');
  console.log('💡 Copy this OTP to verify your login');
  console.log('='.repeat(60) + '\n');
  
  return { success: true, messageId: 'console-dev-' + Date.now() };
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    console.log('Generated OTP for', email, ':', otp);
    
    // Hash the OTP before storing
    const hashedOTP = await hashOTP(otp);
    
    // Set expiry time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Check if user exists, if not create one
    let userResult = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (userResult.length === 0) {
      console.log('Creating new user for email:', email);
      await query(
        'INSERT INTO users (email) VALUES (?)',
        [email]
      );
    }

    // Invalidate any existing unused OTPs for this email
    await query(
      'UPDATE otps SET is_used = TRUE WHERE email = ? AND is_used = FALSE',
      [email]
    );

    // Store the new OTP
    await query(
      'INSERT INTO otps (email, otp_hash, expires_at) VALUES (?, ?, ?)',
      [email, hashedOTP, expiresAt]
    );

    // "Send" OTP via console
    const emailResult = await sendOTPToConsole(email, otp);
    
    return NextResponse.json({
      message: 'OTP generated successfully! Check the server console for your OTP code.',
      email: email,
      devMode: true
    });

  } catch (error) {
    console.error('Error in send-otp-temp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}