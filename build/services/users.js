"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.createUser = exports.getUsers = void 0;
const response_1 = require("../utils/response");
const queries_1 = require("../utils/queries");
const tables_1 = require("../enums/tables");
const helper_1 = require("../helper");
const db_1 = require("./db");
const USER_ID = 'user_id';
const COMPANY_ID = 'company_id';
const MAX_USER_ID = 'max_user_id';
const getUsers = async (request, page) => {
    const { company_id, user_id, roles } = request.query;
    let conn = null;
    let companyRoles = null;
    const baseTable = 'users';
    const baseAlias = 'u';
    const joins = [
        {
            table: 'roles',
            alias: 'r',
            conditions: [
                { column1: 'u.company_id', column2: 'r.company_id' },
                { column1: 'u.role_id', column2: 'r.role_id' }
            ]
        },
        {
            table: 'companies',
            alias: 'c',
            conditions: [
                { column1: 'c.company_id', column2: 'r.company_id' }
            ]
        }
    ];
    try {
        conn = await (0, db_1.dbConn)();
        if (roles) {
            const selectFields = ['c.company_id', 'c.corporate_name', 'r.role_id', 'r.role_name'];
            const whereConditions = {};
            const joins = [{ table: 'roles', alias: 'r', conditions: [{ column1: 'c.company_id', column2: 'r.company_id' }] }];
            const queryResult = await (0, queries_1.selectJoinsWhere)(conn, tables_1.Tables.companies, 'c', selectFields, whereConditions, joins);
            companyRoles = companyRolesFn(queryResult);
        }
        if (company_id && user_id) {
            const selectFields = ['u.user_id', 'u.name', 'u.username', 'u.password', 'u.active', 'r.role_id', 'c.company_id'];
            const whereConditions = { company_id, user_id };
            const result = (await (0, queries_1.selectJoinsWhere)(conn, baseTable, baseAlias, selectFields, whereConditions, joins))[0];
            return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data: result, meta: { companyRoles } });
        }
        const selectFields = ['u.user_id', 'u.name', 'u.username', 'u.active', 'u.created_at', 'r.role_id, r.role_name', 'c.company_id', 'c.corporate_name'];
        const whereConditions = {};
        const result = await (0, queries_1.selectJoinsWhere)(conn, baseTable, baseAlias, selectFields, whereConditions, joins);
        const data = (0, helper_1.emptyOrRows)(result);
        const meta = { page };
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data, meta });
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
exports.getUsers = getUsers;
const createUser = async (body) => {
    let conn = null;
    try {
        conn = await (0, db_1.dbConn)();
        await conn.beginTransaction();
        const newUserId = await (0, queries_1.selectMaxColumn)(conn, tables_1.Tables.users, USER_ID, MAX_USER_ID, COMPANY_ID, body.company_id);
        const [queryResult] = await (0, queries_1.insertInto)(conn, tables_1.Tables.users, { ...body, user_id: newUserId }, []);
        const affectedRows = queryResult.affectedRows;
        await conn.commit();
        return (0, response_1.objectResponse)(200, 'Registro criado com sucesso.', { affectedRows });
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
exports.createUser = createUser;
const updateUser = async (request) => {
    const { body, query } = request;
    const { user_id, company_id } = query;
    let conn = null;
    try {
        conn = await (0, db_1.dbConn)();
        await conn.beginTransaction();
        const result = await (0, queries_1.update)(conn, tables_1.Tables.users, { user_id, company_id }, body, []);
        await conn.commit();
        return (0, response_1.objectResponse)(200, 'Registro atualizado com sucesso.', { affectedRows: result?.affectedRows });
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
exports.updateUser = updateUser;
const rollBackCatchBlock = async (error, connection) => {
    console.log(error);
    if (connection)
        await connection.rollback();
    return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
};
const companyRolesFn = (arr) => {
    return arr.reduce((acc, curr) => {
        if (!acc.find(el => el.company_id === curr.company_id)) {
            acc.push({ company_id: curr.company_id, corporate_name: curr.corporate_name, roles: [] });
        }
        acc.find(el => el.company_id === curr.company_id)?.roles.push({ role_id: curr.role_id, role_name: curr.role_name });
        return acc;
    }, []);
};
