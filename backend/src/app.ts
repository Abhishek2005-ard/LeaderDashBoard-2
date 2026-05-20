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
  ? process.env.CLIENT_URL.split(',') 
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
    status: 'success',
    message: 'Welcome to the Smart Leads API. API is running on /api/v1'
  });
});

/**
 * Health check endpoint - exposes API operational status and MongoDB connection status.
 */
app.get('/api/v1/health', (req: Request, res: Response) => {
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
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/leads', leadRouter);

// 3. UNHANDLED ROUTE MIDDLEWARE
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4. CENTRALIZED ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;
