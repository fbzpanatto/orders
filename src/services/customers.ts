import db from './db'
import config from '../config'
import helper from '../helper'
import { ResultSetHeader } from 'mysql2';

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT ID, Nome, Idade, UF 
    FROM Clientes LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta
  }
}

async function create(el: { nome: string, idade: number, uf: string }) {

  const result = await db.query(
    `
    INSERT INTO Clientes (Nome, Idade, UF) 
    VALUES ('${el.nome}', ${el.idade}, '${el.uf}')
    `
  ) as ResultSetHeader

  if (!result.affectedRows) { return { message: 'Não foi possível processar essa solicitação. Tente novamente mais tarde.' } }
  return { message: 'Cliente criado com sucesso.' };
}

async function update(id: number, el: { nome: string, idade: number, uf: string }) {
  const result = await db.query(
    `
    UPDATE Clientes 
    SET nome="${el.nome}", idade=${el.idade}, uf="${el.uf}"
    WHERE id=${id}
    `
  ) as ResultSetHeader

  if (!result.affectedRows) { return { message: 'Não foi possível processar essa solicitação. Tente novamente mais tarde.' } }
  return { message: 'Cliente alterado com sucesso.' };
}

export default {
  getMultiple,
  create,
  update
}