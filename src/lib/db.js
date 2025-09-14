// src/lib/db.js
import mysql from 'mysql2/promise';

// Load environment variables
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

// Debug: Print all environment variables
console.log('All environment variables:', Object.keys(process.env).filter(key => key.startsWith('DB_')));
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current working directory:', process.cwd());

// Check for required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Make sure you have a .env.local file in your project root with these variables set.');
  console.error('Current working directory:', process.cwd());
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('DB_') || key.startsWith('MYSQL')));
  
  // For development, provide fallback values
  if (!isProduction) {
    console.warn('⚠️ Using fallback database configuration for development');
    process.env.DB_HOST = process.env.DB_HOST || 'localhost';
    process.env.DB_USER = process.env.DB_USER || 'root';
    process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'Dhiraj@98';
    process.env.DB_NAME = process.env.DB_NAME || 'school_management';
  } else {
    throw new Error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
  }
}

const connectionConfig = {
  host: isProduction ? process.env.MYSQLHOST : process.env.DB_HOST,
  port: isProduction ? parseInt(process.env.MYSQLPORT) : 3306,
  user: isProduction ? process.env.MYSQLUSER : process.env.DB_USER,
  password: isProduction ? process.env.MYSQLPASSWORD : process.env.DB_PASSWORD,
  database: isProduction ? process.env.MYSQLDATABASE : process.env.DB_NAME,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

console.log('Connection config (passwords hidden):', {
  ...connectionConfig,
  password: connectionConfig.password ? '[HIDDEN]' : '[NOT SET]'
});

const connection = mysql.createPool(connectionConfig);

// Add the query function that your routes are trying to import
export async function query(sql, params = []) {
  try {
    console.log('Executing query:', sql, 'with params:', params);
    const [rows] = await connection.execute(sql, params);
    console.log('Query executed successfully, rows returned:', rows.length);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Failed query:', sql);
    console.error('Query params:', params);
    throw error;
  }
}

// Test the connection on startup (only in development)
if (!isProduction) {
  (async () => {
    try {
      await query('SELECT 1');
      console.log('✅ Database connection established successfully');
    } catch (error) {
      console.error('❌ Failed to establish database connection:', error.message);
    }
  })();
}

// Keep the default export for backward compatibility
export default connection;