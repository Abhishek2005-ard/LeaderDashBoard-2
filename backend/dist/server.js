"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Handle uncaught exceptions globally before any execution
process.on('uncaughtException', (err) => {
    console.error('[CRITICAL] UNCAUGHT EXCEPTION! Shutting down server...');
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});
// Configure Dotenv environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const port = process.env.PORT || 5000;
// Connect to MongoDB
(0, db_1.connectDB)();
// Bind and Listen to HTTP Port
const server = app_1.default.listen(port, () => {
    console.log(`[Server] Smart Leads API running in [${process.env.NODE_ENV}] mode on port ${port}`);
});
// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
    console.error('[CRITICAL] UNHANDLED REJECTION! Shutting down gracefully...');
    console.error(err.name, err.message, err.stack);
    server.close(() => {
        process.exit(1);
    });
});
