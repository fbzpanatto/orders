import db from './db'
import config from '../config'
import helper from '../helper' 

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT ID, Nome, Idade, UF 
    FROM Clientes LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

export default {
  getMultiple
}