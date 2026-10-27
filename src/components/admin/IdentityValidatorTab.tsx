import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Copy,
  Check,
  Sparkles,
  Search
} from 'lucide-react';

export const IdentityValidatorTab: React.FC = () => {
  const [valType, setValType] = useState<'nid' | 'birth_reg' | 'tin' | 'passport'>('nid');
  const [inputValue, setInputValue] = useState('19961234567890123');
  const [result, setResult] = useState<any | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleValidate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    setIsValidating(true);
    setResult(null);

    try {
      const res = await fetch('/api/validate/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: valType, value: inputValue }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              স্মার্ট আইডেন্টিটি ও ফরম ভ্যালিডেটর (Smart Identity & Form Assistant)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            বাংলাদেশ জাতীয় পরিচয়পত্র, জন্ম নিবন্ধন, ই-টিআইএন এবং পাসপোর্ট নম্বরের বাস্তব ফরম্যাট যাচাই ও তথ্য সংক্ষেপণ
          </p>
        </div>
      </div>

      {/* Validator Lab Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 max-w-3xl">
        <form onSubmit={handleValidate} className="space-y-5">
          <div>
            <label className="block font-bold text-xs text-slate-700 mb-2">সনদপত্র বা পরিচয়পত্রের ধরন নির্বাচন করুন:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'nid', label: 'জাতীয় পরিচয়পত্র (NID)', example: '19961234567890123' },
                { id: 'birth_reg', label: 'জন্ম নিবন্ধন (BDRIS)', example: '20011234567890123' },
                { id: 'tin', label: 'ই-টিআইএন (e-TIN)', example: '123456789012' },
                { id: 'passport', label: 'বাংলাদেশ পাসপোর্ট', example: 'A01234567' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setValType(item.id as any);
                    setInputValue(item.example);
                    setResult(null);
                  }}
                  className={`p-3 rounded-2xl text-xs font-bold text-left border transition-all cursor-pointer ${
                    valType === item.id
                      ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p>{item.label}</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">উদাঃ {item.example}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-xs text-slate-700 mb-1">
              পরিচয়পত্র / সনদের নম্বর প্রবেশ করান:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="নম্বর লিখুন..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={isValidating}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>যাচাই করুন</span>
              </button>
            </div>
          </div>
        </form>

        {/* Validation Result Box */}
        {result && (
          <div className={`p-5 rounded-2xl border space-y-3 animate-in fade-in ${
            result.valid
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.valid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span className="font-bold text-sm">
                  {result.valid ? 'বৈধ আইডেন্টিটি নম্বর (Verified Valid Format)' : 'অবৈধ আইডেন্টিটি নম্বর (Invalid Format)'}
                </span>
              </div>

              {result.formattedValue && (
                <button
                  type="button"
                  onClick={() => handleCopy(result.formattedValue)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                </button>
              )}
            </div>

            <p className="text-xs leading-relaxed font-medium">{result.messageBn}</p>

            {result.valid && (
              <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/60 text-xs grid grid-cols-2 gap-2 text-slate-700 font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">ফরম্যাট টাইপ:</span>
                  <strong>{result.type}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">ফরম্যাটেড ভ্যালু:</span>
                  <strong>{result.formattedValue}</strong>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
