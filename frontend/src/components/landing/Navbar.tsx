import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-neutral/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-surface p-1.5 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">Smart Leads</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-neutral hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="text-sm font-medium text-neutral hover:text-primary transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                  Log in
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
