import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Save,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminCredentialsTabProps {
  token: string | null;
}

export const AdminCredentialsTab: React.FC<AdminCredentialsTabProps> = ({ token }) => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsernameOrEmail, setNewUsernameOrEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!currentPassword) {
      setErrorMsg('অনুগ্রহ করে বর্তমান পাসওয়ার্ড লিখুন।');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('নতুন পাসওয়ার্ড সর্বনিম্ন ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('নতুন পাসওয়ার্ড ও নিশ্চিতকরণ পাসওয়ার্ড মেলেনি।');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/change-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newUsernameOrEmail,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('অ্যাডমিন ইউজারনেম ও পাসওয়ার্ড সফলভাবে হালনাগাদ করা হয়েছে!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(data.error || 'ক্রেডেনশিয়াল পরিবর্তন করতে ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারে যোগাযোগ করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              অ্যাডমিন একাউন্ট ইউজারনেম ও পাসওয়ার্ড পরিবর্তন
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            আপনার অ্যাডমিন একাউন্টের লগইন তথ্য অত্যন্ত গোপনীয়। সময়সূচী অনুযায়ী পাসওয়ার্ড পরিবর্তন করা নিরাপদ।
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Security Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3 p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl">
          <ShieldCheck className="w-6 h-6 text-purple-700 shrink-0" />
          <div className="text-xs text-purple-950">
            <p className="font-bold">লগইন ব্যবহারকারী: {user?.name}</p>
            <p className="text-[11px] text-purple-800">ভূমিকা: {user?.role} (সর্বোচ্চ অ্যাডমিন সুবিধা)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              লগইন ইমেইল / ইউজারনেম:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={newUsernameOrEmail}
                onChange={(e) => setNewUsernameOrEmail(e.target.value)}
                placeholder="admin@rongdhonustudio.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              বর্তমান পাসওয়ার্ড (যাচাইকরণের জন্য):
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                নতুন পাসওয়ার্ড:
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="নতুন শক্তিশালী পাসওয়ার্ড"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                নতুন পাসওয়ার্ড নিশ্চিতকরণ:
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="পুনরায় একই পাসওয়ার্ড লিখুন"
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'পাসওয়ার্ড সুরক্ষিতভাবে পরিবর্তন করুন'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
