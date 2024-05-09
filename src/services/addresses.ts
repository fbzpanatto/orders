import { objectResponse } from '../utils/response';
import { PersonAddresses } from '../interfaces/addresses';
import { findRegistersByOneParameter, updateRow, createRow } from '../utils/queries';
import { DatabaseTables } from '../enums/tables';
import { Request } from 'express';

export const getOneAddress = async (personId: number) => {

  const result = await findRegistersByOneParameter(DatabaseTables.person_addresses, 'person_id', personId) as Array<PersonAddresses>

  return objectResponse(200, 'Consulta realizada com sucesso.', { result })
}

export const createAddress = async (body: PersonAddresses) => {

  return await createRow(DatabaseTables.person_addresses, body, [])
}

export const updateAdress = async (id: number, req: Request) => {

  const { body } = req

  return await updateRow(DatabaseTables.person_addresses, 'id', id, body as PersonAddresses, ['person_id'])

}