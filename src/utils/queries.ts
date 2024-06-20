import { ResultSetHeader, format } from 'mysql2';
import { getOffset } from '../helper';
import { config } from '../config'
import { formatDate } from './formatDate';
import { PoolConnection } from 'mysql2/promise';

export const selectMaxColumn = async (conn: PoolConnection, table: string, columnName: string, maxColumnAlias: string, whereColumn: string, whereColumnValue: number) => {

  const query = `SELECT MAX(${columnName}) as ${maxColumnAlias} FROM ${table} WHERE ${whereColumn} = ?`;
  const [results] = await conn.query(query, [whereColumnValue]);
  const maxColumnResult = (results as Array<any>)[0]
  const lastColumnID = maxColumnResult[maxColumnAlias] || 0;
  const newColumnId = lastColumnID + 1;
  return newColumnId as number
}

export async function selectAllFrom<T>(connection: PoolConnection, table: string, page = 1, paramQuery?: string) {

  const offset = getOffset(page, config().listPerPage);
  const limit = `LIMIT ${offset},${config().listPerPage}`

  let queryString = paramQuery ? `${paramQuery} ${limit}` : `SELECT * FROM ${table} ${limit}`

  const [results,] = await connection.query(format(queryString))

  return results as Array<T>
}

export const selectAllFromWhere = async (connection: PoolConnection, table: string, column: string, columnValue: string | number) => {

  const queryString = `SELECT * FROM ${table} WHERE ${column}=?`;

  const [results,] = await connection.query(format(queryString, [columnValue]))

  return results
};

export const insertInto = async (connection: PoolConnection, table: string, body: { [key: string]: any }, fieldsToIgnore: string[]) => {

  const columns = Object.entries(body)
    .filter(([key]) => !fieldsToIgnore.includes(key))
    .map(([key]) => key);

  const placeholders = columns.map(() => '?')

  const queryString = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

  const values = Object.values(body).filter((_, index) => !fieldsToIgnore.includes(columns[index]));

  return await connection.query(format(queryString, values)) as any
};

export const updateTableSetWhere = async (connection: PoolConnection, table: string, column: string, columnValue: number, body: any, fieldsToIgnore: string[]) => {

  if (body === undefined) { return }

  body.updated_at = formatDate(new Date())

  const columns = Object.entries(body)
    .filter(([key]) => !fieldsToIgnore.includes(key))
    .map(([key, value]) => ({ key, value }));

  const queryString = `UPDATE ${table} SET ${columns.map(({ key }) => `${key}=?`).join(', ')} WHERE ${column}=?`;

  const values = [...columns.map(({ value }) => value), columnValue];

  const [result,] = await connection.query(format(queryString, values))

  return result as ResultSetHeader
};

export const deleteFromWhere = async (connection: PoolConnection, table: string, whereObject: { column: string, value: number | string }[]) => {

  const whereClause = whereObject.map(({ column, value }) => `${column} = ?`).join(' AND ');
  const values = whereObject.map(({ value }) => value);

  const queryString = `DELETE FROM ${table} WHERE ${whereClause}`;

  const [result,] = await connection.query(format(queryString, values));

  return result as ResultSetHeader
}

export const duplicateKeyUpdate = async (conn: PoolConnection, table: string, arr: any[] | undefined, key: string, value: number) => {

  if (!arr?.length || arr === undefined) { return }

  const mappedArr = arr.map((el: any) => { return { ...el, [key]: value } })
  const columns = extractKeysFromFirstObject(mappedArr);
  const placeholders = columns.map(() => '?').join(', ');
  const updateClause = columns.map(column => `${column} = VALUES(${column})`).join(', ');

  const update = `${updateClause}, updated_at = VALUES(updated_at)`;
  const values = mappedArr.flatMap(item => columns.map(column => item[column]));

  const queryString = `
  INSERT INTO ${table} (${columns.join(', ')}) 
  VALUES ${mappedArr.map(() => `(${placeholders})`).join(', ')}
  ON DUPLICATE KEY UPDATE ${update};
`;

  const [result,] = await conn.query(format(queryString, values))

  return result as ResultSetHeader
}

const extractKeysFromFirstObject = (array: { [key: string]: any }[]) => { return Object.keys(array[0]) }