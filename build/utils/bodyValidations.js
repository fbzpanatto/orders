"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unexpectedFieldsFn = exports.invalidValues = void 0;
const response_1 = require("../utils/response");
const invalidValues = (res, req) => {
    return res.status(400).json((0, response_1.objectResponse)(400, 'Valor(es) inválido(s) no corpo da requisição.'));
};
exports.invalidValues = invalidValues;
const unexpectedFieldsFn = (req, res, next, schema) => {
    const unexpectedFields = Object.keys(req.body).filter(key => !schema.hasOwnProperty(key));
    return unexpectedFields.length ? res.status(400).json((0, response_1.objectResponse)(400, 'Campo(s) inesperado(s) no corpo da requisição.')) : next();
};
exports.unexpectedFieldsFn = unexpectedFieldsFn;
