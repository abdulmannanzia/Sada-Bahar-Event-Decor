import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { adminLogin } from '../api/client.js';

interface Props {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<Props> = ({ onLoginSuccess, onNavigateHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminLogin({ username, password });
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl -top-20 -right-20 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-3xl -bottom-20 -left-20 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Back Link */}
        <button
          onClick={onNavigateHome}
          className="mb-6 inline-flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-[#D4AF37] transition-colors"
          id="admin-login-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        {/* Login Card */}
        <div className="bg-[#0B0B0B] border border-[#D4AF37]/30 p-8 rounded-3xl shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-2xl flex items-center justify-center text-[#D4AF37] mx-auto mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#FAF8F3]">CMS Admin Portal</h1>
            <p className="text-xs text-gray-400">Authorized Personnel Sign-In</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-xs text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username (e.g. Humza, Hammad)"
                  className="w-full bg-black/60 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  id="admin-login-username"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-black/60 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  id="admin-login-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center space-x-2"
              id="admin-login-submit-btn"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-gray-900 text-center">
            <span className="text-[10px] text-gray-500 block">
              Sada Bahar Event & Decor Content Management System
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
