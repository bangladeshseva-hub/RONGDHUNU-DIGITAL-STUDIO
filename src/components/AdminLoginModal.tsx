import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WebsiteSettings } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  settings: WebsiteSettings;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  settings,
}) => {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim() || !password) {
      setErrorMsg('ইউজারনেম/ইমেইল এবং পাসওয়ার্ড টাইপ করুন।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token, data.user);
        onSuccess();
        onClose();
      } else {
        setErrorMsg(data.error || 'ভুল ইউজারনেম বা পাসওয়ার্ড। অ্যাডমিন প্যানেলে প্রবেশ সংরক্ষিত।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-indigo-900/60 space-y-6 relative animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-pink-500 p-0.5 shadow-xl">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-sky-400" />
            </div>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            {settings.brandNameBn} — অ্যাডমিন পোর্টাল
          </h2>
          <p className="text-xs text-slate-400">
            সংরক্ষিত প্রশাসনিক এলাকা। প্রবেশাধিকার শুধুমাত্র অনুমোদিত অ্যাডমিন ও ম্যানেজমেন্টের জন্য।
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-700/60 text-rose-300 rounded-2xl text-xs font-bold flex items-start gap-2 animate-in zoom-in-95">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              অ্যাডমিন ইমেইল / ইউজারনেম:
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@rongdhonustudio.com"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">
              পাসওয়ার্ড:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isLoading ? 'যাচাই করা হচ্ছে...' : 'অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন'}</span>
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-slate-800/80">
          নিরাপত্তা সতর্কতা: অননুমোদিত প্রবেশের চেষ্টা আইপি লগইন ট্র্যাকিং দ্বারা রেকর্ড করা হয়।
        </div>
      </div>
    </div>
  );
};
