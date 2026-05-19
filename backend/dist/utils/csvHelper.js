"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLeadsCSV = void 0;
/**
 * Utility helper to convert an array of Lead documents into a compliant CSV string structure.
 * Escapes internal quotes to prevent structural parsing breakages.
 */
const generateLeadsCSV = (leads) => {
    const headers = ['Lead ID', 'Name', 'Email', 'Status', 'Source', 'Created At'];
    const rows = leads.map(lead => {
        // Clean and escape fields to prevent CSV injection or broken rows
        const name = lead.name ? `"${lead.name.replace(/"/g, '""')}"` : '""';
        const email = lead.email ? `"${lead.email.replace(/"/g, '""')}"` : '""';
        return [
            lead._id.toString(),
            name,
            email,
            lead.status,
            lead.source,
            new Date(lead.createdAt).toISOString()
        ].join(',');
    });
    // Combine headers and rows with standard carriage returns
    return [headers.join(','), ...rows].join('\r\n');
};
exports.generateLeadsCSV = generateLeadsCSV;
