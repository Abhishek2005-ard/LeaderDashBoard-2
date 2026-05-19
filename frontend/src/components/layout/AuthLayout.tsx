import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="bg-primary text-surface p-2 rounded-xl shadow-sm">
            <BarChart3 className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-primary tracking-tight">Smart Leads</span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-primary tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-neutral">
          Predictive intelligence for modern revenue teams.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-surface py-8 px-4 shadow-xl shadow-neutral/5 border border-neutral/10 sm:rounded-2xl sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
