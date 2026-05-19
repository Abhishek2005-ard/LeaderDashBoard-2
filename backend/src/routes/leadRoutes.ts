import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  exportLeads,
  getLeadStats
} from '../controllers/leadController';
import { protect } from '../middlewares/authMiddleware';
import { validateLead } from '../middlewares/validationMiddleware';

const router = Router();

// Protect all lead routes
router.use(protect as any);

// Dynamic statistics route (placed before parameterized /:id route to prevent collision)
router.get('/stats', getLeadStats as any);

router
  .route('/')
  .get(getLeads as any)
  .post(validateLead as any, createLead as any);

router.get('/export', exportLeads as any);

router
  .route('/:id')
  .get(getLead as any)
  .patch(validateLead as any, updateLead as any)
  .delete(deleteLead as any);

export default router;
