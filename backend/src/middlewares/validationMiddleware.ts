import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

/**
 * Validation schema rule helpers
 */
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

/**
 * Validator middleware checking inputs during user registration.
 */
export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, password, role } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(new AppError('Please provide a valid name (at least 2 characters).', 400));
  }

  if (!email || !emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return next(new AppError('Password must be a string and contain at least 8 characters.', 400));
  }

  if (role && !['Admin', 'Sales User'].includes(role)) {
    return next(new AppError('Invalid user role specified. Must be Admin or Sales User.', 400));
  }

  next();
};

/**
 * Validator middleware checking inputs during credentials login.
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || !emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    return next(new AppError('Please provide a valid password.', 400));
  }

  next();
};

/**
 * Validator middleware checking inputs during Lead creation and updates.
 */
export const validateLead = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, status, source } = req.body;

  // On POST (creation), name, email, and source are required
  const isPost = req.method === 'POST';

  if (isPost || name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return next(new AppError('Please provide a valid lead name.', 400));
    }
  }

  if (isPost || email !== undefined) {
    if (!email || !emailRegex.test(email)) {
      return next(new AppError('Please provide a valid lead email address.', 400));
    }
  }

  if (status !== undefined) {
    if (!['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      return next(new AppError('Invalid lead status. Must be New, Contacted, Qualified, or Lost.', 400));
    }
  }

  if (isPost || source !== undefined) {
    if (!['Website', 'Instagram', 'Referral'].includes(source)) {
      return next(new AppError('Invalid lead source. Must be Website, Instagram, or Referral.', 400));
    }
  }

  next();
};
