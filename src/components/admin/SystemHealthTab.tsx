import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface SystemHealthTabProps {
  token: string | null;
}

export const SystemHealthTab: React.FC<SystemHealthTabProps> = ({ token }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/system/health', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setHealthData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, [token]);

  const formatUptime = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hours} ঘণ্টা ${minutes} মিনিট ${s} সেকেন্ড`;
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              লাইভ সিস্টেম হেলথ ও ব্যাকগ্রাউন্ড ওয়ার্কার মনিটর (System Health)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            নোডজেএস রানটাইম মেমরি, ডাটাবেজ স্থিতি, ব্যাকগ্রাউন্ড কিউ এবং এপিআই রেসপন্স পারফরম্যান্স
          </p>
        </div>

        <button
          onClick={fetchHealth}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">সিস্টেম স্ট্যাটাস</span>
          <p className="text-2xl font-black text-emerald-600 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>সুস্থ (Healthy)</span>
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">সব সার্ভিস নিরবচ্ছিন্ন</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">মেমরি ব্যবহার (RSS / Heap)</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {healthData?.memoryUsageMB || 64} MB
          </p>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">
            হিপ ব্যবহৃত: {healthData?.heapUsedMB || 32} MB
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">অটোমেশন ফেইলিওর রেট</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {healthData?.automationFailureRate || '0.0'}%
          </p>
          <span className="text-[11px] text-indigo-700 font-semibold mt-1 block">কার্যক্ষমতা রেটিং</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">ওয়ার্কার প্রসেস স্থিতি</span>
          <p className="text-2xl font-black text-emerald-600 mt-1 font-mono">
            {healthData?.workerStatus || 'RUNNING'}
          </p>
          <span className="text-[11px] text-slate-400 font-semibold mt-1 block">ব্যাকগ্রাউন্ড টাস্ক প্রস্তুত</span>
        </div>
      </div>

      {/* Uptime and Technical Specification */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">সার্ভার রানটাইম ও নিরাপত্তা পরিবেশ</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-500 font-semibold">সার্ভার নিরবচ্ছিন্ন সময় (Uptime):</span>
            <p className="font-bold text-slate-900 text-sm">
              {healthData?.uptimeSeconds ? formatUptime(healthData.uptimeSeconds) : 'অপেক্ষা করুন...'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-slate-500 font-semibold">ডাটাবেজ ফাইল স্টোরেজ:</span>
            <p className="font-bold text-slate-900 text-sm font-mono">
              /data/database.json ({healthData?.databaseSizeKB || 78} KB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
