import mysql from 'mysql2/promise';

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

const connection = mysql.createPool({
  host: isProduction ? process.env.MYSQLHOST : process.env.DB_HOST,
  port: isProduction ? parseInt(process.env.MYSQLPORT) : 3306,
  user: isProduction ? process.env.MYSQLUSER : process.env.DB_USER,
  password: isProduction ? process.env.MYSQLPASSWORD : process.env.DB_PASSWORD,
  database: isProduction ? process.env.MYSQLDATABASE : process.env.DB_NAME,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default connection;
