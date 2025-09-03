import mysql from 'mysql2/promise';

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

const connection = mysql.createPool({
  host: isProduction ? process.env.MYSQLHOST : (process.env.DB_HOST || 'localhost'),
  port: isProduction ? parseInt(process.env.MYSQLPORT || '3306') : 3306,
  user: isProduction ? process.env.MYSQLUSER : (process.env.DB_USER || 'root'),
  password: isProduction ? process.env.MYSQLPASSWORD : (process.env.DB_PASSWORD || 'Dhiraj@98'),
  database: isProduction ? process.env.MYSQLDATABASE : (process.env.DB_NAME || 'school_management'),
  ssl: isProduction ? { 
    rejectUnauthorized: false 
  } : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
});

// Test connection and handle errors gracefully
const testConnection = async () => {
  try {
    const conn = await connection.getConnection();
    console.log(`✅ Database connected successfully to ${isProduction ? 'production' : 'local'} database`);
    conn.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (isProduction) {
      console.error('Make sure your production database environment variables are set correctly');
    } else {
      console.error('Make sure your local MySQL server is running');
    }
  }
};

// Test connection on startup
testConnection();

export default connection;