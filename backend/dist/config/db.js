"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Establishes a connection to MongoDB Atlas or local MongoDB instance.
 */
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in the environment variables.');
        }
        const conn = await mongoose_1.default.connect(mongoURI);
        console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`[Database] Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// Monitor mongoose connection events
mongoose_1.default.connection.on('disconnected', () => {
    console.warn('[Database] Mongoose connection disconnected.');
});
mongoose_1.default.connection.on('error', (err) => {
    console.error(`[Database] Mongoose connection error: ${err.message}`);
});
// Handle graceful shutdown of the database connection
const gracefulShutdown = async (signal) => {
    try {
        await mongoose_1.default.connection.close();
        console.log(`[Database] MongoDB connection closed gracefully via ${signal}`);
        process.exit(0);
    }
    catch (error) {
        console.error(`[Database] Error closing MongoDB connection: ${error.message}`);
        process.exit(1);
    }
};
// Handle process termination events
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
