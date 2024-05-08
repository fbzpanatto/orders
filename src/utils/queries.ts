import { ResultSetHeader, format } from 'mysql2';
import { query } from '../services/db'
import { setResponse } from './response';

export const findRegisters = async (table: string, field: string, value: string | number) => {

  const placeholder = '?';

  const queryString = `SELECT * FROM ${table} WHERE ${field}=${placeholder}`;

  const values = [value];

  return await query(format(queryString, values)) as Array<{ [key: string]: any }>
};

export const createRow = async (table: string, body: { [key: string]: any }, bodyFieldsToIgnore: string[]) => {

  const columns = Object.entries(body)
    .filter(([key]) => !bodyFieldsToIgnore.includes(key))
    .map(([key]) => key);

  const placeholders = columns.map(() => '?')

  const queryString = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

  const values = Object.values(body).filter((_, index) => !bodyFieldsToIgnore.includes(columns[index]));

  const queryResult = await query(format(queryString, values)) as ResultSetHeader

  return setResponse(200, 'Registro criado com sucesso.', queryResult.affectedRows);
};

export const updateRow = async (table: string, whereField: string, param: number, body: { [key: string]: any }, bodyFieldsToIgnore: string[]) => {
  const updates = Object.entries(body)
    .filter(([key]) => !bodyFieldsToIgnore.includes(key))
    .map(([key]) => `${key}=?`);

  const whereClause = `${whereField}=?`;

  const queryString = `UPDATE ${table} SET ${updates.join(', ')} WHERE ${whereClause}`;

  const values = [
    ...Object.values(body).filter(([key]) => !bodyFieldsToIgnore.includes(key)),
    param,
  ];

  const queryResult = await query(format(queryString, values)) as ResultSetHeader

  return setResponse(200, 'Registro atualizado com sucesso.', queryResult.affectedRows);
};