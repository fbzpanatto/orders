import { ResultSetHeader, format } from 'mysql2';
import { query } from '../services/db'
import { getOffset } from '../helper';
import { config } from '../config'
import { formatDate } from './formatDate';

export async function selectAllFrom<T>(table: string, page = 1, paramQuery?: string) {

  const offset = getOffset(page, config().listPerPage);
  const limit = `LIMIT ${offset},${config().listPerPage}`

  let queryString = paramQuery ? `${paramQuery} ${limit}` : `SELECT * FROM ${table} ${limit}`

  return await query(format(queryString)) as Array<T>
}

export const selectAllFromWhere = async (table: string, column: string, columnValue: string | number) => {

  const queryString = `SELECT * FROM ${table} WHERE ${column}=?`;

  return await query(format(queryString, [columnValue])) as Array<{ [key: string]: any }>
};

export const insertInto = async (table: string, body: { [key: string]: any }, fieldsToIgnore: string[]) => {

  const columns = Object.entries(body)
    .filter(([key]) => !fieldsToIgnore.includes(key))
    .map(([key]) => key);

  const placeholders = columns.map(() => '?')

  const queryString = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

  const values = Object.values(body).filter((_, index) => !fieldsToIgnore.includes(columns[index]));

  return await query(format(queryString, values)) as ResultSetHeader
};

export const updateTableSetWhere = async (table: string, column: string, columnValue: number, body: { [key: string]: any }, fieldsToIgnore: string[]) => {

  const columns = Object.entries(body)
    .filter(([key]) => !fieldsToIgnore.includes(key))
    .map(([key, value]) => ({ key, value }));

  const queryString = `UPDATE ${table} SET ${columns.map(({ key }) => `${key}=?`).join(', ')} WHERE ${column}=?`;

  const values = [...columns.map(({ value }) => value), columnValue];

  return await query(format(queryString, values)) as ResultSetHeader
};

export const contactsDuplicateKeyUpdate = async (table: string, arrayOfObjects: any[] | undefined, personId: number) => {

  if (!arrayOfObjects?.length) { return }

  const mappedArray = arrayOfObjects
    .map((el: any) => { return { ...el, person_id: personId, created_at: formatDate(new Date()) } })

  const columns = extractKeysFromFirstObject(mappedArray);
  const updateClause = columns
    .map(column => `${column} = VALUES(${column})`).join(', ');

  const queryString = `
  INSERT INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})
  ON DUPLICATE KEY UPDATE ${updateClause};
`;

  for (let item of mappedArray) {
    const values = columns.map(column => item[column]);
    const queryResult = await query(format(queryString, values)) as ResultSetHeader
    console.log('queryResult', queryResult)
  }
}

// TODO: create a validation that check if each object have the minimum necessary keys and values
const extractKeysFromFirstObject = (array: { [key: string]: any }[]) => { return Object.keys(array[0]) }