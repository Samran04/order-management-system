
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  User as UserIcon, 
  Building2, 
  Mail, 
  Lock, 
  History, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../lib/api';

interface Props {
  onLogin: (user: User) => void;
  initialResetToken?: string | null;
  initialVerifyToken?: string | null;
  onClearTokens: () => void;
}

interface FormHistory {
  names: string[];
  orgs: string[];
  emails: string[];
}

type AuthView = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD' | 'VERIFY_EMAIL';

const Login: React.FC<Props> = ({ onLogin, initialResetToken, initialVerifyToken, onClearTokens }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    organization: '',
    role: 'Sales' as UserRole
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<FormHistory>({
    names: [],
    orgs: [],
    emails: []
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // Load history and drafts
  useEffect(() => {
    const savedHistory = localStorage.getItem('us81_form_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const draft = localStorage.getItem('us81_login_draft');
    if (draft) setFormData(prev => ({ ...prev, ...JSON.parse(draft) }));
  }, []);

  // Handle initial tokens from URL
  useEffect(() => {
    if (initialResetToken) {
      setView('RESET_PASSWORD');
    } else if (initialVerifyToken) {
      handleVerifyEmail(initialVerifyToken);
    }
  }, [initialResetToken, initialVerifyToken]);

  // Auto-save drafts
  useEffect(() => {
    localStorage.setItem('us81_login_draft', JSON.stringify(formData));
  }, [formData]);

  const updateHistory = (key: keyof FormHistory, value: string) => {
    if (!value.trim()) return;
    setHistory(prev => {
      const existing = prev[key] || [];
      if (existing.includes(value)) return prev;
      const updated = { ...prev, [key]: [value, ...existing].slice(0, 5) };
      localStorage.setItem('us81_form_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleVerifyEmail = async (token: string) => {
    setLoading(true);
    setView('VERIFY_EMAIL');
    try {
      const res = await api.verifyEmail(token);
      setMessage({ type: 'success', text: res.message });
      onClearTokens();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Verification failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.forgotPassword(formData.email);
      setMessage({ type: 'info', text: res.message });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send reset link.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.resetPassword(initialResetToken!, formData.password);
      setMessage({ type: 'success', text: res.message });
      onClearTokens();
      setTimeout(() => setView('LOGIN'), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to reset password.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.toLowerCase().endsWith('@efzeefashion.com')) {
      setMessage({ type: 'error', text: 'Access denied: Must use a @efzeefashion.com email address.' });
      return;
    }

    updateHistory('emails', formData.email);
    setMessage(null);
    setLoading(true);
    
    try {
      if (view === 'REGISTER') {
        updateHistory('names', formData.name);
        updateHistory('orgs', formData.organization);

        const res = await api.register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          organization: formData.organization,
          role: formData.role
        });

        setMessage({ type: 'success', text: res.message });
        setTimeout(() => {
          setView('LOGIN');
          setMessage(null);
        }, 5000);

      } else {
        const user = await api.login(formData.email, formData.password);
        localStorage.removeItem('us81_login_draft');
        onLogin(user);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Access denied. Verify credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[11px] outline-none focus:ring-2 focus:ring-[#EAB308]/20 transition-all placeholder:text-slate-300";
  const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5 mb-1";

  const renderMessage = () => {
    if (!message) return null;
    const bgColor = message.type === 'success' ? 'bg-green-50 text-green-600' : message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600';
    const Icon = message.type === 'success' ? CheckCircle : message.type === 'error' ? ShieldCheck : Info;
    
    return (
      <div className={`mb-4 p-2.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 ${bgColor}`}>
        <Icon size={12} /> {message.text}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] border border-slate-100">
        {/* Compressed Branding Panel */}
        <div className="md:w-4/12 bg-[#EAB308] p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-black/10"></div>
          <div className="inline-block bg-black p-3.5 rounded-2xl mb-4 shadow-xl">
            <span className="text-white font-black text-2xl">US81</span>
          </div>
          <h2 className="text-xl font-black text-black leading-none">STUDIO 81</h2>
          <p className="text-black/50 font-black text-[8px] mt-1.5 uppercase tracking-widest">Global Ops</p>
          
          <div className="mt-8 space-y-2 w-full">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20 text-left">
              <p className="text-[7px] font-black text-black/40 uppercase">Network</p>
              <p className="text-[10px] font-black text-black">Secure Core</p>
            </div>
          </div>
        </div>

        {/* Compressed Form Panel */}
        <div className="md:w-8/12 p-6 md:p-8 flex flex-col relative">
          {(view === 'LOGIN' || view === 'REGISTER') && (
            <div className="flex mb-6 bg-slate-50 p-1 rounded-xl">
              <button onClick={() => { setView('LOGIN'); setMessage(null); }}
                className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${view === 'LOGIN' ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}>
                Login
              </button>
              <button onClick={() => { setView('REGISTER'); setMessage(null); }}
                className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${view === 'REGISTER' ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}>
                Register
              </button>
            </div>
          )}

          {view === 'FORGOT_PASSWORD' && (
            <button onClick={() => setView('LOGIN')} className="flex items-center gap-1.5 text-[9px] font-black uppercase text-[#EAB308] mb-6 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft size={12} /> Back to Login
            </button>
          )}

          {renderMessage()}

          {view === 'VERIFY_EMAIL' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              {loading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EAB308]"></div>
              ) : (
                <>
                  {message?.type === 'success' ? <CheckCircle size={48} className="text-green-500" /> : <AlertCircle size={48} className="text-red-500" />}
                  <button onClick={() => setView('LOGIN')} className="bg-black text-[#EAB308] px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest">Continue to Login</button>
                </>
              )}
            </div>
          ) : view === 'FORGOT_PASSWORD' ? (
            <form onSubmit={handleForgotPassword} className="space-y-4 flex-1">
              <div className="space-y-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Recover Account</h3>
                <p className="text-[9px] text-slate-400 font-bold leading-relaxed">Enter your email address and we'll send you a link to reset your password.</p>
              </div>
              <div className="space-y-0.5">
                <label className={labelClass}><Mail size={10} /> Work Email</label>
                <input type="email" required className={inputClass} placeholder="id@efzeefashion.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-slate-900 text-[#EAB308] py-3.5 rounded-xl font-black flex items-center justify-center space-x-2 shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50">
                <span className="text-[10px] uppercase tracking-widest">{loading ? 'Processing...' : 'Send Reset Link'}</span>
              </button>
            </form>
          ) : view === 'RESET_PASSWORD' ? (
            <form onSubmit={handleResetPassword} className="space-y-3.5 flex-1">
              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Reset Password</h3>
                <p className="text-[9px] text-slate-400 font-bold leading-relaxed">Create a secure new password for your account.</p>
              </div>
              <div className="space-y-0.5 relative">
                <label className={labelClass}><Lock size={10} /> New Password</label>
                <input type={showPassword ? "text" : "password"} required className={inputClass} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-7 text-slate-300 hover:text-slate-500 transition-colors">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="space-y-0.5">
                <label className={labelClass}><ShieldCheck size={10} /> Confirm Password</label>
                <input type="password" required className={inputClass} placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-slate-900 text-[#EAB308] py-3.5 rounded-xl font-black flex items-center justify-center space-x-2 shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50">
                <span className="text-[10px] uppercase tracking-widest">{loading ? 'Processing...' : 'Update Password'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 flex-1">
              {view === 'REGISTER' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-0.5">
                    <label className={labelClass}><UserIcon size={10} /> Name</label>
                    <input required list="names-list" className={inputClass} placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <datalist id="names-list">{history.names.map(h => <option key={h} value={h} />)}</datalist>
                  </div>
                  <div className="space-y-0.5">
                    <label className={labelClass}><Building2 size={10} /> Org</label>
                    <input required list="orgs-list" className={inputClass} placeholder="Company" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} />
                    <datalist id="orgs-list">{history.orgs.map(h => <option key={h} value={h} />)}</datalist>
                  </div>
                </div>
              )}

              <div className="space-y-0.5">
                <label className={labelClass}><Mail size={10} /> Work Email</label>
                <input type="email" required pattern=".*@efzeefashion\.com$" title="Must be a @efzeefashion.com email address" list="emails-list" className={inputClass} placeholder="id@efzeefashion.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <datalist id="emails-list">{history.emails.map(h => <option key={h} value={h} />)}</datalist>
              </div>

              <div className="space-y-0.5 relative">
                <label className={labelClass}><Lock size={10} /> Password</label>
                <input type={showPassword ? "text" : "password"} required className={inputClass} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-7 text-slate-300 hover:text-slate-500 transition-colors">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {view === 'REGISTER' && (
                <div className="space-y-0.5">
                  <label className={labelClass}>Role</label>
                  <select className={inputClass} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                    <option value="Sales">Sales</option>
                    <option value="Production">Production</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end">
                {view === 'LOGIN' && (
                  <button type="button" onClick={() => setView('FORGOT_PASSWORD')} className="text-[8px] font-black text-[#EAB308] uppercase tracking-widest hover:underline">
                    Forgot Password?
                  </button>
                )}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-slate-900 text-[#EAB308] py-3.5 rounded-xl font-black flex items-center justify-center space-x-2 shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 mt-4 group">
                {view === 'REGISTER' ? <UserPlus size={16} /> : <LogIn size={16} />}
                <span className="text-[10px] uppercase tracking-widest">{loading ? 'Processing...' : (view === 'REGISTER' ? 'Create Account' : 'Login')}</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center">
              <History size={10} className="mr-1.5" /> Auto-save active
            </p>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">v2.1 Build</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoProps {
  size?: number;
}
const Info: React.FC<InfoProps> = ({ size = 12 }) => <AlertCircle size={size} />;

export default Login;
