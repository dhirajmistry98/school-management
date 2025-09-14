// src/app/api/schools/route.js
import { NextResponse } from 'next/server';
import connection from '@/lib/db';

// GET: fetch schools with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const board = searchParams.get('board');
    const type = searchParams.get('type');
    const hostel = searchParams.get('hostel');

    let query = 'SELECT * FROM schools WHERE 1=1';
    const params = [];

    if (city && city !== 'All') {
      query += ' AND city = ?';
      params.push(city);
    }
    if (board && board !== 'All') {
      query += ' AND board = ?';
      params.push(board);
    }
    if (type && type !== 'All') {
      query += ' AND type = ?';
      params.push(type);
    }
    if (hostel && hostel !== 'All') {
      query += ' AND hostel_facility = ?';
      params.push(hostel);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await connection.execute(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: insert new school (image filename only, uploaded separately)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, address, city, state, contact, email_id, board, type, hostel_facility, image } = body;

    const [result] = await connection.execute(
      'INSERT INTO schools (name, address, city, state, contact, email_id, board, type, hostel_facility, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, email_id, board, type, hostel_facility, image]
    );

    return NextResponse.json({
      message: 'School added successfully',
      id: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
