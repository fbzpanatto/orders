"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validators_1 = require("../middlewares/validators");
const company_1 = require("../services/company");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    const result = await (0, company_1.getCompanies)(1, req);
    return res.status(result.status).json(result);
});
router.get('/:id', validators_1.validateId, async (req, res, next) => {
    const result = await (0, company_1.getCompanyById)(parseInt(req.params.id));
    return res.status(result.status).json(result);
});
router.post('/', validators_1.validatePostCompany, validators_1.bodyValidationCompany, async (req, res, next) => {
    const result = await (0, company_1.createCompany)(req.body);
    return res.status(result.status).json(result);
});
router.patch('/:id', validators_1.validateId, validators_1.validatePatchCompany, validators_1.bodyValidationCompany, async (req, res, next) => {
    const result = await (0, company_1.updateCompany)(parseInt(req.params.id), req.body);
    return res.status(result.status).json(result);
});
exports.default = router;
