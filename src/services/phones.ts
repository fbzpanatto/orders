import { objectResponse } from '../utils/response';
import { PersonPhones } from '../interfaces/phones';
import { findRegistersByOneParameter, updateRow, createRow } from '../utils/queries';
import { DatabaseTables } from '../enums/tables';
import { Request } from 'express';

export const getPersonPhones = async (personId: number) => {

  const result = await findRegistersByOneParameter(DatabaseTables.person_phones, 'person_id', personId) as Array<PersonPhones>

  return objectResponse(200, 'Consulta realizada com sucesso.', { result })
}

export const createPhone = async (body: PersonPhones) => {

  return await createRow(DatabaseTables.person_phones, body, [])
}

export const updatePhone = async (id: number, req: Request) => {

  const { body } = req

  return await updateRow(DatabaseTables.person_phones, 'id', id, body as PersonPhones, ['person_id'])
}