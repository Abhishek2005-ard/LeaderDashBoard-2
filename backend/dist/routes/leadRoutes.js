"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leadController_1 = require("../controllers/leadController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const router = (0, express_1.Router)();
// Protect all lead routes
router.use(authMiddleware_1.protect);
router
    .route('/')
    .get(leadController_1.getLeads)
    .post(validationMiddleware_1.validateLead, leadController_1.createLead);
router.get('/export', leadController_1.exportLeads);
router
    .route('/:id')
    .get(leadController_1.getLead)
    .patch(validationMiddleware_1.validateLead, leadController_1.updateLead)
    .delete((0, authMiddleware_1.restrictTo)('Admin'), leadController_1.deleteLead);
exports.default = router;
