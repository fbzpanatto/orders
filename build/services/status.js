"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.createStatus = exports.getStatus = void 0;
const db_1 = require("./db");
const tables_1 = require("../enums/tables");
const response_1 = require("../utils/response");
const queries_1 = require("../utils/queries");
const helper_1 = require("../helper");
const getStatus = async (req) => {
    const { company_id, status_id } = req.query;
    let conn = null;
    let extra = {};
    try {
        conn = await (0, db_1.dbConn)();
        const baseTable = tables_1.Tables.status;
        const baseAlias = 's';
        const joins = [
            { table: tables_1.Tables.companies, alias: 'c', conditions: [{ column1: 's.company_id', column2: 'c.company_id' }] }
        ];
        if (!isNaN(parseInt(company_id)) && !isNaN(parseInt(status_id))) {
            const fields = ['s.*', 'c.cnpj', 'c.social_name'];
            const where = { company_id, status_id };
            const result = await (0, queries_1.selectJoinsWhere)(conn, baseTable, baseAlias, fields, where, joins);
            const data = result[0];
            extra.companies = await (0, queries_1.selectJoinsWhere)(conn, tables_1.Tables.companies, 'c', ['c.*'], { company_id });
            return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data, meta: { extra } });
        }
        const fields = ['s.*', 'c.corporate_name'];
        const wherecondition = !isNaN(parseInt(company_id)) ? { company_id: parseInt(company_id) } : {};
        const result = await (0, queries_1.selectJoinsWhere)(conn, tables_1.Tables.status, 's', fields, wherecondition, joins);
        const data = (0, helper_1.emptyOrRows)(result);
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.getStatus = getStatus;
const createStatus = async (req) => {
    const { body } = req;
    let conn = null;
    try {
        conn = await (0, db_1.dbConn)();
        await conn.beginTransaction();
        const status_id = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.status, 'status_id', 'max_status_id', 'company_id', body.company_id);
        await (0, queries_1.insertInto)(conn, tables_1.Tables.status, { ...body, status_id }, []);
        await conn.commit();
        return (0, response_1.objectResponse)(200, 'Registro criado com sucesso.', { affectedRows: 1 });
    }
    catch (error) {
        return rollBackCatchBlock(error, conn);
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.createStatus = createStatus;
const updateStatus = async (req) => {
    const { body, query } = req;
    const { company_id, status_id } = query;
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        await connection.beginTransaction();
        await (0, queries_1.update)(connection, tables_1.Tables.status, { status_id, company_id }, { next_status_id: body.next_status_id, name: body.name }, []);
        await connection.commit();
        return (0, response_1.objectResponse)(200, 'Registro atualizado com sucesso.', { affectedRows: 1 });
    }
    catch (error) {
        return rollBackCatchBlock(error, connection);
    }
    finally {
        if (connection) {
            connection.release();
        }
    }
};
exports.updateStatus = updateStatus;
const rollBackCatchBlock = async (error, connection) => {
    console.log('error', error);
    if (connection)
        await connection.rollback();
    return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
};
