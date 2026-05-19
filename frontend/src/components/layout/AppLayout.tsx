import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Users, ArrowLeft } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col text-primary">
      {/* Top Navigation */}
      <nav className="bg-surface border-b border-neutral/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <LayoutDashboard className="h-8 w-8 text-accent" />
                <span className="ml-2 text-xl font-bold text-primary hidden sm:block">
                  Smart Leads
                </span>
              </div>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-accent text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  Leads
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-sm font-medium text-neutral hover:text-primary transition-colors flex items-center gap-1.5"
                title="Back to Landing Page"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Landing</span>
              </Link>
              <span className="h-4 w-px bg-neutral/15 hidden sm:block"></span>
              <div className="flex items-center">
                <span className="text-sm text-neutral mr-4">
                  {user?.name} ({user?.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent rounded-full"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
