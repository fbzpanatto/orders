"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validators_1 = require("../middlewares/validators");
const products_1 = require("../services/products");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    const result = await (0, products_1.getProducts)(1);
    return res.status(result.status).json(result);
});
router.get('/:id', validators_1.validateId, async (req, res, next) => {
    const result = await (0, products_1.getProduct)(req);
    return res.status(result.status).json(result);
});
router.post('/', validators_1.validatePostProducts, validators_1.bodyValidationProducts, async (req, res, next) => {
    const result = await (0, products_1.createProduct)(req.body);
    return res.status(result.status).json(result);
});
router.patch('/:id', validators_1.validateId, validators_1.validatePatchProducts, validators_1.bodyValidationProducts, async (req, res, next) => {
    const result = await (0, products_1.updateProduct)(parseInt(req.params.id), req);
    return res.status(result.status).json(result);
});
exports.default = router;
