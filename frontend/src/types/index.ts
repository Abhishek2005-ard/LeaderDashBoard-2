export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface ILead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  pages: number;
}

export interface GetLeadsResponse {
  status: string;
  results: number;
  pagination: PaginationMetadata;
  data: {
    leads: ILead[];
  };
}

export interface ILeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  lost: number;
}

export interface GetLeadStatsResponse {
  status: string;
  data: {
    stats: ILeadStats;
  };
}
