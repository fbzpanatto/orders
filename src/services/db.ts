import mysql from 'mysql2/promise'
import { config } from '../config'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'fbzpanatto',
  database: 'mydbTest',
  password: 'fnp181292',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: config().db.connectTimeout, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// export async function query(sql: string, params?: any) {

//   const connection = await mysql.createConnection(config().db)

//   const [results,] = await connection.execute(sql, params)

//   return results
// }

export async function query(sql: string, params?: any) {
  const [results,] = await pool.query(sql, params)
  return results
}