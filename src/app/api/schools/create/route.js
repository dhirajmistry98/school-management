// src/app/api/schools/create/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function POST(request) {
  try {
    // Check authentication
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { name, address, city, state, contact, email, image } = await request.json();

    // Validate required fields
    if (!name || !address || !city || !state || !contact || !email) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Get user ID
    const userResult = await query(
      'SELECT id FROM users WHERE email = ?',
      [payload.email]
    );

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = userResult[0].id;

    // Insert school (modify this query based on your existing schools table structure)
    const result = await query(
      `INSERT INTO schools (name, address, city, state, contact, email, image, added_by, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, address, city, state, contact, email, image || null, userId]
    );

    return NextResponse.json({
      message: 'School created successfully',
      schoolId: result.insertId
    });

  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}