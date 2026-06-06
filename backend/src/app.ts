import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { AppError } from './utils/appError';
import { globalErrorHandler } from './middlewares/errorMiddleware';

import authRouter from './routes/authRoutes';
import leadRouter from './routes/leadRoutes';

const app: Application = express();

// 1. GLOBAL SECURITY MIDDLEWARES

// Secure HTTP Headers
app.use(helmet());

// Dynamic CORS enabling cross-origin cookie credentials
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim().replace(/\/$/, '')) 
  : [
      "https://leader-dash-board-2.vercel.app",
      "https://my-frontend.vercel.app",
      "http://localhost:5173"
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
      const isVercel = origin.endsWith('.vercel.app');
      
      if (allowedOrigins.includes(origin) || (process.env.NODE_ENV === 'development' && isLocalhost) || isVercel) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Request Logging in Development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, parsing application/json with size limit to prevent Denial of Service (DoS)
app.use(express.json({ limit: '10kb' }));

// 2. ROOT & HEALTH CHECK ROUTES

/**
 * Root endpoint - simple health check
 */
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running'
  });
});

/**
 * Health check endpoint - exposes API operational status and MongoDB connection status.
 */
app.get('/api/health', (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';
  res.status(200).json({
    status: 'success',
    timestamp: new Date().toISOString(),
    service: 'smart-leads-api',
    databaseStatus: dbStatus,
    uptime: process.uptime()
  });
});

// Route Registration
app.use('/api/auth', authRouter);
app.use('/api/leads', leadRouter);

// 3. UNHANDLED ROUTE MIDDLEWARE
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4. CENTRALIZED ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;
