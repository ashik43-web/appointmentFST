import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  User,
  Lock,
  Mail,
  Building2,
  LogIn,
  UserPlus,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    showToast,
    setActivePage
  } = useHospital();

  const { login, register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (authModalMode === 'register') {
        const payload = {
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          age: age ? Number(age) : undefined,
          gender,
          address: address.trim()
        };
        const u = await register(payload);
        showToast(`Welcome to Madanpur Hospital, ${u.name}!`, 'success');
        setIsAuthModalOpen(false);
        setActivePage('patient-dashboard');
      } else {
        const u = await login({ email: email.trim(), password, loginType: authModalMode });
        showToast(`Welcome back, ${u.name}!`, 'success');
        setIsAuthModalOpen(false);
        if (u.role === 'admin' || u.role === 'superadmin') {
          setActivePage('admin-dashboard');
        } else {
          setActivePage('patient-dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-6"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Madanpur Specialized Hospital</span>
          </div>

          <h2 className="text-xl font-black text-white">
            {authModalMode === 'register'
              ? 'Create Patient Account'
              : authModalMode === 'admin'
              ? 'Hospital Admin Portal Login'
              : 'Sign in to Patient Portal'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access appointment histories, receipts, reports, and doctor consultations.
          </p>

          {/* Mode Switch Tabs */}
          <div className="mt-4 flex bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authModalMode === 'login' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Patient Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('register');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authModalMode === 'register' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              New Register
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('admin');
                setError(null);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                authModalMode === 'admin' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin Portal
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmed Tasrik"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="e.g. you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Enter secure password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500 font-sans"
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="01712-345678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 28"
                    value={age}
                    onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-teal-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Area / City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Narayanganj"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-teal-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-teal-600/25 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : authModalMode === 'register' ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Log In</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In Securely</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
