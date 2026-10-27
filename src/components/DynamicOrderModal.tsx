import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle,
  Copy,
  AlertCircle,
  Upload,
  Sparkles,
  FileText,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Service, WebsiteSettings, Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface DynamicOrderModalProps {
  service: Service;
  settings: WebsiteSettings;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onOpenAuth: () => void;
}

export const DynamicOrderModal: React.FC<DynamicOrderModalProps> = ({
  service,
  settings,
  onClose,
  onOrderSuccess,
  onOpenAuth,
}) => {
  const { user, token, updateUserBalance } = useAuth();
  const { lang, t } = useLanguage();

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fileData, setFileData] = useState<{ fieldId: string; fileName: string; fileUrl: string }[]>([]);
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'bkash' | 'nagad' | 'rocket' | 'bank' | 'sandbox'>('wallet');
  const [transactionId, setTransactionId] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleFileUpload = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a web applet, we simulate safe document staging with file name & blob URL
      const mockUrl = URL.createObjectURL(file);
      setFileData((prev) => [
        ...prev.filter((f) => f.fieldId !== fieldId),
        { fieldId, fileName: file.name, fileUrl: mockUrl },
      ]);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      onOpenAuth();
      return;
    }

    // Validate required dynamic fields
    for (const f of service.fields) {
      if (f.required) {
        if (f.type === 'file') {
          const hasFile = fileData.some((fd) => fd.fieldId === f.id);
          if (!hasFile) {
            setErrorMsg(`'${lang === 'bn' ? f.labelBn : f.labelEn}' ফাইলটি আপলোড করা আবশ্যক।`);
            return;
          }
        } else if (!formData[f.id] || String(formData[f.id]).trim() === '') {
          setErrorMsg(`'${lang === 'bn' ? f.labelBn : f.labelEn}' তথ্যটি পূরণ করা আবশ্যক।`);
          return;
        }
      }
    }

    // Validate payment method
    if (paymentMethod === 'wallet') {
      if (user.walletBalance < service.price) {
        setErrorMsg(
          `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ব্যালেন্স: ৳${user.walletBalance}, প্রয়োজন: ৳${service.price}। বিকাশ/নগদ মাধ্যমে সরাসরি পেমেন্ট করুন অথবা ওয়ালেটে টাকা লোড করুন।`
        );
        return;
      }
    } else if (paymentMethod === 'sandbox') {
      // Instant automated sandbox verification
    } else {
      if (!transactionId.trim()) {
        setErrorMsg(`অনুগ্রহ করে ${paymentMethod.toUpperCase()} পেমেন্টের ট্রানজেকশন আইডি (TrxID) প্রদান করুন।`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payloadMethod = paymentMethod === 'sandbox' ? 'wallet' : paymentMethod;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: service.id,
          submissionData: formData,
          uploadedFiles: fileData,
          paymentMethod: payloadMethod,
          transactionId: paymentMethod === 'sandbox' ? `SANDBOX-AUTO-${Date.now().toString().slice(-6)}` : transactionId,
          customerNote,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে।');
      } else {
        if (paymentMethod === 'wallet' || paymentMethod === 'sandbox') {
          updateUserBalance(user.walletBalance - service.price);
        }
        onOrderSuccess(data);
      }
    } catch (err: any) {
      setErrorMsg('সার্ভারে যোগাযোগ করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header with Service Title & Price */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="space-y-1 pr-6">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
              {service.categoryNameBn}
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {lang === 'bn' ? service.nameBn : service.nameEn}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1 font-semibold text-emerald-300">
                <CreditCard className="w-3.5 h-3.5" />
                ফি: ৳{service.price}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                সময়: {lang === 'bn' ? service.estimatedTimeBn : service.estimatedTimeEn}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Instructions Box */}
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sky-950 mb-0.5">{t('নির্দেশিকা ও নিয়মাবলী:', 'Instructions & Requirements:')}</p>
              <p className="text-sky-800 leading-relaxed">{service.instructionsBn}</p>
            </div>
          </div>

          {/* User Sign-In Notice if guest */}
          {!user && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t('অর্ডার সম্পন্ন করতে এবং লাইভ ট্র্যাকিং দেখতে অনুগ্রহ করে সাইন ইন করুন।', 'Please sign in to complete your order and track status live.')}</span>
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors shrink-0"
              >
                {t('লগইন / রেজিস্টার', 'Login')}
              </button>
            </div>
          )}

          {/* Dynamic Service Form Fields */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>{t('প্রয়োজনীয় তথ্যাবলী পূরণ করুন', 'Fill Required Service Details')}</span>
            </h3>

            {service.fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {lang === 'bn' ? field.labelBn : field.labelEn}
                  {field.required && <span className="text-rose-500 ml-1">*</span>}
                </label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={lang === 'bn' ? field.placeholderBn : field.placeholderEn}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                )}

                {field.type === 'number' && (
                  <input
                    type="number"
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={lang === 'bn' ? field.placeholderBn : field.placeholderEn}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                )}

                {field.type === 'date' && (
                  <input
                    type="date"
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                )}

                {field.type === 'select' && (
                  <select
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="">{t('-- নির্বাচন করুন --', '-- Select Option --')}</option>
                    {field.options?.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'textarea' && (
                  <textarea
                    rows={2}
                    required={field.required}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={lang === 'bn' ? field.placeholderBn : field.placeholderEn}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                )}

                {field.type === 'file' && (
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t('ফাইল নির্বাচন করুন', 'Choose Document')}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(field.id, e)}
                      />
                    </label>
                    <span className="text-xs text-slate-500 truncate max-w-xs">
                      {fileData.find((f) => f.fieldId === field.id)?.fileName || t('কোনো ফাইল সিলেক্ট করা নেই', 'No file selected')}
                    </span>
                  </div>
                )}

                {field.helpTextBn && (
                  <p className="text-[11px] text-slate-500">{field.helpTextBn}</p>
                )}
              </div>
            ))}

            {/* Optional Customer Note */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-slate-700">
                {t('বিশেষ কোনো নির্দেশনা বা নোট (ঐচ্ছিক):', 'Special Note or Message (Optional):')}
              </label>
              <textarea
                rows={2}
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder={t('আপনার জরুরি কোনো মন্তব্য থাকলে এখানে লিখতে পারেন...', 'Any special instructions for our service desk...')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>{t('পেমেন্ট মাধ্যম নির্ধারণ করুন', 'Select Payment Method')}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              {/* Wallet Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-400/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Wallet className="w-4 h-4 text-sky-600" />
                  {paymentMethod === 'wallet' && <CheckCircle className="w-3.5 h-3.5 text-sky-600" />}
                </div>
                <p className="text-xs font-bold text-slate-900">{t('ওয়ালেট ব্যালেন্স', 'Wallet Balance')}</p>
                <p className="text-[11px] text-sky-700 font-semibold">
                  ৳{user?.walletBalance.toLocaleString() || 0}
                </p>
              </button>

              {/* bKash Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-500 bg-pink-50/80 ring-2 ring-pink-400/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-pink-600">bKash</span>
                  {paymentMethod === 'bkash' && <CheckCircle className="w-3.5 h-3.5 text-pink-600" />}
                </div>
                <p className="text-xs font-bold text-slate-900">{t('বিকাশ পেমেন্ট', 'bKash')}</p>
                <p className="text-[10px] text-slate-500">{t('মার্চেন্ট / সেন্ড মানি', 'Merchant / Send')}</p>
              </button>

              {/* Nagad Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-amber-600">নগদ</span>
                  {paymentMethod === 'nagad' && <CheckCircle className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <p className="text-xs font-bold text-slate-900">{t('নগদ পেমেন্ট', 'Nagad')}</p>
                <p className="text-[10px] text-slate-500">{t('ক্যাশআউট / সেন্ড মানি', 'Send Money')}</p>
              </button>

              {/* Sandbox Instant Gateway Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('sandbox')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'sandbox'
                    ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-400/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  {paymentMethod === 'sandbox' && <CheckCircle className="w-3.5 h-3.5 text-purple-600" />}
                </div>
                <p className="text-xs font-bold text-slate-900">{t('স্যান্ডবক্স টেস্ট', 'Sandbox Auto')}</p>
                <p className="text-[10px] text-purple-700 font-semibold">{t('তাত্ক্ষণিক ভেরিফাই', 'Instant Test')}</p>
              </button>
            </div>

            {/* Manual Payment Instructions for bKash/Nagad */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {paymentMethod === 'bkash' ? 'বিকাশ নম্বর:' : 'নগদ নম্বর:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {paymentMethod === 'bkash'
                        ? settings.paymentGateways.bkashNumber
                        : settings.paymentGateways.nagadNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          paymentMethod === 'bkash'
                            ? settings.paymentGateways.bkashNumber
                            : settings.paymentGateways.nagadNumber,
                          'num'
                        )
                      }
                      className="p-1 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Copy Number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {copiedField === 'num' && (
                  <p className="text-[11px] text-emerald-600 font-semibold text-right">নম্বর কপি হয়েছে!</p>
                )}

                <p className="text-xs text-slate-600">
                  {paymentMethod === 'bkash'
                    ? 'উক্ত নম্বরে বিকাশ অ্যাপ থেকে ৳' + service.price + ' সেন্ড মানি বা পেমেন্ট করে নিচে ট্রানজেকশন আইডি (TrxID) দিন।'
                    : 'উক্ত নম্বরে নগদ অ্যাপ থেকে ৳' + service.price + ' সেন্ড মানি করে নিচে ট্রানজেকশন আইডি (TrxID) প্রদান করুন।'}
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('ট্রানজেকশন আইডি (TrxID):', 'Transaction ID (TrxID):')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="উদাঃ BK9X7281A4"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono tracking-wider focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Pricing & Checkout Summary */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">{t('মোট প্রদেয় ফি:', 'Total Payable Fee:')}</span>
              <span className="text-xl font-black text-slate-900">৳{service.price}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {t('বাতিল', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t('অর্ডার প্রসেসিং হচ্ছে...', 'Processing Order...')}</span>
                ) : (
                  <>
                    <span>{t('অর্ডার নিশ্চিত করুন', 'Confirm & Submit Order')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
