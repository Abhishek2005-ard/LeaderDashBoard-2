import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../utils/appError';
import { AuthRequest, IDecodedToken, UserRole } from '../types';

/**
 * Middleware protecting routes by validating standard JWT tokens in Bearer headers.
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = '';

    // 1. Extract Bearer token from request authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to gain access.', 401));
    }

    // 2. Validate token signature and expiration
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new Error('JWT_SECRET configuration is missing on the server.'));
    }

    const decoded = jwt.verify(token, secret) as IDecodedToken;

    // 3. Check if the user belonging to this token still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this authorization token no longer exists.', 401)
      );
    }

    // 4. Grant access and store currentUser in the customized AuthRequest context
    req.user = currentUser;
    next();
  } catch (err: any) {
    // Let the global centralized error handler resolve JWT errors (expired, invalid signature)
    next(err);
  }
};

/**
 * Middleware restricting route access to specified administration/sales roles.
 * @param roles Restrict access to roles list (e.g. ['Admin'])
 */
export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication context missing.', 401));
    }

    // Check if the user's role is permitted
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }

    next();
  };
};
