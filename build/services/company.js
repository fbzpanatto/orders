"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompany = exports.createCompany = exports.getCompanyById = exports.getCompanies = void 0;
const response_1 = require("../utils/response");
const queries_1 = require("../utils/queries");
const tables_1 = require("../enums/tables");
const helper_1 = require("../helper");
const db_1 = require("./db");
const mysql2_1 = require("mysql2");
const getCompanies = async (page, request) => {
    const { roles, status } = request.query;
    let connection = null;
    let extra = null;
    try {
        connection = await (0, db_1.dbConn)();
        if (status) {
            const baseTable = 'companies';
            const baseAlias = 'c';
            const selectFields = ['c.company_id', 'c.corporate_name', 's.company_id AS statusCompanyId', 's.status_id', 's.name'];
            const whereConditions = {};
            const joins = [{ table: tables_1.Tables.status, alias: 's', conditions: [{ column1: 'c.company_id', column2: 's.company_id' }] }];
            const queryResult = await (0, queries_1.selectJoinsWhere)(connection, baseTable, baseAlias, selectFields, whereConditions, joins);
            return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data: companyStatus(queryResult) });
        }
        if (roles) {
            const baseTable = 'companies';
            const baseAlias = 'c';
            const selectFields = ['c.company_id', 'c.corporate_name', 'r.role_id', 'r.role_name'];
            const whereConditions = {};
            const joins = [{ table: 'roles', alias: 'r', conditions: [{ column1: 'c.company_id', column2: 'r.company_id' }] }];
            const queryResult = await (0, queries_1.selectJoinsWhere)(connection, baseTable, baseAlias, selectFields, whereConditions, joins);
            return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data: companyRoles(queryResult) });
        }
        const companies = (0, helper_1.emptyOrRows)(await (0, queries_1.selectAllFrom)(connection, tables_1.Tables.companies, page));
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data: companies, meta: { page, extra } });
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
exports.getCompanies = getCompanies;
const getCompanyById = async (companyId) => {
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        const company_id = 'company_id';
        const queryString = `
    SELECT c.*, a.*
    FROM ${tables_1.Tables.companies} AS c
    LEFT JOIN ${tables_1.Tables.company_address} AS a ON c.${company_id} = a.${company_id}
    WHERE c.${company_id}=?
    `;
        const [result] = await connection.query((0, mysql2_1.format)(queryString, [companyId]));
        const castResult = result[0];
        const formatedResult = {
            company: {
                company_id: castResult.company_id,
                active: castResult.active,
                cnpj: castResult.cnpj,
                corporate_name: castResult.corporate_name,
                social_name: castResult.social_name,
                state_registration: castResult.state_registration
            },
            address: {
                company_id: castResult.company_id,
                add_city: castResult.add_city,
                add_neighborhood: castResult.add_neighborhood,
                add_number: castResult.add_number,
                add_street: castResult.add_street,
                add_uf: castResult.add_uf,
                add_zipcode: castResult.add_zipcode
            }
        };
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data: formatedResult });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
    }
    finally {
        if (connection) {
            connection.release();
        }
    }
};
exports.getCompanyById = getCompanyById;
const createCompany = async (body) => {
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        await connection.beginTransaction();
        const [queryResult] = await (0, queries_1.insertInto)(connection, tables_1.Tables.companies, { ...body.company }, []);
        const companyId = queryResult.insertId;
        await (0, queries_1.insertInto)(connection, tables_1.Tables.company_address, { ...body.address, company_id: companyId }, []);
        await connection.commit();
        return (0, response_1.objectResponse)(200, 'Registro criado com sucesso.', { affectedRows: 2 });
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
exports.createCompany = createCompany;
const updateCompany = async (company_id, body) => {
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        await connection.beginTransaction();
        await Promise.all([
            await (0, queries_1.updateTableSetWhere)(connection, tables_1.Tables.companies, 'company_id', company_id, body.company, []),
            await (0, queries_1.updateTableSetWhere)(connection, tables_1.Tables.company_address, 'company_id', company_id, body.address, []),
        ]);
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
exports.updateCompany = updateCompany;
const rollBackCatchBlock = async (error, connection) => {
    if (connection)
        await connection.rollback();
    return (0, response_1.objectResponse)(400, 'Não foi possível processar a sua solicitação.');
};
const companyRoles = (arr) => {
    return arr.reduce((acc, curr) => {
        if (!acc.find(el => el.company_id === curr.company_id)) {
            acc.push({ company_id: curr.company_id, corporate_name: curr.corporate_name, roles: [] });
        }
        acc.find(el => el.company_id === curr.company_id)?.roles.push({ role_id: curr.role_id, role_name: curr.role_name });
        return acc;
    }, []);
};
const companyStatus = (queryResult) => {
    return queryResult.reduce((acc, curr) => {
        if (!acc.find((el) => el.company_id === curr.company_id)) {
            acc.push({ company_id: curr.company_id, corporate_name: curr.corporate_name, productStatus: [] });
        }
        acc.find((el) => el.company_id === curr.company_id)?.productStatus.push({ company_id: curr.company_id, status_id: curr.status_id, name: curr.name });
        return acc;
    }, []);
};
