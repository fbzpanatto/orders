"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validators_1 = require("../middlewares/validators");
const users_1 = require("../services/users");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    const result = await (0, users_1.getUsers)(req, 1);
    return res.status(result.status).json(result);
});
router.post('/', validators_1.validatePostUser, validators_1.bodyValidationUser, async (req, res, next) => {
    const result = await (0, users_1.createUser)(req.body);
    return res.status(result.status).json(result);
});
router.patch('/', validators_1.validatePatchUser, validators_1.bodyValidationUser, async (req, res, next) => {
    const result = await (0, users_1.updateUser)(req);
    return res.status(result.status).json(result);
});
exports.default = router;
