
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { LogIn, UserPlus, ShieldCheck, User as UserIcon, Building2, Mail, Lock, History } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

interface FormHistory {
  names: string[];
  orgs: string[];
  emails: string[];
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    organization: '',
    role: 'Sales' as UserRole
  });

  const [history, setHistory] = useState<FormHistory>({
    names: [],
    orgs: [],
    emails: []
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load history and drafts
  useEffect(() => {
    const savedHistory = localStorage.getItem('us81_form_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const draft = localStorage.getItem('us81_login_draft');
    if (draft) setFormData(prev => ({ ...prev, ...JSON.parse(draft) }));
  }, []);

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

  const getUsers = (): User[] => {
    const users = localStorage.getItem('us81_users_db');
    return users ? JSON.parse(users) : [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getUsers();

    // Save to history on submit
    updateHistory('emails', formData.email);
    if (isRegister) {
      updateHistory('names', formData.name);
      updateHistory('orgs', formData.organization);

      if (users.some(u => u.email === formData.email)) {
        setMessage({ type: 'error', text: 'Email already registered.' });
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };

      localStorage.setItem('us81_users_db', JSON.stringify([...users, newUser]));
      setMessage({ type: 'success', text: 'Account created. Session saved.' });
      
      setTimeout(() => {
        setIsRegister(false);
        setMessage(null);
      }, 1500);

    } else {
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        localStorage.removeItem('us81_login_draft'); // Clear draft on successful login
        onLogin(user);
      } else {
        setMessage({ type: 'error', text: 'Access denied. Verify credentials.' });
      }
    }
  };

  const inputClass = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[11px] outline-none focus:ring-2 focus:ring-[#EAB308]/20 transition-all placeholder:text-slate-300";
  const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5 mb-1";

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
        <div className="md:w-8/12 p-6 md:p-8 flex flex-col">
          <div className="flex mb-6 bg-slate-50 p-1 rounded-xl">
            <button onClick={() => { setIsRegister(false); setMessage(null); }}
              className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!isRegister ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}>
              Login
            </button>
            <button onClick={() => { setIsRegister(true); setMessage(null); }}
              className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isRegister ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}>
              Register
            </button>
          </div>

          {message && (
            <div className={`mb-4 p-2.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              <ShieldCheck size={12} /> {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 flex-1">
            {isRegister && (
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
              <input type="email" required list="emails-list" className={inputClass} placeholder="id@studio81.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <datalist id="emails-list">{history.emails.map(h => <option key={h} value={h} />)}</datalist>
            </div>

            <div className="space-y-0.5">
              <label className={labelClass}><Lock size={10} /> Password</label>
              <input type="password" required className={inputClass} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>

            {isRegister && (
              <div className="space-y-0.5">
                <label className={labelClass}>Role</label>
                <select className={inputClass} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                  <option value="Sales">Sales</option>
                  <option value="Production">Production</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}

            <button type="submit" className="w-full bg-slate-900 text-[#EAB308] py-3.5 rounded-xl font-black flex items-center justify-center space-x-2 shadow-xl hover:bg-black transition-all active:scale-95 mt-4 group">
              {isRegister ? <UserPlus size={16} /> : <LogIn size={16} />}
              <span className="text-[10px] uppercase tracking-widest">{isRegister ? 'Create Account' : 'Login'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
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

export default Login;
