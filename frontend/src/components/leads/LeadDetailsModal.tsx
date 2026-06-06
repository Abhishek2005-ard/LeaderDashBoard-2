import React from 'react';
import type { ILead } from '../../types';
import { Button } from '../common/Button';
import { X, Calendar, Mail, Tag, Compass, Phone, Briefcase, FileText } from 'lucide-react';

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ILead | null;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Qualified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Lost':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-neutral/5 text-primary border-neutral/10';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Panel */}
        <div className="relative z-10 inline-block align-bottom bg-surface rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-neutral/10">
          <div className="bg-surface px-6 pt-5 pb-6 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl leading-6 font-bold text-primary" id="modal-title">
                Lead Details
              </h3>
              <button onClick={onClose} className="text-neutral hover:text-primary focus:outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Details Content */}
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-neutral/10">
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center text-accent text-2xl font-bold uppercase">
                  {lead.name.substring(0, 2)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary">{lead.name}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)} mt-1.5`}>
                    {lead.status}
                  </span>
                </div>
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-neutral mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-neutral uppercase tracking-wider">Email Address</span>
                    <a href={`mailto:${lead.email}`} className="text-primary text-sm hover:underline font-medium">
                      {lead.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Compass className="w-5 h-5 text-neutral mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-neutral uppercase tracking-wider">Lead Source</span>
                    <span className="text-primary text-sm font-medium">{lead.source}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-neutral mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-neutral uppercase tracking-wider">Phone Number</span>
                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`} className="text-primary text-sm hover:underline font-medium">
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-neutral text-sm italic">Not provided</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-neutral mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-neutral uppercase tracking-wider">Company</span>
                    <span className="text-primary text-sm font-medium">
                      {lead.company || <span className="text-neutral italic">Not provided</span>}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-neutral mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-neutral uppercase tracking-wider">Created At</span>
                    <span className="text-primary text-sm font-medium">
                      {new Date(lead.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-neutral mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-neutral uppercase tracking-wider">Database ID</span>
                    <span className="text-primary text-xs font-mono select-all bg-neutral/5 p-1 rounded">
                      {lead._id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="pt-6 border-t border-neutral/10">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-neutral mt-0.5" />
                  <div className="w-full">
                    <span className="block text-xs font-semibold text-neutral uppercase tracking-wider mb-1">Notes</span>
                    <div className="text-primary text-sm bg-neutral/5 p-3 rounded-lg border border-neutral/10 whitespace-pre-wrap min-h-[60px]">
                      {lead.notes || <span className="text-neutral italic">No notes added.</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-8 pt-4 border-t border-neutral/10 flex justify-end">
                <Button type="button" onClick={onClose} className="w-full sm:w-auto">
                  Close Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
