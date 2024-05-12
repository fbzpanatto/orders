import { ResultSetHeader, format } from 'mysql2';
import { query } from '../services/db'

export const selectAllFrom = async () => {

}

export const selectAllFromWhere = async (table: string, column: string, columnValue: string | number) => {

  const placeholder = '?';

  const queryString = `SELECT * FROM ${table} WHERE ${column}=${placeholder}`;

  const values = [columnValue];

  return await query(format(queryString, values)) as Array<{ [key: string]: any }>
};

export const insertInto = async (table: string, body: { [key: string]: any }, bodyFieldsToIgnore: string[]) => {

  const columns = Object.entries(body)
    .filter(([key]) => !bodyFieldsToIgnore.includes(key))
    .map(([key]) => key);

  const placeholders = columns.map(() => '?')

  const queryString = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

  const values = Object.values(body).filter((_, index) => !bodyFieldsToIgnore.includes(columns[index]));

  return await query(format(queryString, values)) as ResultSetHeader
};

export const updateTableSetWhere = async (table: string, column: string, columnValue: number, body: { [key: string]: any }, bodyFieldsToIgnore: string[]) => {

  const includedColumns = Object.entries(body)
    .filter(([key]) => !bodyFieldsToIgnore.includes(key))
    .map(([key, value]) => ({ key, value }));

  const queryString = `UPDATE ${table} SET ${includedColumns.map(({ key }) => `${key}=?`).join(', ')} WHERE ${column}=?`;

  const values = [...includedColumns.map(({ value }) => value), columnValue];

  return await query(format(queryString, values)) as ResultSetHeader
};