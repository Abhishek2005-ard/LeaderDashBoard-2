"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const router = (0, express_1.Router)();
/**
 * Public Authentication Routes
 */
router.post('/register', validationMiddleware_1.validateRegister, authController_1.register);
router.post('/login', validationMiddleware_1.validateLogin, authController_1.login);
/**
 * Protected Authentication Routes
 */
router.get('/me', authMiddleware_1.protect, authController_1.getMe);
exports.default = router;
