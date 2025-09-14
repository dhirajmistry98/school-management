// src/app/api/auth/verify-otp/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyOTP, generateJWT } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    console.log('Verify OTP request for email:', email, 'OTP:', otp);

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    if (otp.length !== 6) {
      return NextResponse.json(
        { error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    // Get the latest unused OTP for this email
    const otpRecords = await query(`
      SELECT id, otp_hash, expires_at 
      FROM otps 
      WHERE email = ? AND is_used = FALSE AND expires_at > NOW()
      ORDER BY created_at DESC 
      LIMIT 1
    `, [email]);

    console.log('Found OTP records:', otpRecords.length);

    if (otpRecords.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    const otpRecord = otpRecords[0];
    console.log('Verifying OTP against stored hash...');

    // Verify the OTP
    const isValid = await verifyOTP(otp, otpRecord.otp_hash);
    console.log('OTP verification result:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await query(
      'UPDATE otps SET is_used = TRUE WHERE id = ?',
      [otpRecord.id]
    );

    // Update user verification status
    await query(
      'UPDATE users SET is_verified = TRUE WHERE email = ?',
      [email]
    );

    // Generate JWT token
    const token = generateJWT(email);
    console.log('Login successful for:', email);

    // Create the response
    const response = NextResponse.json({
      message: 'Login successful',
      email: email
    });

    // Set the auth token as an HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}