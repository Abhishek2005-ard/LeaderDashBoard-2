"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const appError_1 = require("../utils/appError");
/**
 * Generate a JWT token signed with the user's ID and authorization role.
 */
const signToken = (id, role) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    if (!secret) {
        throw new Error('JWT_SECRET is missing from the environment configuration.');
    }
    return jsonwebtoken_1.default.sign({ id, role }, secret, { expiresIn: expiresIn });
};
/**
 * Register a new user account.
 * Endpoint: POST /api/v1/auth/register
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        // 1. Basic validation of request parameters
        if (!name || !email || !password) {
            return next(new appError_1.AppError('Please provide name, email, and password.', 400));
        }
        if (password.length < 8) {
            return next(new appError_1.AppError('Password must be at least 8 characters.', 400));
        }
        // 2. Prevent role spoofing if non-permitted roles are sent
        const parsedRole = role === 'Admin' ? 'Admin' : 'Sales User';
        // 3. Check if email is already in use
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return next(new appError_1.AppError('Email address is already registered.', 400));
        }
        // 4. Create the new user document
        const newUser = await User_1.User.create({
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
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
/**
 * Log in a user with email and password.
 * Endpoint: POST /api/v1/auth/login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // 1. Check if email and password are provided
        if (!email || !password) {
            return next(new appError_1.AppError('Please provide email and password.', 400));
        }
        // 2. Fetch user and explicitly request the selected-off password field
        const user = await User_1.User.findOne({ email }).select('+password');
        // 3. Verify user exists and credentials match
        if (!user || !(await user.comparePassword(password))) {
            return next(new appError_1.AppError('Incorrect email or password.', 401));
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
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
/**
 * Fetch profiles of currently authenticated users.
 * Endpoint: GET /api/v1/auth/me
 */
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new appError_1.AppError('You are not authenticated.', 401));
        }
        res.status(200).json({
            status: 'success',
            data: {
                user: req.user
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getMe = getMe;
