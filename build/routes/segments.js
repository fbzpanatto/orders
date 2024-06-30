"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validators_1 = require("../middlewares/validators");
const segments_1 = require("../services/segments");
const router = (0, express_1.Router)();
router.get('/', async (req, res, next) => {
    const result = await (0, segments_1.getSegments)(req);
    return res.status(result.status).json(result);
});
router.post('/', validators_1.validatePostSegments, validators_1.bodyValidationSegment, async (req, res, next) => {
    const result = await (0, segments_1.createSegment)(req);
    return res.status(result.status).json(result);
});
router.patch('/', validators_1.validatePatchSegments, validators_1.bodyValidationSegment, async (req, res, next) => {
    const result = await (0, segments_1.updateSegment)(req);
    return res.status(result.status).json(result);
});
exports.default = router;
