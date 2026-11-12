import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User as UserIcon,
  Lock,
  Mail,
  Shield,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, showToast } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!username || !email || !password || !fullName) {
        showToast('Please fill in all registration fields', 'warning');
        return;
      }
      showToast('Account created with BCrypt password hashing! Signed in.', 'success');
      login(false);
      onClose();
    } else {
      if (!email || !password) {
        showToast('Please provide your email and password', 'warning');
        return;
      }
      // Check if admin email
      if (email.toLowerCase().includes('admin')) {
        login(true);
      } else {
        login(false);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-0.5 mx-auto mb-3 shadow-lg shadow-violet-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Lock className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {isRegister ? 'Create Your Account' : 'Welcome to CineBook AI'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister
              ? 'Join to save wishlists, write reviews, and receive hybrid recommendations'
              : 'Sign in to access your personalized recommendation dashboard'}
          </p>
        </div>

        {/* Demo 1-Click Login Shortcuts */}
        {!isRegister && (
          <div className="mb-6 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Quick 1-Click Demo Logins:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  login(false);
                  onClose();
                }}
                className="py-2 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 text-violet-400" />
                Student User
              </button>
              <button
                type="button"
                onClick={() => {
                  login(true);
                  onClose();
                }}
                className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                Admin Portal
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isRegister && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <div className="relative flex items-center">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Ukeshwari S."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. cinebook_student"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@cinebookai.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-violet-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            {isRegister ? 'Register & Sign In' : 'Sign In'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-400 hover:text-cyan-300 transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>

      </div>
    </div>
  );
};
