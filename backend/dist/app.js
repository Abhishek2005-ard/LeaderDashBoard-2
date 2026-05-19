"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = require("./utils/appError");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const app = (0, express_1.default)();
// 1. GLOBAL SECURITY MIDDLEWARES
// Secure HTTP Headers
app.use((0, helmet_1.default)());
// Dynamic CORS enabling cross-origin cookie credentials
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Request Logging in Development
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Body parser, parsing application/json with size limit to prevent Denial of Service (DoS)
app.use(express_1.default.json({ limit: '10kb' }));
// 2. ROOT & HEALTH CHECK ROUTES
/**
 * Health check endpoint - exposes API operational status and MongoDB connection status.
 */
app.get('/api/v1/health', (req, res) => {
    const dbStatus = mongoose_1.default.connection.readyState === 1 ? 'healthy' : 'unhealthy';
    res.status(200).json({
        status: 'success',
        timestamp: new Date().toISOString(),
        service: 'smart-leads-api',
        databaseStatus: dbStatus,
        uptime: process.uptime()
    });
});
// Route Registration
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/leads', leadRoutes_1.default);
// 3. UNHANDLED ROUTE MIDDLEWARE
app.all('*', (req, res, next) => {
    next(new appError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// 4. CENTRALIZED ERROR HANDLING MIDDLEWARE
app.use(errorMiddleware_1.globalErrorHandler);
exports.default = app;
