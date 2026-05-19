"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lead = void 0;
const mongoose_1 = require("mongoose");
const leadSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the lead name.'],
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, 'Please provide the lead email address.'],
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address.'
        ],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['New', 'Contacted', 'Qualified', 'Lost'],
            message: 'Status must be: New, Contacted, Qualified, or Lost'
        },
        default: 'New',
        index: true
    },
    source: {
        type: String,
        enum: {
            values: ['Website', 'Instagram', 'Referral'],
            message: 'Source must be: Website, Instagram, or Referral'
        },
        required: [true, 'Please provide a lead source.'],
        index: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Lead must belong to a user.']
    }
}, {
    timestamps: true
});
// Compound indexes for optimized querying (e.g. filtering by status and source while sorting by date)
leadSchema.index({ status: 1, source: 1, createdAt: -1 });
// Text index to allow efficient text search across name and email
leadSchema.index({ name: 'text', email: 'text' });
exports.Lead = (0, mongoose_1.model)('Lead', leadSchema);
