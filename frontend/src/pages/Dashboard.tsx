import React, { useState, useEffect, useCallback } from 'react';
import { leadService } from '../api/leadService';
import type { ILead, PaginationMetadata, ILeadStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadPagination } from '../components/leads/LeadPagination';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { LeadDetailsModal } from '../components/leads/LeadDetailsModal';
import { Button } from '../components/common/Button';
import { Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Data State
  const [leads, setLeads] = useState<ILead[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata>({ total: 0, page: 1, pages: 1 });
  const [stats, setStats] = useState<ILeadStats>({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter State
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    search: '',
    sort: 'latest' as 'latest' | 'oldest',
    page: 1,
    limit: 10
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<ILead | null>(null);
  const [viewingLead, setViewingLead] = useState<ILead | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      // Parallelize fetches to minimize latency
      const [leadsRes, statsRes] = await Promise.all([
        leadService.fetchLeads(filters),
        leadService.fetchLeadStats()
      ]);
      setLeads(leadsRes.data.leads);
      setPagination(leadsRes.pagination);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this lead?')) {
      try {
        await leadService.deleteLead(id);
        loadLeads(); // Refresh table and stats
      } catch (error) {
        console.error('Failed to delete lead:', error);
        alert('Failed to delete lead. Check permissions.');
      }
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await leadService.exportLeadsCSV(filters);
    } catch (error) {
      console.error('Failed to export leads:', error);
      alert('Failed to export leads.');
    } finally {
      setIsExporting(false);
    }
  };

  const openCreateModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lead: ILead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const openDetailsModal = (lead: ILead) => {
    setViewingLead(lead);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your leads, track status, and convert prospects.
          </p>
        </div>
        <div>
          <Button onClick={openCreateModal}>
            <Plus className="w-5 h-5 mr-2" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Dynamic Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Leads */}
        <div className="bg-surface p-6 rounded-xl border border-neutral/10 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-slate-500"></div>
          <p className="text-sm font-medium text-neutral">Total Leads</p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-3xl font-extrabold text-primary tracking-tight">
              {stats.total.toLocaleString()}
            </h3>
            <span className="text-xs text-neutral/80 bg-neutral/10 px-2.5 py-1 rounded-full font-semibold">
              All Sources
            </span>
          </div>
        </div>

        {/* Card 2: New Leads */}
        <div className="bg-surface p-6 rounded-xl border border-neutral/10 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-accent"></div>
          <p className="text-sm font-medium text-neutral">New Leads</p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-3xl font-extrabold text-primary tracking-tight">
              {stats.new.toLocaleString()}
            </h3>
            <span className="text-xs text-accent bg-accent/10 px-2.5 py-1 rounded-full font-semibold">
              Incoming
            </span>
          </div>
        </div>

        {/* Card 3: Contacted Leads */}
        <div className="bg-surface p-6 rounded-xl border border-neutral/10 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
          <p className="text-sm font-medium text-neutral">Contacted</p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-3xl font-extrabold text-primary tracking-tight">
              {stats.contacted.toLocaleString()}
            </h3>
            <span className="text-xs text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full font-semibold">
              In Progress
            </span>
          </div>
        </div>

        {/* Card 4: Qualified / Conversion Rate */}
        <div className="bg-surface p-6 rounded-xl border border-neutral/10 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
          <p className="text-sm font-medium text-neutral">Qualified Leads</p>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-3xl font-extrabold text-primary tracking-tight">
              {stats.qualified.toLocaleString()}
            </h3>
            <span className="text-xs text-secondary bg-secondary/10 px-2.5 py-1 rounded-full font-semibold">
              {stats.total > 0 ? ((stats.qualified / stats.total) * 100).toFixed(0) : 0}% Conv.
            </span>
          </div>
        </div>
      </div>

      {/* Filters Area */}
      <LeadFilters 
        filters={filters} 
        setFilters={setFilters} 
        onExport={handleExport}
        isExporting={isExporting}
      />

      {/* Data Table */}
      <div className="flex flex-col">
        <LeadTable 
          leads={leads} 
          isLoading={isLoading} 
          onEdit={openEditModal} 
          onDelete={handleDelete} 
          onViewDetails={openDetailsModal}
        />
        {/* Pagination binds directly under the table */}
        <LeadPagination 
          pagination={pagination} 
          onPageChange={(page) => setFilters(prev => ({ ...prev, page }))} 
        />
      </div>

      {/* Action Modals */}
      <LeadFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadLeads}
        initialData={editingLead}
      />

      <LeadDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        lead={viewingLead}
      />
    </div>
  );
};
