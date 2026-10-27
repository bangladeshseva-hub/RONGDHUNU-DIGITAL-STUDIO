import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  Users,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  BarChart2,
  Activity
} from 'lucide-react';
import { Order } from '../../types';

interface PredictiveSlaTabProps {
  token: string | null;
  orders: Order[];
}

export const PredictiveSlaTab: React.FC<PredictiveSlaTabProps> = ({ token, orders }) => {
  const [slaData, setSlaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSlaData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analytics/predictive-sla', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSlaData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaData();
  }, [token, orders]);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              কাজের চাপ ও ডেডলাইন ইন্টেলিজেন্স (Predictive Workload & SLA Intelligence)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            অর্ডারের সময়সীমা ট্র্যাকিং, সম্ভাব্য বিলম্বের আগাম সতর্কতা এবং কর্মীদের সক্ষমতা ভারসাম্য বিশ্লেষণ
          </p>
        </div>

        <button
          onClick={fetchSlaData}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          রিফ্রেশ করুন
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">বিলম্বিত কাজ (Overdue)</span>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
            {slaData?.overdueCount || 0} টি
          </p>
          <span className="text-[11px] text-rose-700 font-semibold mt-1 block">ডেডলাইন অতিক্রম করেছে</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">ঝুঁকিপূর্ণ কাজ (At-Risk)</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
            {slaData?.atRiskCount || 0} টি
          </p>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">২৪ ঘণ্টার কম সময় বাকি</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">এসএলএ কমপ্লায়েন্স রেট</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            {slaData?.slaComplianceRate || 100}%
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">নির্ধারিত সময়ে ডেলিভারি</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold">গড় ডেলিভারি সময়কাল</span>
          <p className="text-2xl sm:text-3xl font-black text-sky-600 mt-1">
            ~{slaData?.avgCompletionHours || 4} ঘণ্টা
          </p>
          <span className="text-[11px] text-sky-700 font-semibold mt-1 block">আবেদন থেকে ফাইনাল ফাইল</span>
        </div>
      </div>

      {/* Bottleneck Warning */}
      {slaData?.predictedBottleneckStage && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-950 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">এআই প্রিডিকশন: সম্ভাব্য বিলম্বিত ধাপ (Predicted Bottleneck)</p>
              <p className="text-[11px] text-amber-800">{slaData.predictedBottleneckStage}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-200 text-amber-900 rounded-lg text-[10px] font-bold shrink-0">
            মনিটরিং সক্রিয়
          </span>
        </div>
      )}

      {/* Staff Capacity & Workload Balancing Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">কর্মীদের বর্তমান কাজের চাপ (Staff Workload Distribution)</h3>
          </div>
          <span className="text-xs text-slate-400">রিয়েল-টাইম ক্যাপাসিটি মনিটরিং</span>
        </div>

        {slaData?.staffWorkload && slaData.staffWorkload.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {slaData.staffWorkload.map((staff: any) => (
              <div key={staff.staffId} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{staff.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-mono">{staff.role}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-black text-sm text-slate-900">{staff.activeJobs} টি</span>
                    <span className="text-[10px] text-slate-400 block">চলমান কাজ</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    staff.capacityStatus === 'overloaded'
                      ? 'bg-rose-100 text-rose-800'
                      : staff.capacityStatus === 'optimal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {staff.capacityStatus === 'overloaded' ? 'অতিরিক্ত চাপ (Overloaded)' : staff.capacityStatus === 'optimal' ? 'অনুকূল (Optimal)' : 'উপলব্ধ (Available)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">কর্মী তালিকা লোড হচ্ছে...</div>
        )}
      </div>
    </div>
  );
};
