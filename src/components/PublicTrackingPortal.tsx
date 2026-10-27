import React, { useState, useEffect } from 'react';
import {
  Search,
  FileCheck2,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  RotateCcw,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  PhoneCall,
  ArrowRight
} from 'lucide-react';
import { WebsiteSettings } from '../types';
import { PrintableSlipModal } from './PrintableSlipModal';

interface PublicTrackingPortalProps {
  settings: WebsiteSettings;
  onExploreServices: () => void;
}

export const PublicTrackingPortal: React.FC<PublicTrackingPortalProps> = ({
  settings,
  onExploreServices,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [slipModalOpen, setSlipModalOpen] = useState(false);

  // Auto-search if demo query
  const handleSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch || searchQuery).trim();
    if (!q) {
      setErrorMsg('অনুগ্রহ করে আপনার অর্ডার নম্বর (যেমন: RDS-2026-1001) অথবা মোবাইল নম্বর লিখুন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setTrackingResult(null);

    try {
      const res = await fetch(`/api/public/track/${encodeURIComponent(q)}`);
      const data = await res.json();

      if (res.ok) {
        setTrackingResult(data);
      } else {
        setErrorMsg(data.error || 'আবেদন খুঁজে পাওয়া যায়নি।');
      }
    } catch {
      setErrorMsg('সার্ভারে যোগাযোগ করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDeliverable = (del: any) => {
    try {
      if (trackingResult?.id) {
        fetch(`/api/orders/${trackingResult.id}/track-download`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deliverableId: del.id }),
        }).catch(() => {});
      }
    } catch {}

    const link = document.createElement('a');
    link.href = del.fileUrl || del.downloadUrl;
    link.download = del.fileName || del.title || 'document';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl text-center space-y-4 border border-indigo-900/40">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-lg">
          <FileCheck2 className="w-7 h-7" />
        </div>
        <div className="max-w-xl mx-auto space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            অনলাইন আবেদন ট্র্যাকিং পোর্টাল
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            আপনার অর্ডার নম্বর (যেমন: <span className="font-mono text-sky-300 font-bold">RDS-2026-1001</span>) অথবা মোবাইল নম্বর দিয়ে রিয়েল-টাইমে কাজের অগ্রগতি জানুন।
          </p>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="max-w-lg mx-auto flex flex-col sm:flex-row gap-2 pt-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অর্ডার নং (RDS-...) বা মোবাইল নম্বর লিখুন..."
              className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none shadow-md"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>ট্র্যাক করুন</span>
          </button>
        </form>

        {/* Sample Demo Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-300">
          <span>দ্রুত ডেমো চেক:</span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('RDS-2026-1001');
              handleSearch('RDS-2026-1001');
            }}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200 font-mono transition-colors"
          >
            RDS-2026-1001
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('01912345678');
              handleSearch('01912345678');
            }}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sky-200 font-mono transition-colors"
          >
            01912-345678
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search Result Card */}
      {trackingResult && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-slate-900">{trackingResult.orderNumber}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  trackingResult.orderStatus === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : trackingResult.orderStatus === 'Processing'
                    ? 'bg-sky-100 text-sky-800 border border-sky-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {trackingResult.orderStatus}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  পেমেন্ট: {trackingResult.paymentStatus} ({trackingResult.paymentMethod})
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">{trackingResult.serviceNameBn}</h2>
              <p className="text-xs text-slate-500">গ্রাহক: {trackingResult.customerName} ({trackingResult.customerPhone})</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSlipModalOpen(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>মানি রসিদ প্রিন্ট</span>
              </button>
            </div>
          </div>

          {/* Deliverables Download (if completed) */}
          {trackingResult.deliverables && trackingResult.deliverables.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">আপনার প্রস্তুতকৃত ফাইল ডাউনলোড উপযোগী</h4>
                  <p className="text-[10px] text-emerald-700">নীচের বাটন থেকে অফিশিয়াল কপি ডাউনলোড করুন</p>
                </div>
              </div>

              <div className="space-y-2">
                {trackingResult.deliverables.map((del: any, idx: number) => (
                  <div
                    key={del.id || idx}
                    className="bg-white p-3 rounded-xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white">
                          v{del.version || idx + 1}
                        </span>
                        <p className="text-xs font-bold text-slate-900">{del.title}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {del.fileName} • {del.fileSize || 'PDF Document'} • {del.downloadCount || 0} বার ডাউনলোড
                      </p>
                    </div>

                    <button
                      onClick={() => handleDownloadDeliverable(del)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ডাউনলোড করুন</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Timeline History */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              লাইভ অগ্রগতি ইতিহাস (Status Timeline)
            </h3>
            <div className="space-y-3 pl-3 border-l-2 border-indigo-200">
              {trackingResult.statusHistory.map((item: any, idx: number) => (
                <div key={idx} className="relative text-xs space-y-0.5">
                  <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 ring-4 ring-white"></span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.status}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.timestamp).toLocaleString('bn-BD')}
                    </span>
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">
                      আপডেটকারী: {item.updatedBy}
                    </span>
                  </div>
                  <p className="text-slate-600">{item.noteBn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {slipModalOpen && trackingResult && (
        <PrintableSlipModal
          order={trackingResult}
          settings={settings}
          onClose={() => setSlipModalOpen(false)}
        />
      )}
    </div>
  );
};
