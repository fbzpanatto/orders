import { ResultSetHeader } from 'mysql2';
import { query } from '../services/db'
import { setResponse } from './response';

export const findOneRegister = async (table: string, field: string, value: string | number) => {
  return await query(`SELECT * FROM ${table} WHERE ${field}=${value}`)
}

export const createRow = async (table: string, body: { [key: string]: any }, bodyFieldsToIgnore: string[]) => {

  let keys: string[] = []
  let values: any[] = []

  Object.entries(body)
    .filter(([key]) => !bodyFieldsToIgnore.includes(key))
    .reduce((accum, [key, value]) => {
      accum.keys.push(key);
      accum.values.push(typeof value === 'number' ? value : `'${value}'`);
      return accum;
    }, { keys, values });

  const queryString = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.join(', ')})`;

  const queryResult = await query(queryString) as ResultSetHeader;

  return setResponse(200, 'Registro criado com sucesso.', queryResult.affectedRows)
};

export const updateRow = async (table: string, whereField: string, param: number, body: { [key: string]: any }, bodyFieldsToIgnore: string[]) => {

  const rowUpdates = Object.entries(body)
    .filter(([key]) => !bodyFieldsToIgnore.includes(key))
    .map(([key, value]) => typeof value === 'number' ? `${key}=${value}` : `${key}='${value}'`)

  const queryString = `UPDATE ${table} SET ${rowUpdates.join(', ')} WHERE ${whereField}=${param}`;

  const queryResult = await query(queryString) as ResultSetHeader;

  return setResponse(200, 'Registro atualizado com sucesso.', queryResult.affectedRows)
};