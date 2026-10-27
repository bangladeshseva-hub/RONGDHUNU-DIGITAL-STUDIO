import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2, Clock, QrCode } from 'lucide-react';
import { WebsiteSettings, Order } from '../types';

interface PrintableSlipModalProps {
  order: Order | any;
  settings: WebsiteSettings;
  onClose: () => void;
  isOpen?: boolean;
}

export const PrintableSlipModal: React.FC<PrintableSlipModalProps> = ({
  order,
  settings,
  onClose,
  isOpen = true,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 print:shadow-none print:border-none print:p-2 print:max-w-none">
        
        {/* Modal Action Controls (Hidden when printing) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">অফিসিয়াল মানি রসিদ ও আবেদন স্লিপ</h3>
              <p className="text-xs text-slate-500">প্রিন্ট বা পিডিএফ হিসেবে সংরক্ষণ করুন</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট রসিদ (Print Slip)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CANVAS */}
        <div id="printable-receipt" className="border-2 border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 bg-white text-slate-900 font-sans print:border-2">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500 inline-block"></span>
              <span className="w-4 h-4 rounded-full bg-amber-400 inline-block"></span>
              <span className="w-4 h-4 rounded-full bg-emerald-500 inline-block"></span>
              <span className="w-4 h-4 rounded-full bg-sky-500 inline-block"></span>
              <span className="w-4 h-4 rounded-full bg-indigo-600 inline-block"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {settings.brandNameBn || 'রংধনু ডিজিটাল স্টুডিও'}
            </h1>
            <p className="text-xs uppercase font-bold tracking-widest text-slate-600">
              {settings.brandNameEn || 'RONGDHONU DIGITAL STUDIO'}
            </p>
            <p className="text-xs text-slate-600">
              {settings.addressBn || 'সদর রোড, ঢাকা ও সারাদেশে অনলাইন সেবা'} | হেল্পলাইন: {settings.phone} | WhatsApp: {settings.whatsapp}
            </p>
            <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
              অনলাইন সেবা ডেলিভারি ও মানি রসিদ (Official Customer Copy)
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <p><span className="font-bold text-slate-600">আবেদন ট্র্যাকিং নং:</span> <span className="font-mono font-bold text-slate-950 text-sm">{order.orderNumber}</span></p>
              <p><span className="font-bold text-slate-600">গ্রাহকের নাম:</span> <span className="font-bold text-slate-900">{order.customerName}</span></p>
              <p><span className="font-bold text-slate-600">মোবাইল নম্বর:</span> <span className="font-mono font-bold">{order.customerPhone}</span></p>
            </div>
            <div className="space-y-1 text-right">
              <p><span className="font-bold text-slate-600">আবেদনের তারিখ:</span> {new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><span className="font-bold text-slate-600">পেমেন্ট মেথড:</span> {order.paymentMethod?.toUpperCase()} (TrxID: {order.transactionId || 'WAL-PAID'})</p>
              <p>
                <span className="font-bold text-slate-600">বর্তমান স্ট্যাটাস:</span>{' '}
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {order.orderStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Service Details Table */}
          <div className="space-y-2">
            <table className="w-full text-xs text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-300">ক্রম</th>
                  <th className="p-2.5 border-r border-slate-300">ডিজিটাল সেবার বিবরণ</th>
                  <th className="p-2.5 border-r border-slate-300 text-center">পরিমাণ</th>
                  <th className="p-2.5 text-right">ফি (টাকা)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 border-r border-slate-200 font-bold text-center">০১</td>
                  <td className="p-2.5 border-r border-slate-200">
                    <p className="font-bold text-slate-900">{order.serviceNameBn}</p>
                    <p className="text-[10px] text-slate-500">{order.serviceNameEn}</p>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center font-bold">১ টি</td>
                  <td className="p-2.5 text-right font-bold text-slate-900 font-mono">৳{order.servicePrice}</td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold">
                <tr>
                  <td colSpan={3} className="p-2.5 text-right border-r border-slate-300">সর্বমোট পরিশোধিত ফি:</td>
                  <td className="p-2.5 text-right font-black font-mono text-sm text-slate-900">৳{order.servicePrice}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Verification & Seal */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-[11px]">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>কম্পিউটার জেনারেটেড ডিজিটাল ভেরিফাইড রসিদ</span>
              </div>
              <p className="text-slate-500 text-[10px]">
                অনলাইনে সরাসরি স্ট্যাটাস চেক করতে ভিজিট করুন: <span className="font-mono text-sky-700 font-bold">/track/{order.orderNumber}</span>
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-12 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 font-serif mx-auto">
                অফিসিয়াল সিল
              </div>
              <p className="font-bold text-slate-800 mt-1 border-t border-slate-400 pt-0.5">কর্তৃপক্ষের স্বাক্ষর</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
