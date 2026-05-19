import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
  {
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
  },
  {
    timestamps: true
  }
);

// Pre-save middleware: hash the password if it has been modified or is new
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Instance method: verify candidate password against hashed DB copy
userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>('User', userSchema);
