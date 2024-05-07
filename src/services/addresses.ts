import { ResultSetHeader } from 'mysql2';
import { query } from './db'
import { config } from '../config'
import { emptyOrRows } from '../helper';
import { objectResponse, setResponse } from '../utils/response';
import { PersonAddresses } from '../interfaces/addresses';

export const getOneAddress = async (id: number) => {
  const result = await query(
    `
    `
  ) as ResultSetHeader

  const data = (emptyOrRows(result) as Array<PersonAddresses>)

  return objectResponse(200, '', { data })
}

export const createAddress = async (body: PersonAddresses) => {

  const queryResult = await query(
    `
    `
  ) as ResultSetHeader

  return setResponse(200, 'Registro criado com sucesso.', queryResult.insertId)
}

export const updateAdress = async (id: number) => {

  const queryResult = await query(
    `
    `
  ) as ResultSetHeader

  return setResponse(200, 'Registro atualizado com sucesso.', queryResult.affectedRows)
}