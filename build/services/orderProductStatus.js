"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderProductsStatus = exports.createOrderProductsStatus = exports.getOrderProductsStatus = exports.getAllOrderProductsStatus = void 0;
const response_1 = require("../utils/response");
const queries_1 = require("../utils/queries");
const tables_1 = require("../enums/tables");
const helper_1 = require("../helper");
const db_1 = require("./db");
const getAllOrderProductsStatus = async (page) => {
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        const rows = await (0, queries_1.selectAllFrom)(connection, tables_1.Tables.order_products_status, page);
        const data = (0, helper_1.emptyOrRows)(rows);
        const meta = { page };
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data, meta });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
};
exports.getAllOrderProductsStatus = getAllOrderProductsStatus;
const getOrderProductsStatus = async (req) => {
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        const queryResult = await (0, queries_1.selectAllWithWhere)(connection, tables_1.Tables.order_products_status, {});
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data: queryResult });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
};
exports.getOrderProductsStatus = getOrderProductsStatus;
const createOrderProductsStatus = async (body) => {
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        const queryResult = await (0, queries_1.insertInto)(connection, tables_1.Tables.order_products_status, body, []);
        return (0, response_1.objectResponse)(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
};
exports.createOrderProductsStatus = createOrderProductsStatus;
const updateOrderProductsStatus = async (id, req) => {
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        await connection.beginTransaction();
        const queryResult = await (0, queries_1.updateTableSetWhere)(connection, tables_1.Tables.order_products_status, 'id', id, req.body, ['person_id']);
        await connection.commit();
        return (0, response_1.objectResponse)(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
    }
    catch (error) {
        if (connection)
            await connection.rollback();
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
};
exports.updateOrderProductsStatus = updateOrderProductsStatus;
