// src/app/api/debug-env/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    DB_HOST: process.env.DB_HOST || 'NOT_SET',
    DB_USER: process.env.DB_USER || 'NOT_SET', 
    DB_NAME: process.env.DB_NAME || 'NOT_SET',
    hasPassword: process.env.DB_PASSWORD ? 'SET' : 'NOT_SET',
    passwordLength: process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0,
    allEnvKeys: Object.keys(process.env).filter(key => key.startsWith('DB_')),
    cwd: process.cwd(),
    // Don't log sensitive data in production
    envFile: process.env.NODE_ENV === 'development' ? 'Check for .env.local in ' + process.cwd() : 'hidden'
  });
}