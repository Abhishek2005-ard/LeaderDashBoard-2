"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const appError_1 = require("../utils/appError");
/**
 * Handle Mongoose invalid database ID (CastError)
 */
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.AppError(message, 400);
};
/**
 * Handle Mongoose duplicate database fields
 */
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)?.[0] || 'Duplicate value';
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new appError_1.AppError(message, 400);
};
/**
 * Handle Mongoose validation errors
 */
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data: ${errors.join(' ')}`;
    return new appError_1.AppError(message, 400);
};
/**
 * Handle JWT Signature Error
 */
const handleJWTError = () => new appError_1.AppError('Invalid token. Please log in again!', 401);
/**
 * Handle JWT Token Expired Error
 */
const handleJWTExpiredError = () => new appError_1.AppError('Your token has expired! Please log in again.', 401);
/**
 * Send full error details in development environment
 */
const sendErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        error: err,
        message: err.message,
        stack: err.stack
    });
};
/**
 * Send parsed client-safe error details in production environment
 */
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    else {
        // Programming or other unknown error: don't leak leak server details to the client
        console.error('[CRITICAL SYSTEM ERROR]', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong on our servers. Please try again later.'
        });
    }
};
/**
 * Centralized Global Error Handler Middleware
 */
const globalErrorHandler = (err, req, res, next) => {
    let error = Object.create(err);
    error.message = err.message;
    error.stack = err.stack;
    // Normalize known database & security operational errors
    if (error.name === 'CastError')
        error = handleCastErrorDB(error);
    if (error.code === 11000)
        error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
        error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
        error = handleJWTError();
    if (error.name === 'TokenExpiredError')
        error = handleJWTExpiredError();
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    }
    else {
        sendErrorProd(error, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
