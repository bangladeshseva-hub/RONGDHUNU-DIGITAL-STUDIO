import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  UserCheck,
  FileText
} from 'lucide-react';
import { OcrAnalysisRecord, Order } from '../../types';

interface OcrAssistantTabProps {
  token: string | null;
  ocrRecords: OcrAnalysisRecord[];
  orders: Order[];
  onRefresh: () => void;
}

export const OcrAssistantTab: React.FC<OcrAssistantTabProps> = ({
  token,
  ocrRecords,
  orders,
  onRefresh,
}) => {
  const [docType, setDocType] = useState<'bangladesh_nid' | 'birth_certificate' | 'e_tin' | 'passport'>('bangladesh_nid');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<OcrAnalysisRecord | null>(null);

  const handleRunOcr = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      const selectedOrder = orders.find((o) => o.id === selectedOrderId);
      const textToAnalyze = inputText || (selectedOrder ? JSON.stringify(selectedOrder.submissionData) : 'Name: Md. Mehedi Hasan, NID: 19961234567890123, DOB: 1996-04-12, Father: Abdul Karim');

      const res = await fetch('/api/ai/ocr-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentType: docType,
          rawText: textToAnalyze,
          orderId: selectedOrderId || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentResult(data);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApproveHumanGate = async (recordId: string) => {
    try {
      const res = await fetch(`/api/ocr/verify/${recordId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('মানব যাচাইকরণ (Human Gate) অনুমোদন সম্পন্ন হয়েছে!');
        onRefresh();
        if (currentResult && currentResult.id === recordId) {
          setCurrentResult({ ...currentResult, isHumanVerified: true });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <FileSearch className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              এআই ডকুমেন্ট ওসিআর ও কোয়ালিটি চেকার (AI Document OCR & Quality Assistant)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gemini Vision ও বাংলাদেশি ডকুমেন্ট ফিল্ড ডিটেক্টর দিয়ে এনআইডি, জন্মসনদ ও টিন সার্টিফিকেট স্বয়ংক্রিয় যাচাই
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>হিউম্যান ভেরিফিকেশন গেট সক্রিয়</span>
        </span>
      </div>

      {/* OCR Interactive Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Input & Trigger */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>নতুন ডকুমেন্ট ওসিআর বিশ্লেষণ চালান</span>
          </h3>

          <form onSubmit={handleRunOcr} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ডকুমেন্ট ক্যাটাগরি:</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              >
                <option value="bangladesh_nid">জাতীয় পরিচয়পত্র (Bangladesh National ID - NID)</option>
                <option value="birth_certificate">ডিজিটাল জন্ম নিবন্ধন সনদ (BDRIS Certificate)</option>
                <option value="e_tin">ই-টিআইএন সার্টিফিকেট (NBR e-TIN)</option>
                <option value="passport">বাংলাদেশি আন্তর্জাতিক পাসপোর্ট (Passport)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">বিদ্যমান অর্ডার থেকে নির্বাচন করুন (ঐচ্ছিক):</label>
              <select
                value={selectedOrderId}
                onChange={(e) => {
                  setSelectedOrderId(e.target.value);
                  const ord = orders.find((o) => o.id === e.target.value);
                  if (ord) {
                    setInputText(JSON.stringify(ord.submissionData, null, 2));
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              >
                <option value="">-- কাস্টম টেক্সট লিখুন অথবা ডেমো টেস্ট করুন --</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} — {o.serviceNameBn} ({o.customerName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ডকুমেন্ট টেক্সট / ওসিআর ইনপুট ডেটা:</label>
              <textarea
                rows={5}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Name: মোঃ মেহেদী হাসান
NID Number: 19961234567890123
Date of Birth: 12 Apr 1996
Father: আব্দুল করিম
Mother: ফাতেমা বেগম
Blood Group: B+"
                className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl font-mono text-xs focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>এআই বিশ্লেষণ চলমান...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>এআই ওসিআর অ্যানালাইসিস শুরু করুন</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Instant OCR Result Preview */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>শনাক্তকৃত তথ্যাবলী ও কোয়ালিটি স্কোর (Live Extraction)</span>
          </h3>

          {!currentResult ? (
            <div className="h-64 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs">
              <FileSearch className="w-10 h-10 text-slate-300 mb-2" />
              <p>বাম পাশ থেকে ডকুমেন্ট নির্বাচন করে অ্যানালাইসিস চালান।</p>
              <p className="text-[11px] mt-1 text-slate-400">এআই সনাক্তকৃত নাম, পিতা/মাতার নাম, জন্মতারিখ ও কোয়ালিটি স্কোর এখানে প্রদর্শিত হবে।</p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              {/* Quality Score Meter */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-600">ডকুমেন্ট ক্লিয়ারিটি ও কোয়ালিটি স্কোর:</span>
                  <p className="text-2xl font-black text-indigo-700">{currentResult.qualityScore}%</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    currentResult.qualityScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {currentResult.qualityScore >= 80 ? 'উচ্চ মানসম্পন্ন (High Quality)' : 'সতর্কতা: ঝাপসা হতে পারে'}
                  </span>
                </div>
              </div>

              {/* Detected Key Fields */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700">শনাক্তকৃত তথ্যসমূহ:</span>
                <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 text-xs">
                  {Object.entries(currentResult.detectedFields).length === 0 ? (
                    <p className="text-slate-400">কোনো তথ্য স্বয়ংক্রিয়ভাবে পড়া যায়নি।</p>
                  ) : (
                    Object.entries(currentResult.detectedFields).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span className="font-semibold text-slate-500 capitalize">{k}:</span>
                        <span className="font-bold text-slate-900 font-mono">{String(v)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Human Gate Verification Button */}
              <div className="pt-2">
                {currentResult.isHumanVerified ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>মানব যাচাইকরণ অনুমোদন সম্পন্ন! (Verified by Staff)</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApproveHumanGate(currentResult.id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>তথ্য সঠিক — মানব যাচাই অনুমোদন করুন (Approve Human Gate)</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OCR Analysis History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">পূর্ববর্তী ওসিআর স্ক্যান রেকর্ডসমূহ</h3>
          <span className="text-xs text-slate-400">{ocrRecords.length} টি রেকর্ড সংরক্ষিত</span>
        </div>

        {ocrRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">কোনো ওসিআর রেকর্ড নেই।</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {ocrRecords.map((rec) => (
              <div key={rec.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 uppercase">{rec.documentType}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                      স্কোর: {rec.qualityScore}%
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.isHumanVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.isHumanVerified ? `ভেরিফাইড (${rec.verifiedBy || 'Staff'})` : 'যাচাই অপেক্ষমান'}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    শনাক্ত: {Object.entries(rec.detectedFields).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                  </p>
                </div>

                {!rec.isHumanVerified && (
                  <button
                    onClick={() => handleApproveHumanGate(rec.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    অনুমোদন করুন
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
