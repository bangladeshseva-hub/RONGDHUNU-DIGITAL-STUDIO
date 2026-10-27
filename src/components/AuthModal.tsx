import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User as UserIcon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoFill = (type: 'customer' | 'admin' | 'manager') => {
    setMode('login');
    if (type === 'customer') {
      setEmailOrPhone('customer@rongdhonustudio.com');
      setPassword('customer123');
    } else if (type === 'admin') {
      setEmailOrPhone('admin@rongdhonustudio.com');
      setPassword('admin123');
    } else if (type === 'manager') {
      setEmailOrPhone('manager@rongdhonustudio.com');
      setPassword('manager123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailOrPhone, password }),
        });

        const data = await res.json();
        if (res.ok) {
          login(data.token, data.user);
          onClose();
        } else {
          setErrorMsg(data.error || 'লগইন ব্যর্থ হয়েছে।');
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password }),
        });

        const data = await res.json();
        if (res.ok) {
          login(data.token, data.user);
          onClose();
        } else {
          setErrorMsg(data.error || 'নিবন্ধন ব্যর্থ হয়েছে।');
        }
      }
    } catch (err) {
      setErrorMsg('সার্ভারের সাথে যোগাযোগে সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                {mode === 'login' ? t('অ্যাকাউন্টে প্রবেশ করুন', 'Sign In to Your Account') : t('নতুন অ্যাকাউন্ট নিবন্ধন', 'Create New Account')}
              </h3>
              <p className="text-xs text-slate-300 font-medium">রংধনু ডিজিটাল স্টুডিওর নিরাপদ ক্লাউড</p>
            </div>
          </div>
        </div>

        {/* Demo Fast-Fill Buttons */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            ⚡ {t('পরীক্ষামূলক ১-ক্লিক ডেমো লগইন:', 'Instant 1-Click Demo Login:')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className="py-1.5 px-2 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl text-[11px] font-bold text-slate-700 transition-all text-center shadow-2xs"
            >
              গ্রাহক ডেমো
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="py-1.5 px-2 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-[11px] font-bold text-purple-700 transition-all text-center shadow-2xs"
            >
              সুপার অ্যাডমিন
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('manager')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-[11px] font-bold text-indigo-700 transition-all text-center shadow-2xs"
            >
              সার্ভিস ম্যানেজার
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('আপনার পূর্ণ নাম:', 'Full Name:')}</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="উদাঃ মেহেদী হাসান"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {mode === 'login' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('ইমেইল অথবা ফোন নম্বর:', 'Email or Phone:')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="email@example.com অথবা 01XXXXXXXXX"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('ইমেইল এড্রেস:', 'Email Address:')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('মোবাইল নম্বর:', 'Mobile Phone Number:')}</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('গোপন পাসওয়ার্ড:', 'Password:')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span>যাচাই হচ্ছে...</span>
            ) : (
              <>
                <span>{mode === 'login' ? t('লগইন করুন', 'Sign In') : t('নিবন্ধন সম্পূর্ণ করুন', 'Complete Registration')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Toggle Login / Register */}
          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500">
                নতুন ব্যবহারকারী?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  নতুন একাউন্ট খুলুন
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                ইতিমধ্যে একাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  লগইন করুন
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
