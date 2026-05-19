import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-background to-background"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-neutral/20 text-sm font-medium text-primary mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
          Pipeline Metrics: 1,452+ leads managed & 938 qualified prospects
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-primary tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
          Track, manage, and convert <span className="text-accent">your leads</span> in one clean dashboard.
        </h1>
        
        <p className="text-lg md:text-xl text-neutral mb-10 max-w-2xl mx-auto leading-relaxed">
          A modern, real-time Lead Management System designed to optimize your pipeline. Easily track status, search sources, and collaborate with secure, role-based controls.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/register">
            <Button className="h-12 px-8 text-base shadow-lg shadow-accent/20">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        {/* Dashboard Mockup */}
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-neutral/20 to-transparent blur opacity-50"></div>
          <div className="relative rounded-2xl overflow-hidden border border-neutral/10 shadow-2xl bg-surface">
            <img 
              src="/dashboard-mockup.png" 
              alt="Smart Leads Dashboard Mockup" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
