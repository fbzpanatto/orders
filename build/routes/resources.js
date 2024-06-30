"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resources_1 = require("../services/resources");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    const result = await (0, resources_1.getResources)();
    return res.status(result.status).json(result);
});
exports.default = router;
