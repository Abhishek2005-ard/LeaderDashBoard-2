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

const preferredPort = parseInt(process.env.PORT || '5000', 10);

// Connect to MongoDB
connectDB();

const startServer = (portNum: number) => {
  const server = app.listen(portNum);

  server.on('listening', () => {
    console.log(`[Server] Smart Leads API running in [${process.env.NODE_ENV}] mode on port ${portNum}`);
    
    // Handle unhandled promise rejections globally
    process.on('unhandledRejection', (err: any) => {
      console.error('[CRITICAL] UNHANDLED REJECTION! Shutting down gracefully...');
      console.error(err.name, err.message, err.stack);
      server.close(() => {
        process.exit(1);
      });
    });
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Server] Port ${portNum} is already in use. Retrying on port ${portNum + 1}...`);
      startServer(portNum + 1);
    } else {
      console.error('[Server] Critical server error:', err);
      process.exit(1);
    }
  });
};

startServer(preferredPort);
