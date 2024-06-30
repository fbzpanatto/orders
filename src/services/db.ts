import mysql from 'mysql2/promise'
import dotenv from 'dotenv';
dotenv.config();

export const connectionPool = mysql.createPool({
  host: 'localhost',
  user: 'fbzpanatto',
  // database: process.env.NODE_ENV === 'development' ? 'mydb' : 'mydbTest',
  database: 'mydb',
  password: 'fnp181292',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  dateStrings: true
});

export async function dbConn() { return await connectionPool.getConnection() }