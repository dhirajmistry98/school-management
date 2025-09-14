// src/app/api/auth/check/route.js
import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: 'No auth token found' },
        { status: 401 }
      );
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { authenticated: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user info from database
    const userResult = await query(
      'SELECT id, email, is_verified FROM users WHERE email = ?',
      [payload.email]
    );

    if (userResult.length === 0) {
      return NextResponse.json(
        { authenticated: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult[0];

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        isVerified: user.is_verified
      }
    });

  } catch (error) {
    console.error('Error in check auth:', error);
    return NextResponse.json(
      { authenticated: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}