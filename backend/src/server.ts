import dotenv from 'dotenv';
import path from 'path';

// Handle uncaught exceptions globally before any execution
process.on('uncaughtException', (err: Error) => {
  console.error('[CRITICAL] UNCAUGHT EXCEPTION! Shutting down server...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Configure Dotenv environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import { connectDB } from './config/db';

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Bind and Listen to HTTP Port
const server = app.listen(port, () => {
  console.log(`[Server] Smart Leads API running in [${process.env.NODE_ENV}] mode on port ${port}`);
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err: any) => {
  console.error('[CRITICAL] UNHANDLED REJECTION! Shutting down gracefully...');
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
