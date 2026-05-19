"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const appError_1 = require("../utils/appError");
/**
 * Middleware protecting routes by validating standard JWT tokens in Bearer headers.
 */
const protect = async (req, res, next) => {
    try {
        let token = '';
        // 1. Extract Bearer token from request authorization header
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new appError_1.AppError('You are not logged in! Please log in to gain access.', 401));
        }
        // 2. Validate token signature and expiration
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return next(new Error('JWT_SECRET configuration is missing on the server.'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // 3. Check if the user belonging to this token still exists
        const currentUser = await User_1.User.findById(decoded.id);
        if (!currentUser) {
            return next(new appError_1.AppError('The user belonging to this authorization token no longer exists.', 401));
        }
        // 4. Grant access and store currentUser in the customized AuthRequest context
        req.user = currentUser;
        next();
    }
    catch (err) {
        // Let the global centralized error handler resolve JWT errors (expired, invalid signature)
        next(err);
    }
};
exports.protect = protect;
/**
 * Middleware restricting route access to specified administration/sales roles.
 * @param roles Restrict access to roles list (e.g. ['Admin'])
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new appError_1.AppError('Authentication context missing.', 401));
        }
        // Check if the user's role is permitted
        if (!roles.includes(req.user.role)) {
            return next(new appError_1.AppError('You do not have permission to perform this action.', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
