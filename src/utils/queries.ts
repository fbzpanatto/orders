import { ResultSetHeader, format } from 'mysql2';
import { getOffset } from '../helper';
import { config } from '../config'
import { formatDate } from './formatDate';
import { PoolConnection } from 'mysql2/promise';


interface WhereConditions {
  [key: string]: any;
}

interface JoinCondition {
  column1: string;
  column2: string;
}

interface JoinClause {
  table: string;
  alias: string;
  conditions: JoinCondition[];
}

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

export const selectAllWithWhereLeft = async (connection: PoolConnection, table: string, whereConditions: { [key: string]: any }, joins: { table: string, on: string }[] = []) => {

  const whereClause = Object.keys(whereConditions).length > 0 ? 'WHERE ' + Object.keys(whereConditions).map(key => `${table}.${key}=?`).join(' AND ') : '';

  const joinClause = joins.map(join => `LEFT JOIN ${join.table} ON ${join.on}`).join(' ');

  const queryString = `SELECT * FROM ${table} ${joinClause} ${whereClause}`;

  const values = Object.values(whereConditions);

  console.log('queryString', queryString)
  console.log('values', values)

  const [results] = await connection.query(format(queryString, values));

  return results;
};

export const selectWithJoinsAndWhere = async (connection: PoolConnection, baseTable: string, baseAlias: string, selectFields: string[], whereConditions: WhereConditions, joins: JoinClause[] = []) => {

  const selectClause = selectFields.join(', ');

  const whereClause = Object.keys(whereConditions).length > 0
    ? 'WHERE ' + Object.keys(whereConditions).map(key => `${baseAlias}.${key}=?`).join(' AND ')
    : '';

  const joinClause = joins.map(join => {
    const joinConditions = join.conditions.map(condition => `${condition.column1} = ${condition.column2}`).join(' AND ');
    return `LEFT JOIN ${join.table} AS ${join.alias} ON ${joinConditions}`;
  }).join(' ');

  const queryString = `
    SELECT ${selectClause}
    FROM ${baseTable} AS ${baseAlias}
    ${joinClause}
    ${whereClause}
  `;

  const values = Object.values(whereConditions);

  console.log('queryString', queryString);
  console.log('values', values);

  const [results] = await connection.query(format(queryString, values));

  return results;
};

export const selectAllWithWhere = async (connection: PoolConnection, table: string, whereConditions: { [key: string]: any }) => {

  if (Object.keys(whereConditions).length === 0) { return }

  const whereClause = Object.keys(whereConditions).map(key => `${key}=?`).join(' AND ');
  const queryString = `SELECT * FROM ${table} WHERE ${whereClause}`;

  const values = Object.values(whereConditions);

  const [results] = await connection.query(format(queryString, values));

  return results;
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

export const update = async (conn: PoolConnection, table: string, whereObject: { [key: string]: any }, body: { [key: string]: any }, ignore: string[]) => {

  if (body === undefined) { return }

  const columns = Object.entries(body)
    .filter(([key]) => !ignore.includes(key))
    .map(([key, value]) => ({ key, value }));

  const setClause = columns.map(({ key }) => `${key}=?`).join(', ');
  const whereClause = Object.keys(whereObject).map(key => `${key}=?`).join(' AND ');

  const queryString = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

  const setValues = columns.map(({ value }) => value);
  const whereValues = Object.values(whereObject);
  const values = [...setValues, ...whereValues];

  const [result] = await conn.query(format(queryString, values));

  return result as ResultSetHeader;
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

export const duplicateKey = async (conn: PoolConnection, table: string, arr: { [key: string]: any }[] | undefined) => {

  if (!arr?.length || arr === undefined) { return }

  const columns = extractKeysFromFirstObject(arr);
  const placeholders = columns.map(() => '?').join(', ');
  const updateClause = columns.map(column => `${column} = VALUES(${column})`).join(', ');

  const update = `${updateClause}, updated_at = VALUES(updated_at)`;
  const values = arr.flatMap(item => columns.map(column => item[column]));

  const queryString = `
  INSERT INTO ${table} (${columns.join(', ')}) 
  VALUES ${arr.map(() => `(${placeholders})`).join(', ')}
  ON DUPLICATE KEY UPDATE ${update};
`;

  const [result,] = await conn.query(format(queryString, values))

  return result as ResultSetHeader
}

const extractKeysFromFirstObject = (array: { [key: string]: any }[]) => { return Object.keys(array[0]) }