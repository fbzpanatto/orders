"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePermission = exports.createPermission = exports.getRoles = void 0;
const response_1 = require("../utils/response");
const queries_1 = require("../utils/queries");
const tables_1 = require("../enums/tables");
const helper_1 = require("../helper");
const db_1 = require("./db");
const resources_1 = require("../enums/resources");
const ROLE_ID = 'role_id';
const COMPANY_ID = 'company_id';
const MAX_ROLE_ID = 'max_role_id';
const PERMISSION_ID = 'permission_id';
const MAX_PERMISSION_ID = 'max_permission_id';
const getRoles = async (request, page) => {
    let connection = null;
    const { role_id, company_id } = request.query;
    try {
        connection = await (0, db_1.dbConn)();
        const baseTable = 'roles';
        const baseAlias = 'r';
        if (role_id && company_id) {
            const selectFields = ['r.*', 'p.*', 'c.company_id'];
            const whereConditions = { role_id, company_id };
            const joins = [
                { table: 'permissions', alias: 'p', conditions: [{ column1: 'r.role_id', column2: 'p.role_id' }, { column1: 'r.company_id', column2: 'p.company_id' }] },
                { table: 'companies', alias: 'c', conditions: [{ column1: 'r.company_id', column2: 'c.company_id' }] }
            ];
            const queryResult = await (0, queries_1.selectJoinsWhere)(connection, baseTable, baseAlias, selectFields, whereConditions, joins);
            return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data: reduceData(queryResult) });
        }
        const selectFields = ['r.*', 'c.*'];
        // TODO: const whereConditions = { company_id: 2 }
        const whereConditions = {};
        const joins = [{ table: 'companies', alias: 'c', conditions: [{ column1: 'r.company_id', column2: 'c.company_id' }] }];
        const result = await (0, queries_1.selectJoinsWhere)(connection, baseTable, baseAlias, selectFields, whereConditions, joins);
        const data = (0, helper_1.emptyOrRows)(result);
        const meta = { page };
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data, meta });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar sua solicitação.', {});
    }
    finally {
        if (connection) {
            connection.release();
        }
    }
};
exports.getRoles = getRoles;
const createPermission = async (body) => {
    let conn = null;
    try {
        conn = await (0, db_1.dbConn)();
        await conn.beginTransaction();
        const newRoleId = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.roles, ROLE_ID, MAX_ROLE_ID, COMPANY_ID, body.company?.company_id);
        await (0, queries_1.insertInto)(conn, tables_1.Tables.roles, { ...body.role, role_id: newRoleId, company_id: body.company?.company_id }, []);
        const startingPermissionId = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.permissions, PERMISSION_ID, MAX_PERMISSION_ID, COMPANY_ID, body.company?.company_id);
        const permissionsBody = createPermissions(body, body.company?.company_id, newRoleId, startingPermissionId);
        await (0, queries_1.duplicateKeyUpdate)(conn, tables_1.Tables.permissions, permissionsBody, ROLE_ID, newRoleId);
        await conn.commit();
        return (0, response_1.objectResponse)(200, 'Registro criado com sucesso.', { affectedRows: 2 });
    }
    catch (error) {
        return rollback(error, conn);
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.createPermission = createPermission;
const updatePermission = async (request) => {
    const { body, query } = request;
    const { role_id, company_id } = query;
    let conn = null;
    try {
        conn = await (0, db_1.dbConn)();
        await conn.beginTransaction();
        await Promise.all([
            await (0, queries_1.update)(conn, tables_1.Tables.roles, { role_id, company_id }, body.role, []),
            await (0, queries_1.duplicateKey)(conn, tables_1.Tables.permissions, formatPermissions(body))
        ]);
        await conn.commit();
        return (0, response_1.objectResponse)(200, 'Registro criado com sucesso.', { affectedRows: 2 });
    }
    catch (error) {
        return rollback(error, conn);
    }
    finally {
        if (conn) {
            conn.release();
        }
    }
};
exports.updatePermission = updatePermission;
const reduceData = (queryResult) => {
    return queryResult.reduce((acc, curr) => {
        if (!acc.role) {
            acc = { role: { role_id: curr.role_id, role_name: curr.role_name, company_id: curr.company_id } };
        }
        const resource = resources_1.RESOURCES_ID_TO_NAME[curr.table_id];
        if (!acc[resource]) {
            acc[resource] = { permission_id: curr.permission_id, role_id: curr.role_id, company_id: curr.company_id, canCreate: curr.canCreate, canRead: curr.canRead, canUpdate: curr.canUpdate };
        }
        return acc;
    }, {});
};
const createPermissions = (body, companyId, roleId, counterId) => {
    return Object.keys(body)
        .filter(key => key != 'role' && key != 'company')
        .map((key, index) => {
        if (index != 0) {
            counterId += 1;
        }
        return { ...body[key], table_id: resources_1.RESOURCES_NAME_TO_ID[key], company_id: companyId, permission_id: counterId, role_id: roleId };
    });
};
const formatPermissions = (body) => {
    return Object.keys(body)
        .filter(key => key != 'role' && key != 'company')
        .map((key) => { return { ...body[key], table_id: resources_1.RESOURCES_NAME_TO_ID[key] }; });
};
const rollback = async (error, connection) => {
    if (connection)
        await connection.rollback();
    return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
};
