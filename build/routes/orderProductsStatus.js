"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderProductStatus_1 = require("../services/orderProductStatus");
const validators_1 = require("../middlewares/validators");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    const result = await (0, orderProductStatus_1.getAllOrderProductsStatus)(1);
    return res.status(result.status).json(result);
});
router.get('/:id', validators_1.validateId, async (req, res, next) => {
    const result = await (0, orderProductStatus_1.getOrderProductsStatus)(req);
    return res.status(result.status).json(result);
});
router.post('/', validators_1.validatePostOrderProductStatus, validators_1.bodyValidationOrderProductStatus, async (req, res, next) => {
    const result = await (0, orderProductStatus_1.createOrderProductsStatus)(req.body);
    return res.status(result.status).json(result);
});
router.patch('/:id', validators_1.validateId, validators_1.validatePatchOrderProductStatus, validators_1.bodyValidationOrderProductStatus, async (req, res, next) => {
    const result = await (0, orderProductStatus_1.updateOrderProductsStatus)(parseInt(req.params.id), req);
    return res.status(result.status).json(result);
});
exports.default = router;
