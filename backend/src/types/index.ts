import { Request } from 'express';
import { Document, Types } from 'mongoose';

/**
 * Roles permitted in the application.
 */
export type UserRole = 'Admin' | 'Sales User';

/**
 * Interface representing the database structure of a User document.
 */
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

/**
 * Custom request payload structure decoded from the JWT access token.
 */
export interface IDecodedToken {
  id: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

/**
 * Interface representing the database structure of a Lead document.
 */
export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Custom request type extending the default Express request to contain the authenticated user's information.
 */
export interface AuthRequest extends Request {
  user?: IUser;
}
