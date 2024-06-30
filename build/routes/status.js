"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validators_1 = require("../middlewares/validators");
const status_1 = require("../services/status");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const result = await (0, status_1.getStatus)(req);
    return res.status(result.status).json(result);
});
router.post('/', validators_1.validatePostStatus, validators_1.bodyValidationStatus, async (req, res) => {
    const result = await (0, status_1.createStatus)(req);
    return res.status(result.status).json(result);
});
router.patch('/', validators_1.validatePatchStatus, validators_1.bodyValidationStatus, async (req, res) => {
    const result = await (0, status_1.updateStatus)(req);
    return res.status(result.status).json(result);
});
exports.default = router;
