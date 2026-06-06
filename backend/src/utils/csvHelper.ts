import { ILead } from '../types';

/**
 * Utility helper to convert an array of Lead documents into a compliant CSV string structure.
 * Escapes internal quotes to prevent structural parsing breakages.
 */
export const generateLeadsCSV = (leads: ILead[]): string => {
  const headers = ['Lead ID', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Source', 'Notes', 'Created At'];

  const rows = leads.map(lead => {
    // Clean and escape fields to prevent CSV injection or broken rows
    const name = lead.name ? `"${lead.name.replace(/"/g, '""')}"` : '""';
    const email = lead.email ? `"${lead.email.replace(/"/g, '""')}"` : '""';
    const phone = lead.phone ? `"${lead.phone.replace(/"/g, '""')}"` : '""';
    const company = lead.company ? `"${lead.company.replace(/"/g, '""')}"` : '""';
    const notes = lead.notes ? `"${lead.notes.replace(/"/g, '""')}"` : '""';
    
    return [
      lead._id.toString(),
      name,
      email,
      phone,
      company,
      lead.status,
      lead.source,
      notes,
      new Date(lead.createdAt).toISOString()
    ].join(',');
  });

  // Combine headers and rows with standard carriage returns
  return [headers.join(','), ...rows].join('\r\n');
};
