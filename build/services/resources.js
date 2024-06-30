"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResources = void 0;
const response_1 = require("../utils/response");
const resources_1 = require("../enums/resources");
const getResources = async () => {
    try {
        return (0, response_1.objectResponse)(200, 'Consulta realizada com sucesso.', { data: resources_1.CONFIGURABLE_RESOURCES_AND_FIELDS, meta: 1 });
    }
    catch (error) {
        return (0, response_1.objectResponse)(400, 'Não foi possível processar sua solicitação.', {});
    }
};
exports.getResources = getResources;
