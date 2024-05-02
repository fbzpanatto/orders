import { ResultSetHeader } from 'mysql2';
import db from './db'
import config from '../config'
import helper from '../helper'
import objectResponse from '../utils/response';

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `
    SELECT ID, Nome, Idade, UF 
    FROM Clientes LIMIT ${offset},${config.listPerPage}
    `
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  if (!rows) { return objectResponse(400, 'Não foi possível processar sua solicitação.', { teste: 'data' }) }
  return objectResponse(200, 'Sucesso', { data, meta })
}

async function create(el: { nome: string, idade: number, uf: string }) {

  const result = await db.query(
    `
    INSERT INTO Clientes (Nome, Idade, UF) 
    VALUES ('${el.nome}', ${el.idade}, '${el.uf}')
    `
  ) as ResultSetHeader

  if (!result.affectedRows) { return objectResponse(400, 'Não foi possível processar sua solicitação.') }
  return objectResponse(200, 'Registro criado com sucesso.');
}

async function update(id: number, el: { nome: string, idade: number, uf: string }) {
  const result = await db.query(
    `
    UPDATE Clientes 
    SET nome="${el.nome}", idade=${el.idade}, uf="${el.uf}"
    WHERE id=${id}
    `
  ) as ResultSetHeader

  if (!result.affectedRows) { return objectResponse(400, 'Não foi possível processar sua solicitação.') }
  return objectResponse(201, 'Registro atualizado com sucesso.');
}

async function remove(id: number) {
  const result = await db.query(
    `
    DELETE FROM Clientes WHERE id=${id}
    `
  ) as ResultSetHeader

  if (!result.affectedRows) { return objectResponse(400, 'Não foi possível processar sua solicitação.') }
  return objectResponse(204, 'Registro removido com sucesso.');
}

export default {
  getMultiple,
  create,
  update,
  remove
}