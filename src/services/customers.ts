import { ResultSetHeader } from 'mysql2';
import { query } from './db'
import { config } from '../config'
import { emptyOrRows, getOffset } from '../helper'
import { objectResponse } from '../utils/response';
import { LegalPerson, NormalPerson, Person } from '../interfaces/person';
import { formatDate } from '../utils/formatDate';
import { Request } from 'express';
import { PersonCategories } from '../enums/personCategories';

export const getMultiple = async (page = 1) => {
  const offset = getOffset(page, config.listPerPage);
  const rows = await query(
    `
    SELECT *
    FROM persons LIMIT ${offset},${config.listPerPage}
    `
  );
  const data = emptyOrRows(rows);
  const meta = { page };

  if (!rows) { return objectResponse(400, 'Não foi possível processar sua solicitação.', { teste: 'data' }) }
  return objectResponse(200, 'Consulta realizada com sucesso.', { data, meta })
}

export const create = async (body: Person) => {

  const { insertId: personId } = await createPerson(body)

  if (personId && body.cnpj) { return await createLegalPerson(personId, body) }

  else if (personId && body.cpf) { return await createNormalPerson(personId, body) }

  else { return objectResponse(400, 'Não foi possível processar sua solicitação.') }
}

export const update = async (personId: number, req: Request) => {

  const { query: qParams, body } = req
  const personCategoryId = qParams['category'] as string

  if (parseInt(personCategoryId) === PersonCategories.legal) {
    const result = await findOnePerson('legal_persons', 'person_id', personId) as Array<LegalPerson>

    return result.length ? updateLegalPerson(personId, body) : objectResponse(404, 'Registro não encontrado.')
  }

  else if (parseInt(personCategoryId) === PersonCategories.normal) {
    const result = await findOnePerson('normal_persons', 'person_id', personId) as Array<NormalPerson>

    return result.length ? updateNormalPerson('normal_persons', personId, body) : objectResponse(404, 'Registro não encontrado.')
  }

  else { return objectResponse(400, 'Não foi possível processar sua solicitação.') }
}

export const remove = async (id: number) => {
  const result = await query(
    `
    DELETE FROM Clientes WHERE id=${id}
    `
  ) as ResultSetHeader

  if (!result.affectedRows) { return objectResponse(400, 'Não foi possível processar sua solicitação.') }
  return objectResponse(204, 'Registro removido com sucesso.');
}

export const findOnePerson = async (table: string, field: string, value: string | number) => {
  return await query(
    `
    SELECT * FROM ${table} WHERE ${field}=${value} LIMIT 1
    `
  )
}

const updateLegalPerson = async (personId: number, body: Person) => {
  const queryResult = await query(
    `

    `
  ) as ResultSetHeader

  return setResponse(200, 'Registro atualizado com sucesso.', queryResult.affectedRows)
}

const updateNormalPerson = async (table: string, personId: number, body: Person) => {

  let queryString = `UPDATE ${table} SET `
  let keyPairValue: string[] = []

  for (let key of Object.keys(body)) { keyPairValue.push(`${key}=${body[key as keyof Person]}`) }

  const queryResult = await query(queryString + keyPairValue.join(', ') + ` WHERE person_id=${personId}`) as ResultSetHeader

  return setResponse(200, 'Registro atualizado com sucesso.', queryResult.affectedRows)
}

const createPerson = async (body: Person) => {
  return await query(
    `
    INSERT INTO persons (person_category_id, created_at, updated_at)
    VALUES (${body.person_category.id}, '${body.created_at ?? formatDate(new Date())}', '${body.updated_at ?? formatDate(new Date())}')
    `
  ) as ResultSetHeader
}

const createLegalPerson = async (personId: number, body: Person) => {
  const queryResult = await query(
    `
    INSERT INTO legal_persons (person_id, cnpj, state_registration, corporate_name, social_name)
    VALUES(${personId}, '${body.cnpj}', '${body.state_registration}', '${body.corporate_name}', '${body.social_name}')
    `
  ) as ResultSetHeader

  return setResponse(200, 'Registro criado com sucesso.', queryResult.affectedRows)
}

const createNormalPerson = async (personId: number, body: Person) => {
  const queryResult = await query(
    `
    INSERT INTO normal_persons (person_id, cpf, first_name, middle_name, last_name)
    VALUES(${personId}, '${body.cpf}', '${body.first_name}', '${body.middle_name}', '${body.last_name}')
    `
  ) as ResultSetHeader

  return setResponse(200, 'Registro criado com sucesso.', queryResult.affectedRows)
}

const setResponse = (status: number, message: string, affectedRows: number | undefined) => {
  return affectedRows ?
    objectResponse(status, message) :
    objectResponse(400, 'Não foi possível processar sua solicitação.')
}