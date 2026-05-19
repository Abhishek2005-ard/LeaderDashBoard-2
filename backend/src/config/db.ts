import mongoose from 'mongoose';

/**
 * Establishes a connection to MongoDB Atlas or local MongoDB instance.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in the environment variables.');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};

// Monitor mongoose connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[Database] Mongoose connection disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] Mongoose connection error: ${err.message}`);
});

// Handle graceful shutdown of the database connection
const gracefulShutdown = async (signal: string) => {
  try {
    await mongoose.connection.close();
    console.log(`[Database] MongoDB connection closed gracefully via ${signal}`);
    process.exit(0);
  } catch (error) {
    console.error(`[Database] Error closing MongoDB connection: ${(error as Error).message}`);
    process.exit(1);
  }
};

// Handle process termination events
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
