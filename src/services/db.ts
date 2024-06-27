import mysql from 'mysql2/promise'
import { config } from '../config'

import dotenv from 'dotenv';
dotenv.config();

console.log('process.env.NODE', process.env.NODE_ENV)

export const connectionPool = mysql.createPool({
  host: 'localhost',
  user: 'fbzpanatto',
  database: process.env.NODE_ENV === 'development' ? 'mydb' : 'mydbTest',
  password: 'fnp181292',
  // waitForConnections: true,
  // connectionLimit: 10,
  // maxIdle: 10,
  // idleTimeout: config().db.connectTimeout,
  // queueLimit: 0,
  // enableKeepAlive: true,
  // keepAliveInitialDelay: 0,
  dateStrings: true
});

export async function dbConn() { return await connectionPool.getConnection() }