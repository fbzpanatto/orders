import { objectResponse } from '../utils/response';
import { PersonAddresses } from '../interfaces/addresses';
import { findOneRegister, updateRow, createRow } from '../utils/queries';
import { DatabaseTables } from '../enums/tables';
import { Request } from 'express';

export const getOneAddress = async (id: number) => {

  const result = await findOneRegister(DatabaseTables.person_adresses, 'person_id', id) as Array<PersonAddresses>

  return objectResponse(200, 'Consulta realizada com sucesso.', { result })
}

export const createAddress = async (body: PersonAddresses) => {

  return await createRow(DatabaseTables.person_adresses, body, [])

}

export const updateAdress = async (id: number, req: Request) => {

  const { body } = req

  return await updateRow(DatabaseTables.person_adresses, 'id', id, body as PersonAddresses, [])

}