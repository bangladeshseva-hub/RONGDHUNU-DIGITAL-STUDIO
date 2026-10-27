import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Zap,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { ApiIntegration } from '../../types';

interface ApiHubTabProps {
  token: string | null;
  integrations: ApiIntegration[];
  onRefresh: () => void;
}

export const ApiHubTab: React.FC<ApiHubTabProps> = ({
  token,
  integrations,
  onRefresh,
}) => {
  const [pingingId, setPingingId] = useState<string | null>(null);

  const handlePing = async (id: string) => {
    setPingingId(id);
    try {
      const res = await fetch(`/api/integrations/${id}/ping`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPingingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Server className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              সিকিউর এপিআই ও সরকারি পোর্টাল ইন্টিগ্রেশন হাব (Secure API Integration Hub)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            বাংলাদেশ নির্বাচন কমিশন এনআইডি, রাজস্ব বোর্ড ই-টিআইএন, বিডিআরআইএস, পাসপোর্ট ও মোবাইল ব্যাংকিং গেটওয়ের বাস্তব স্থিতি
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>সার্ভার-সাইড সিকিউরিটি সক্রিয়</span>
        </span>
      </div>

      {/* Notice Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 text-blue-950 text-xs leading-relaxed flex items-center justify-between gap-4">
        <p>
          🔒 <strong>সতর্কতা ও নীতি:</strong> সংবেদনশীল সরকারি আবেদন ও পেমেন্ট গেটওয়েতে কোনো অস্তিত্বহীন ভুয়া স্ট্যাটাস দেখানো হয় না। সরকারি সার্ভার যদি ডিরেক্ট ওয়েব পোর্টাল রিকয়ার করে, তবে অপারেটরদের সুবিধার্থে সরাসরি নিরাপদ অফিসিয়াল লিংক প্রদান করা হয়েছে।
        </p>
      </div>

      {/* Grid of Gateways */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                  {item.category.replace('_', ' ')}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : item.status === 'configured'
                    ? 'bg-sky-100 text-sky-800 border border-sky-200'
                    : item.status === 'demo_mode'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.status === 'active' ? 'সক্রিয় (Active)' : item.status === 'configured' ? 'কনফিগার করা (Configured)' : 'ডেমো মোড (Sandbox)'}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug">{item.nameBn}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.portalDescriptionBn}</p>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3 text-[11px]">
              <div className="flex items-center justify-between text-slate-500">
                <span>লেটেন্সি (Latency):</span>
                <span className="font-mono font-bold text-slate-800">
                  {item.latencyMs ? `${item.latencyMs} ms` : 'স্বাভাবিক'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>সর্বশেষ পিং:</span>
                <span className="text-[10px] text-slate-400">
                  {item.lastPingTimestamp ? new Date(item.lastPingTimestamp).toLocaleTimeString('bn-BD') : 'এখনই'}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                  <span>অফিসিয়াল পোর্টাল</span>
                </a>

                <button
                  onClick={() => handlePing(item.id)}
                  disabled={pingingId === item.id}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                  title="টেস্ট পিং চালান"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${pingingId === item.id ? 'animate-spin' : ''}`} />
                  <span>পিং</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
