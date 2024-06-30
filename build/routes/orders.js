"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = require("../services/orders");
const validators_1 = require("../middlewares/validators");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    const result = await (0, orders_1.getAllOrders)(1);
    return res.status(result.status).json(result);
});
router.get('/:id', validators_1.validateId, async (req, res, next) => {
    const result = await (0, orders_1.getOrder)(req);
    return res.status(result.status).json(result);
});
router.get('/person/:id', validators_1.validateId, async (req, res, next) => {
    const result = await (0, orders_1.getPersonOrders)(req);
    return res.status(result.status).json(result);
});
router.post('/', validators_1.validatePostOrders, validators_1.bodyValidationOrders, async (req, res, next) => {
    const result = await (0, orders_1.createOrder)(req.body);
    return res.status(result.status).json(result);
});
router.patch('/:id', validators_1.validateId, validators_1.validatePatchOrders, validators_1.bodyValidationOrders, async (req, res, next) => {
    const result = await (0, orders_1.updateOrder)(parseInt(req.params.id), req);
    return res.status(result.status).json(result);
});
exports.default = router;
