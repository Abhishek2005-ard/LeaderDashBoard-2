"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name.'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters.']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address.'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: [8, 'Password must be at least 8 characters.'],
        select: false // Prevent password hashes from leaking by default in queries
    },
    role: {
        type: String,
        enum: {
            values: ['Admin', 'Sales User'],
            message: 'Role must be either Admin or Sales User.'
        },
        default: 'Sales User'
    }
}, {
    timestamps: true
});
// Pre-save middleware: hash the password if it has been modified or is new
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(12);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (err) {
        next(err);
    }
});
// Instance method: verify candidate password against hashed DB copy
userSchema.methods.comparePassword = async function (candidate) {
    return bcryptjs_1.default.compare(candidate, this.password);
};
exports.User = (0, mongoose_1.model)('User', userSchema);
