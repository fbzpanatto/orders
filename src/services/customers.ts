import { ResultSetHeader } from 'mysql2';
import { query } from './db'
import { config } from '../config'
import { emptyOrRows, getOffset } from '../helper'
import { objectResponse } from '../utils/response';
import { Person } from '../interfaces/person';
import { formatDate } from '../utils/formatDate';

export async function getMultiple(page = 1) {
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
  return objectResponse(200, 'Sucesso', { data, meta })
}

export async function create(body: Person) {

  const { insertId: personId } = await createPerson(body)

  if (personId && body.cnpj) { return await createLegalPerson(personId, body) }

  else if (personId && body.cpf) { return await createNormalPerson(personId, body) }

  else { return objectResponse(400, 'Não foi possível processar sua solicitação.') }
}

export async function update(id: number, el: { nome: string, idade: number, uf: string }) {
  const result = await query(
    `
    UPDATE Clientes 
    SET nome="${el.nome}", idade=${el.idade}, uf="${el.uf}"
    WHERE id=${id}
    `
  ) as ResultSetHeader

  if (!result.affectedRows) { return objectResponse(400, 'Não foi possível processar sua solicitação.') }
  return objectResponse(201, 'Registro atualizado com sucesso.');
}

export async function remove(id: number) {
  const result = await query(
    `
    DELETE FROM Clientes WHERE id=${id}
    `
  ) as ResultSetHeader

  if (!result.affectedRows) { return objectResponse(400, 'Não foi possível processar sua solicitação.') }
  return objectResponse(204, 'Registro removido com sucesso.');
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

  return setResponse(queryResult.affectedRows)
}

const createNormalPerson = async (personId: number, body: Person) => {
  const queryResult = await query(
    `
    INSERT INTO normal_persons (person_id, cpf, first_name, middle_name, last_name)
    VALUES(${personId}, '${body.cpf}', '${body.first_name}', '${body.middle_name}', '${body.last_name}')
    `
  ) as ResultSetHeader

  return setResponse(queryResult.affectedRows)
}

const setResponse = (affectedRows: number | undefined) => {
  return affectedRows ?
    objectResponse(200, 'Registro criado com sucesso.') :
    objectResponse(400, 'Não foi possível processar sua solicitação.')
}