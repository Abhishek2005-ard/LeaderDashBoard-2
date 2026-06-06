import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from '../utils/appError';
import { AuthRequest, UserRole } from '../types';

/**
 * Generate a JWT token signed with the user's ID and authorization role.
 */
const signToken = (id: string, role: UserRole): string => {
  const secret = process.env.JWT_SECRET || 'dev_leads_jwt_secret_key_antigravity_mern_leads_system';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  return jwt.sign({ id, role }, secret, { expiresIn: expiresIn as any });
};

/**
 * Register a new user account.
 * Endpoint: POST /api/v1/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic validation of request parameters
    if (!name || !email || !password) {
      return next(new AppError('Please provide name, email, and password.', 400));
    }

    if (password.length < 8) {
      return next(new AppError('Password must be at least 8 characters.', 400));
    }

    // 2. Prevent role spoofing if non-permitted roles are sent
    const parsedRole: UserRole = role === 'Admin' ? 'Admin' : 'Sales User';

    // 3. Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email address is already registered.', 400));
    }

    // 4. Create the new user document
    const newUser = await User.create({
      name,
      email,
      password,
      role: parsedRole
    });

    // 5. Generate authorization token
    const token = signToken(newUser._id.toString(), newUser.role);

    // Hide password before returning the response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: userResponse
      }
    });
  } catch (err: any) {
    next(err);
  }
};

/**
 * Log in a user with email and password.
 * Endpoint: POST /api/v1/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password are provided
    if (!email || !password) {
      return next(new AppError('Please provide email and password.', 400));
    }

    // 2. Fetch user and explicitly request the selected-off password field
    const user = await User.findOne({ email }).select('+password');

    // 3. Verify user exists and credentials match
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password.', 401));
    }

    // 4. Generate token
    const token = signToken(user._id.toString(), user.role);

    // Remove password hash from response context
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: userResponse
      }
    });
  } catch (err: any) {
    next(err);
  }
};

/**
 * Fetch profiles of currently authenticated users.
 * Endpoint: GET /api/v1/auth/me
 */
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('You are not authenticated.', 401));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (err: any) {
    next(err);
  }
};
