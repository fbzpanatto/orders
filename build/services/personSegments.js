"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePersonSegment = exports.createPersonSegment = exports.getPersonSegments = void 0;
const response_1 = require("../utils/response");
const queries_1 = require("../utils/queries");
const tables_1 = require("../enums/tables");
const db_1 = require("./db");
const getPersonSegments = async (req) => {
    const { person_id } = req.query;
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        const result = await (0, queries_1.selectAllWithWhere)(connection, tables_1.Tables.person_segments, { person_id });
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { result });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
};
exports.getPersonSegments = getPersonSegments;
const createPersonSegment = async (body) => {
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        const queryResult = await (0, queries_1.insertInto)(connection, tables_1.Tables.person_segments, body, []);
        return (0, response_1.objectResponse)(200, 'Registro criado com sucesso.', { affectedRows: queryResult.affectedRows });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
};
exports.createPersonSegment = createPersonSegment;
const updatePersonSegment = async (id, req) => {
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        await connection.beginTransaction();
        const queryResult = await (0, queries_1.updateTableSetWhere)(connection, tables_1.Tables.person_segments, 'id', id, req.body, []);
        await connection.commit();
        return (0, response_1.objectResponse)(200, 'Registro atualizado com sucesso.', { affectedRows: queryResult?.affectedRows });
    }
    catch (error) {
        if (connection)
            await connection.rollback();
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
};
exports.updatePersonSegment = updatePersonSegment;
