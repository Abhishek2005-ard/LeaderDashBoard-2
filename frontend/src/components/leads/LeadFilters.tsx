import React, { useEffect, useState } from 'react';
import { Search, Download } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { Button } from '../common/Button';

interface LeadFiltersProps {
  filters: {
    status: string;
    source: string;
    search: string;
    sort: 'latest' | 'oldest';
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onExport: () => void;
  isExporting?: boolean;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({ filters, setFilters, onExport, isExporting }) => {
  // Local state for immediate typing feedback
  const [searchTerm, setSearchTerm] = useState(filters.search);
  
  // Debounce the local state by 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // When the debounced value updates, push it to the parent state to trigger an API call
  useEffect(() => {
    setFilters((prev: any) => ({ ...prev, search: debouncedSearchTerm, page: 1 }));
  }, [debouncedSearchTerm, setFilters]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Debounced Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-neutral/20 rounded-lg leading-5 bg-surface placeholder-neutral/50 focus:outline-none focus:placeholder-neutral/40 focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm text-primary"
            placeholder="Search by name, email, phone, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-neutral/20 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-lg border bg-surface text-primary"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-neutral/20 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-lg border bg-surface text-primary"
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value, page: 1 })}
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>

          <select
            className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-neutral/20 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-lg border bg-surface text-primary"
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value as 'latest'|'oldest', page: 1 })}
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <Button 
            variant="secondary" 
            onClick={onExport} 
            isLoading={isExporting}
            className="w-full md:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

      </div>
    </div>
  );
};
