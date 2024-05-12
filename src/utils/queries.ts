import { ResultSetHeader, format } from 'mysql2';
import { query } from '../services/db'
import { getOffset } from '../helper';
import { config } from '../config'

export async function selectAllFrom<T>(table: string, page = 1) {

  const offset = getOffset(page, config().listPerPage);
  return await query(format(
    `
    SELECT * FROM ${table}
    LIMIT ${offset},${config().listPerPage}
    `
  )) as Array<T>
}

export const selectAllFromWhere = async (table: string, column: string, columnValue: string | number) => {

  const placeholder = '?';

  const queryString = `SELECT * FROM ${table} WHERE ${column}=${placeholder}`;

  const values = [columnValue];

  return await query(format(queryString, values)) as Array<{ [key: string]: any }>
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

  const includedColumns = Object.entries(body)
    .filter(([key]) => !fieldsToIgnore.includes(key))
    .map(([key, value]) => ({ key, value }));

  const queryString = `UPDATE ${table} SET ${includedColumns.map(({ key }) => `${key}=?`).join(', ')} WHERE ${column}=?`;

  const values = [...includedColumns.map(({ value }) => value), columnValue];

  return await query(format(queryString, values)) as ResultSetHeader
};