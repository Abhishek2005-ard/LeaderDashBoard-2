import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const CtaBanner: React.FC = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-primary text-surface p-12 md:p-16 text-center shadow-xl">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              Take Control of Your Sales Leads Today
            </h2>
            <p className="text-lg md:text-xl text-surface/80 mb-10">
              Simplify status tracking, manage sources, and collaborate securely with role-based access in one centralized dashboard.
            </p>
            <Link to="/register">
              <Button 
                variant="secondary"
                className="h-14 px-8 text-lg bg-surface text-primary hover:bg-gray-100 border-none shadow-lg shadow-black/10"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <p className="mt-6 text-sm text-surface/60">
              Instant setup. Fully secure role-based access.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
