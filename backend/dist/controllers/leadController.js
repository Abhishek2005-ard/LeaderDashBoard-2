"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLeads = exports.deleteLead = exports.updateLead = exports.getLead = exports.getLeads = exports.createLead = void 0;
const Lead_1 = require("../models/Lead");
const appError_1 = require("../utils/appError");
const csvHelper_1 = require("../utils/csvHelper");
/**
 * Create a new lead.
 * Endpoint: POST /api/v1/leads
 */
const createLead = async (req, res, next) => {
    try {
        const { name, email, status, source } = req.body;
        const newLead = await Lead_1.Lead.create({
            name,
            email,
            status: status || 'New',
            source,
            createdBy: req.user?._id
        });
        res.status(201).json({
            status: 'success',
            data: {
                lead: newLead
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createLead = createLead;
/**
 * Get a paginated and filtered list of leads.
 * Endpoint: GET /api/v1/leads
 */
const getLeads = async (req, res, next) => {
    try {
        // 1. Filtering
        const filter = {};
        if (req.query.status)
            filter.status = req.query.status;
        if (req.query.source)
            filter.source = req.query.source;
        // Fuzzy Search by Name or Email using regex
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [
                { name: searchRegex },
                { email: searchRegex }
            ];
        }
        // 2. Sorting
        const sortBy = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
        // 3. Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        // Execute query
        const leads = await Lead_1.Lead.find(filter).sort(sortBy).skip(skip).limit(limit);
        const total = await Lead_1.Lead.countDocuments(filter);
        res.status(200).json({
            status: 'success',
            results: leads.length,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            },
            data: {
                leads
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getLeads = getLeads;
/**
 * Get a single lead by ID.
 * Endpoint: GET /api/v1/leads/:id
 */
const getLead = async (req, res, next) => {
    try {
        const lead = await Lead_1.Lead.findById(req.params.id);
        if (!lead) {
            return next(new appError_1.AppError('No lead found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                lead
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getLead = getLead;
/**
 * Update an existing lead.
 * Endpoint: PATCH /api/v1/leads/:id
 */
const updateLead = async (req, res, next) => {
    try {
        const lead = await Lead_1.Lead.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            status: req.body.status,
            source: req.body.source
        }, {
            new: true,
            runValidators: true
        });
        if (!lead) {
            return next(new appError_1.AppError('No lead found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                lead
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateLead = updateLead;
/**
 * Delete a lead permanently.
 * Endpoint: DELETE /api/v1/leads/:id
 */
const deleteLead = async (req, res, next) => {
    try {
        const lead = await Lead_1.Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return next(new appError_1.AppError('No lead found with that ID', 404));
        }
        // Standard RESTful pattern: Return 204 No Content for deletion success
        res.status(204).json({
            status: 'success',
            data: null
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteLead = deleteLead;
/**
 * Export filtered leads as a CSV file.
 * Endpoint: GET /api/v1/leads/export
 */
const exportLeads = async (req, res, next) => {
    try {
        // 1. Re-use identical filtering logic
        const filter = {};
        if (req.query.status)
            filter.status = req.query.status;
        if (req.query.source)
            filter.source = req.query.source;
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [
                { name: searchRegex },
                { email: searchRegex }
            ];
        }
        const sortBy = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
        // Fetch matching records (bypass pagination, limit to 10k to prevent overwhelming DB)
        const leads = await Lead_1.Lead.find(filter).sort(sortBy).limit(10000);
        // Generate CSV String
        const csvString = (0, csvHelper_1.generateLeadsCSV)(leads);
        // Set HTTP headers triggering a browser file stream download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');
        // Send the raw CSV data
        res.status(200).send(csvString);
    }
    catch (err) {
        next(err);
    }
};
exports.exportLeads = exportLeads;
