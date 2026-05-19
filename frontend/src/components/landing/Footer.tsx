import React from 'react';
import { BarChart3 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-neutral/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary text-surface p-1 rounded-md">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-primary tracking-tight">Smart Leads</span>
            </div>
            <p className="text-sm text-neutral mb-6 pr-4">
              The ultimate lead management dashboard for modern sales teams. Track, organize, and convert prospects seamlessly.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-neutral hover:text-accent transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-neutral hover:text-accent transition-colors">Integrations</a></li>
              <li><a href="#" className="text-sm text-neutral hover:text-accent transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-neutral hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm text-neutral hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-neutral hover:text-accent transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-neutral hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-neutral hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-neutral hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-neutral hover:text-accent transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-neutral/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral">
            &copy; {new Date().getFullYear()} Smart Leads Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
