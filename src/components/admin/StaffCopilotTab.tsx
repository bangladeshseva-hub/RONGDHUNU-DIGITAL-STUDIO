import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertTriangle,
  HelpCircle,
  Clock,
  Send,
  Layers
} from 'lucide-react';
import { Order } from '../../types';

interface StaffCopilotTabProps {
  orders: Order[];
}

export const StaffCopilotTab: React.FC<StaffCopilotTabProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    step1: true,
    step2: false,
    step3: false,
    step4: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              স্মার্ট স্টাফ এআই কো-পাইলট (Smart Staff Copilot)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            অপারেটরদের জন্য সরকারি আবেদন প্রক্রিয়াকরণের ধাপে ধাপে নির্দেশনা, ত্রুটি শনাক্তকরণ ও সিদ্ধান্ত অনুমোদন সহকারী
          </p>
        </div>

        <span className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold shrink-0">
          অপারেটর অ্যাসিস্ট্যান্স
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Order Selector */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900">আবেদন নির্বাচন করুন</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {orders.map((o) => (
              <div
                key={o.id}
                onClick={() => setSelectedOrder(o)}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                  selectedOrder?.id === o.id
                    ? 'bg-purple-50 border-purple-400 text-purple-950 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-700">
                    {o.orderStatus}
                  </span>
                </div>
                <p className="mt-1 text-slate-900 font-bold">{o.serviceNameBn}</p>
                <p className="text-[10px] text-slate-400">গ্রাহক: {o.customerName}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Step-by-Step Operator Checklist */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          {selectedOrder ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-purple-700">{selectedOrder.orderNumber}</span>
                  <h3 className="font-bold text-base text-slate-900">{selectedOrder.serviceNameBn}</h3>
                  <p className="text-xs text-slate-500">গ্রাহক: {selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 font-mono">৳{selectedOrder.servicePrice}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">পেমেন্ট: {selectedOrder.paymentStatus}</span>
                </div>
              </div>

              {/* Copilot Guidance */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-purple-950">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>এআই কো-পাইলটের তাৎক্ষণিক পর্যবেক্ষণ:</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  গ্রাহকের প্রদানকৃত তথ্যের সাথে এনআইডি ও জন্মসাল সংগতিপূর্ণ। নির্বাচন কমিশনের সার্ভারে চালান ফি জমা দেওয়ার পূর্বে নামের বানান ও পিতা/মাতার নামের সাথে শিক্ষাগত সনদের মিল যাচাই করে নিন।
                </p>
              </div>

              {/* Operator Verification Checklist */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  প্রক্রিয়া সম্পন্নের বাধ্যতামূলক চেকলিস্ট (Human Operator Checklist):
                </h4>

                <div className="space-y-2 text-xs">
                  {[
                    { key: 'step1', title: '১. গ্রাহকের দাখিলকৃত নথিপত্রের মান পরীক্ষা (Quality Check)', desc: 'ফটো ও স্বাক্ষরের রেজোলিউশন ৩০০ ডিপিআই নিশ্চিত করা।' },
                    { key: 'step2', title: '২. সরকারি ডাটাবেজে রেকর্ড অনুসন্ধান ও চালান যাচাই', desc: 'অফিসিয়াল পোর্টালে সার্চ দিয়ে আগের কোনো আবেদন পেন্ডিং আছে কিনা যাচাই।' },
                    { key: 'step3', title: '৩. আবেদনপত্র খসড়া প্রিন্ট ও তথ্য ক্রস-চেক', desc: 'ইংরেজি ও বাংলা বানানে কোনো ফারাক না থাকার নিশ্চয়তা।' },
                    { key: 'step4', title: '৪. ফাইনাল ডেলিভারি ফাইল প্রস্তুত ও ডিজিটাল সিল সংযোজন', desc: 'গ্রাহকের জন্য ডাউনলোডযোগ্য পিডিএফ ফাইল ও রসিদ প্রস্তুত করা।' },
                  ].map((step) => (
                    <div
                      key={step.key}
                      onClick={() => toggleCheck(step.key)}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                        checklist[step.key]
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checklist[step.key]}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
                      />
                      <div>
                        <p className="font-bold">{step.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">কোনো অর্ডার নির্বাচন করা হয়নি।</div>
          )}
        </div>
      </div>
    </div>
  );
};
