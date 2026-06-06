import { Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types';
import { generateLeadsCSV } from '../utils/csvHelper';

/**
 * Create a new lead.
 * Endpoint: POST /api/v1/leads
 */
export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, company, status, source, notes } = req.body;

    const newLead = await Lead.create({
      name,
      email,
      phone,
      company,
      status: status || 'New',
      source,
      notes,
      createdBy: req.user?._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        lead: newLead
      }
    });
  } catch (err: any) {
    next(err);
  }
};

/**
 * Get a paginated and filtered list of leads isolated to the authenticated user.
 * Endpoint: GET /api/v1/leads
 */
export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Scope queries strictly to the authenticated user
    const filter: any = { createdBy: req.user?._id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;
    
    // Fuzzy Search by Name, Email, Phone, or Company using regex
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$and = [
        {
          $or: [
            { name: searchRegex },
            { email: searchRegex },
            { phone: searchRegex },
            { company: searchRegex }
          ]
        }
      ];
    }

    // 2. Sorting
    const sortBy: any = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    // 3. Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    // Execute query
    const leads = await Lead.find(filter).sort(sortBy).skip(skip).limit(limit);
    const total = await Lead.countDocuments(filter);

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
  } catch (err: any) {
    next(err);
  }
};

/**
 * Get a single lead by ID, isolated to the authenticated user.
 * Endpoint: GET /api/v1/leads/:id
 */
export const getLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, createdBy: req.user?._id });

    if (!lead) {
      return next(new AppError('No lead found with that ID or unauthorized access', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        lead
      }
    });
  } catch (err: any) {
    next(err);
  }
};

/**
 * Update an existing lead, isolated to the authenticated user.
 * Endpoint: PATCH /api/v1/leads/:id
 */
export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user?._id },
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company,
        status: req.body.status,
        source: req.body.source,
        notes: req.body.notes
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!lead) {
      return next(new AppError('No lead found with that ID or unauthorized access', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        lead
      }
    });
  } catch (err: any) {
    next(err);
  }
};

/**
 * Delete a lead permanently, isolated to the authenticated user.
 * Endpoint: DELETE /api/v1/leads/:id
 */
export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, createdBy: req.user?._id });

    if (!lead) {
      return next(new AppError('No lead found with that ID or unauthorized access', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err: any) {
    next(err);
  }
};

/**
 * Export filtered leads as a CSV file, isolated to the authenticated user.
 * Endpoint: GET /api/v1/leads/export
 */
export const exportLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter: any = { createdBy: req.user?._id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$and = [
        {
          $or: [
            { name: searchRegex },
            { email: searchRegex },
            { phone: searchRegex },
            { company: searchRegex }
          ]
        }
      ];
    }

    const sortBy: any = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    // Fetch matching records (bypass pagination, limit to 10k to prevent overwhelming DB)
    const leads = await Lead.find(filter).sort(sortBy).limit(10000);

    // Generate CSV String
    const csvString = generateLeadsCSV(leads);

    // Set HTTP headers triggering a browser file stream download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');

    // Send the raw CSV data
    res.status(200).send(csvString);
  } catch (err: any) {
    next(err);
  }
};

/**
 * Get dynamic lead statistics for the logged-in user.
 * Endpoint: GET /api/v1/leads/stats
 */
export const getLeadStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError('Authentication required', 401));
    }

    const stats = await Lead.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] } },
          qualified: { $sum: { $cond: [{ $eq: ['$status', 'Qualified'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      lost: 0
    };

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          total: result.total,
          new: result.new,
          contacted: result.contacted,
          qualified: result.qualified,
          lost: result.lost
        }
      }
    });
  } catch (err: any) {
    next(err);
  }
};
