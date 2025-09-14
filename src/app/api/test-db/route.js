// src/app/api/test-db/route.js
import { NextResponse } from 'next/server';
import connection, { query } from '@/lib/db';

export async function GET() {
  try {
    console.log('Environment variables:', {
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      hasPassword: !!process.env.DB_PASSWORD
    });

    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    // Test basic connection using the query function
    const dbInfo = await query('SELECT DATABASE() as current_db, VERSION() as version');
    
    // Check if required tables exist
    const tables = await query("SHOW TABLES");
    const tableNames = tables.map(row => Object.values(row)[0]);
    
    // Check users table
    let userCount = 0;
    let usersExists = tableNames.includes('users');
    if (usersExists) {
      const count = await query("SELECT COUNT(*) as count FROM users");
      userCount = count[0].count;
    }
    
    // Check otps table
    let otpCount = 0;
    let otpsExists = tableNames.includes('otps');
    if (otpsExists) {
      const count = await query("SELECT COUNT(*) as count FROM otps");
      otpCount = count[0].count;
    }
    
    // Check schools table
    let schoolCount = 0;
    let schoolsExists = tableNames.includes('schools');
    if (schoolsExists) {
      const count = await query("SELECT COUNT(*) as count FROM schools");
      schoolCount = count[0].count;
    }
    
    return NextResponse.json({
      status: 'success',
      environment: isProduction ? 'production' : 'development',
      database: {
        host: isProduction ? process.env.MYSQLHOST : process.env.DB_HOST,
        database: dbInfo[0].current_db,
        version: dbInfo[0].version,
        connection: 'successful'
      },
      tables: {
        users: { exists: usersExists, count: userCount },
        otps: { exists: otpsExists, count: otpCount },
        schools: { exists: schoolsExists, count: schoolCount }
      },
      all_tables: tableNames,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      environment: process.env.NODE_ENV,
      env_vars: {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        hasPassword: !!process.env.DB_PASSWORD
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}