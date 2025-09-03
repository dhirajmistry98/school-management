import { NextResponse } from 'next/server';
import connection from '@/lib/db';

export async function GET() {
  try {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    // Test basic connection
    const conn = await connection.getConnection();
    
    // Get database info
    const [dbInfo] = await conn.execute('SELECT DATABASE() as current_db, VERSION() as version');
    
    // Check if schools table exists and get count
    const [tables] = await conn.execute("SHOW TABLES LIKE 'schools'");
    let schoolCount = 0;
    let tableExists = tables.length > 0;
    
    if (tableExists) {
      const [count] = await conn.execute("SELECT COUNT(*) as count FROM schools");
      schoolCount = count[0].count;
    }
    
    conn.release();
    
    return NextResponse.json({
      status: 'success',
      environment: isProduction ? 'production' : 'development',
      database: {
        host: isProduction ? process.env.MYSQLHOST : process.env.DB_HOST,
        database: dbInfo[0].current_db,
        version: dbInfo[0].version,
        connection: 'successful'
      },
      schools_table: {
        exists: tableExists,
        count: schoolCount
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error.message,
      code: error.code,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}