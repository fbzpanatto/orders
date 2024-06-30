"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateField = exports.createField = exports.getFields = void 0;
const response_1 = require("../utils/response");
const queries_1 = require("../utils/queries");
const tables_1 = require("../enums/tables");
const helper_1 = require("../helper");
const db_1 = require("./db");
const resources_1 = require("../enums/resources");
const customers_1 = require("./customers");
const getFields = async (request, page) => {
    const { company_id, table_id, field_id, custom_fields, segments } = request.query;
    let conn = null;
    let extra = {};
    try {
        conn = await (0, db_1.dbConn)();
        const baseTable = tables_1.Tables.fields;
        const baseAlias = 'f';
        if (!isNaN(parseInt(company_id)) && table_id && field_id) {
            const selectFields = ['f.*'];
            const whereConditions = { company_id, table_id, field_id };
            const joins = [{ table: tables_1.Tables.companies, alias: 'c', conditions: [{ column1: 'f.company_id', column2: 'c.company_id' }] }];
            const result = await (0, queries_1.selectJoinsWhere)(conn, baseTable, baseAlias, selectFields, whereConditions, joins);
            const data = result[0];
            return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data });
        }
        if (!isNaN(parseInt(company_id)) && custom_fields && segments) {
            extra.custom_fields = await (0, customers_1.getCustomFields)(conn, parseInt(company_id));
            extra.segments = await (0, customers_1.getSegments)(conn, parseInt(company_id));
            return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data: [], meta: { extra, page } });
        }
        const selectFields = ['f.*', 'c.corporate_name'];
        const whereConditions = company_id ? { company_id } : {};
        const joins = [{ table: tables_1.Tables.companies, alias: 'c', conditions: [{ column1: 'f.company_id', column2: 'c.company_id' }] }];
        const rows = await (0, queries_1.selectJoinsWhere)(conn, baseTable, baseAlias, selectFields, whereConditions, joins);
        const data = formatedData((0, helper_1.emptyOrRows)(rows));
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data, meta: { extra, page } });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar sua solicitação.', {});
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.getFields = getFields;
const createField = async (body) => {
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        await connection.beginTransaction();
        const [queryResult] = await (0, queries_1.insertInto)(connection, tables_1.Tables.fields, body, []);
        const affectedRows = queryResult.affectedRows;
        await connection.commit();
        return (0, response_1.objectResponse)(200, 'Registro criado com sucesso.', { affectedRows });
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
exports.createField = createField;
const updateField = async (request) => {
    let connection = null;
    const { body, query } = request;
    const { table_id, field_id, company_id } = query;
    try {
        connection = await (0, db_1.dbConn)();
        await connection.beginTransaction();
        const result = await (0, queries_1.update)(connection, tables_1.Tables.fields, { table_id, field_id, company_id }, { label: body.label }, []);
        await connection.commit();
        return (0, response_1.objectResponse)(200, 'Registro atualizado com sucesso.', { affectedRows: result?.affectedRows });
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
exports.updateField = updateField;
const rollBackCatchBlock = async (error, connection) => {
    if (connection)
        await connection.rollback();
    return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
};
const formatedData = (data) => {
    return data.map(row => {
        return {
            table_id: row.table_id,
            field_id: row.field_id,
            company_id: row.company_id,
            corporate_name: row.corporate_name,
            table: resources_1.CONFIGURABLE_RESOURCES_AND_FIELDS.find(table => table.id === row.table_id)?.label,
            field: resources_1.CONFIGURABLE_RESOURCES_AND_FIELDS.find(table => table.id === row.table_id)?.fields.find(fl => fl.id === row.field_id)?.label,
            label: row.label
        };
    });
};
