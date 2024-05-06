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

  if (personId && body.cnpj) { return await createLegalOrNormalPerson('legal_persons', { person_id: personId, ...body }) }

  else if (personId && body.cpf) { return await createLegalOrNormalPerson('normal_persons', { person_id: personId, ...body }) }

  else { return objectResponse(400, 'Não foi possível processar sua solicitação.') }
}

export const update = async (personId: number, req: Request) => {

  const { query: qParams, body } = req
  const personCategoryId = qParams['category'] as string

  if (parseInt(personCategoryId) === PersonCategories.legal) {
    const result = await findOnePerson('legal_persons', 'person_id', personId) as Array<LegalPerson>

    return result.length ? updatePerson('legal_persons', personId, body) : objectResponse(404, 'Registro não encontrado.')
  }

  else if (parseInt(personCategoryId) === PersonCategories.normal) {
    const result = await findOnePerson('normal_persons', 'person_id', personId) as Array<NormalPerson>

    return result.length ? updatePerson('normal_persons', personId, body) : objectResponse(404, 'Registro não encontrado.')
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

const updatePerson = async (table: string, personId: number, body: Person) => {

  // TODO: set updated_at IN THIS TABLE. remove from persons?
  // TODO: check if the field is integer.

  const personUpdates = Object.entries(body)
    .filter(([key]) => !['person_id', 'person_category'].includes(key))
    .map(([key, value]) => `${key}='${value}'`)

  const queryString = `UPDATE ${table} SET ${personUpdates.join(', ')} WHERE person_id=${personId}`;

  const queryResult = await query(queryString) as ResultSetHeader;

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

const createLegalOrNormalPerson = async (table: string, body: Person) => {

  let keys: string[] = []
  let values: any[] = []

  Object.entries(body)
    .filter(([key]) => key !== 'person_category')
    .reduce((accum, [key, value]) => {
      accum.keys.push(key);
      accum.values.push(typeof value === 'number' ? value : `'${value}'`);
      return accum;
    }, { keys, values });

  const queryString = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${values.join(', ')})`;

  const queryResult = await query(queryString) as ResultSetHeader;

  return setResponse(200, 'Registro criado com sucesso.', queryResult.affectedRows)
};

const setResponse = (status: number, message: string, affectedRows: number | undefined) => {
  return affectedRows ?
    objectResponse(status, message) :
    objectResponse(400, 'Não foi possível processar sua solicitação.')
}