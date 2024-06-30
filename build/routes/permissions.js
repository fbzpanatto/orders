"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const permissions_1 = require("../services/permissions");
const validators_1 = require("../middlewares/validators");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    const result = await (0, permissions_1.getRoles)(req, 1);
    return res.status(result.status).json(result);
});
router.post('/', validators_1.validatePostPermission, validators_1.bodyValidationPermissions, async (req, res, next) => {
    const result = await (0, permissions_1.createPermission)(req.body);
    return res.status(result.status).json(result);
});
router.patch('/', validators_1.validatePatchPermissions, validators_1.bodyValidationPermissions, async (req, res, next) => {
    const result = await (0, permissions_1.updatePermission)(req);
    return res.status(result.status).json(result);
});
exports.default = router;
