"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customers_1 = require("../services/customers");
const validators_1 = require("../middlewares/validators");
const customerExists_1 = require("../middlewares/customerExists");
const router = (0, express_1.Router)();
router.get('/normal', async (req, res, next) => {
    const result = await (0, customers_1.getNormalCustomers)(req);
    return res.status(result.status).json(result);
});
router.get('/legal', async (req, res, next) => {
    const result = await (0, customers_1.getLegalCustomers)(req);
    return res.status(result.status).json(result);
});
router.get('/normal/select', async (req, res, next) => {
    const result = await (0, customers_1.getNormalById)(req);
    return res.status(result.status).json(result);
});
router.get('/legal/select', async (req, res, next) => {
    const result = await (0, customers_1.getLegalById)(req);
    return res.status(result.status).json(result);
});
router.post('/normal', validators_1.validatePostNormal, validators_1.bodyValidationNormal, customerExists_1.normalExistsByDoc, async (req, res, next) => {
    const result = await (0, customers_1.createNormalPerson)(req.body);
    return res.status(result.status).json(result);
});
router.post('/legal', validators_1.validatePostLegal, validators_1.bodyValidationLegal, customerExists_1.legalExistsByDoc, async (req, res, next) => {
    const result = await (0, customers_1.createLegalPerson)(req.body);
    return res.status(result.status).json(result);
});
router.patch('/legal/patch', validators_1.validatePatchLegal, validators_1.bodyValidationLegal, customerExists_1.legalExistsById, async (req, res, next) => {
    const result = await (0, customers_1.updateLegalPerson)(req);
    return res.status(result.status).json(result);
});
router.patch('/normal/patch', validators_1.validatePatchNormal, validators_1.bodyValidationNormal, customerExists_1.normalExistsById, async (req, res, next) => {
    const result = await (0, customers_1.updateNormalPerson)(req);
    return res.status(result.status).json(result);
});
router.delete('/normal', async (req, res, next) => {
    const result = await (0, customers_1.deleteCustomerRelationalItem)(req);
    return res.status(result.status).json(result);
});
router.delete('/legal', async (req, res, next) => {
    const result = await (0, customers_1.deleteCustomerRelationalItem)(req);
    return res.status(result.status).json(result);
});
exports.default = router;
