import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Admin' | 'Sales User'>('Sales User');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token, data } = response.data;
      login(token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 hidden">
        {/* Hiding the old header since AuthLayout now has the header */}
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}
        <Input
          label="Full Name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />
        <Input
          label="Email address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
        />
        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
        />
        
        <div className="mb-5">
          <label className="block text-sm font-medium text-primary mb-1.5">
            Role
          </label>
          <select
            className="w-full px-3 py-2.5 border border-neutral/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-surface text-primary"
            value={role}
            onChange={(e) => setRole(e.target.value as 'Admin' | 'Sales User')}
          >
            <option value="Sales User">Sales User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <Button type="submit" className="w-full h-11 text-base shadow-md shadow-accent/10" isLoading={isLoading}>
          Sign up
        </Button>
      </form>
      <div className="mt-8 pt-6 border-t border-neutral/10 text-center text-sm">
        <span className="text-neutral">Already have an account? </span>
        <Link to="/login" className="font-medium text-accent hover:text-primary transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
};
