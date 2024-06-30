"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validators_1 = require("../middlewares/validators");
const fields_1 = require("../services/fields");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    const result = await (0, fields_1.getFields)(req, 1);
    return res.status(result.status).json(result);
});
router.post('/', validators_1.validatePostField, validators_1.bodyValidationField, async (req, res, next) => {
    const result = await (0, fields_1.createField)(req.body);
    return res.status(result.status).json(result);
});
router.patch('/', validators_1.validatePatchField, validators_1.bodyValidationField, async (req, res, next) => {
    const result = await (0, fields_1.updateField)(req);
    return res.status(result.status).json(result);
});
exports.default = router;
