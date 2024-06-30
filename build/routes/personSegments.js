"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const personSegments_1 = require("../services/personSegments");
const validators_1 = require("../middlewares/validators");
const router = (0, express_1.Router)();
router.get('/:personId', validators_1.validatePersonId, async (req, res, next) => {
    const result = await (0, personSegments_1.getPersonSegments)(req);
    return res.status(result.status).json(result);
});
router.post('/', validators_1.validatePostPersonSegments, validators_1.bodyValidationPersonSegments, async (req, res, next) => {
    const result = await (0, personSegments_1.createPersonSegment)(req.body);
    return res.status(result.status).json(result);
});
router.patch('/:id', validators_1.validateId, validators_1.validatePatchPersonSegments, validators_1.bodyValidationPersonSegments, async (req, res, next) => {
    const result = await (0, personSegments_1.updatePersonSegment)(parseInt(req.params.id), req);
    return res.status(result.status).json(result);
});
exports.default = router;
