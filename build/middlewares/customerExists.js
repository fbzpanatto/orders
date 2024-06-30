"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalExistsById = exports.legalExistsById = exports.normalExistsByDoc = exports.legalExistsByDoc = void 0;
const response_1 = require("../utils/response");
const queries_1 = require("../utils/queries");
const tables_1 = require("../enums/tables");
const db_1 = require("../services/db");
const legalExistsByDoc = async (req, res, next) => {
    let connection = null;
    try {
        connection = await (0, db_1.dbConn)();
        return (await (0, queries_1.selectAllWithWhere)(connection, tables_1.Tables.legal_persons, { cnpj: req.body.customer.cnpj })).length ?
            res.status(409).json((0, response_1.objectResponse)(409, 'Dado duplicado.')) : next();
    }
    catch (error) {
        res.status(400).json((0, response_1.objectResponse)(400, 'Não foi possível processar sua requisição.'));
    }
};
exports.legalExistsByDoc = legalExistsByDoc;
const normalExistsByDoc = async (req, res, next) => {
    let connection = null;
    const { company_id, person_id } = req.query;
    try {
        connection = await (0, db_1.dbConn)();
        return (await (0, queries_1.selectAllWithWhere)(connection, tables_1.Tables.normal_persons, { cpf: req.body.customer.cpf })).length ?
            res.status(409).json((0, response_1.objectResponse)(409, 'Dado duplicado.')) : next();
    }
    catch (error) {
        res.status(400).json((0, response_1.objectResponse)(400, 'Não foi possível processar sua requisição.'));
    }
};
exports.normalExistsByDoc = normalExistsByDoc;
const legalExistsById = async (req, res, next) => {
    let connection = null;
    const { company_id, person_id } = req.query;
    try {
        connection = await (0, db_1.dbConn)();
        return (await (0, queries_1.selectAllWithWhere)(connection, tables_1.Tables.legal_persons, { company_id, person_id })).length ?
            next() : res.status(404).json((0, response_1.objectResponse)(404, 'Registro não encontrado.'));
    }
    catch (error) {
        res.status(400).json((0, response_1.objectResponse)(400, 'Não foi possível processar sua requisição.'));
    }
};
exports.legalExistsById = legalExistsById;
const normalExistsById = async (req, res, next) => {
    let connection = null;
    const { company_id, person_id } = req.query;
    try {
        connection = await (0, db_1.dbConn)();
        return (await (0, queries_1.selectAllWithWhere)(connection, tables_1.Tables.normal_persons, { company_id, person_id })).length ?
            next() : res.status(404).json((0, response_1.objectResponse)(404, 'Registro não encontrado.'));
    }
    catch (error) {
        res.status(400).json((0, response_1.objectResponse)(400, 'Não foi possível processar sua requisição.'));
    }
};
exports.normalExistsById = normalExistsById;
