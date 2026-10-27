import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Plus,
  ShieldCheck,
  Check,
  X,
  Zap,
  Activity
} from 'lucide-react';
import { AutomationWorkflow, AutomationLog } from '../../types';

interface WorkflowDesignerTabProps {
  token: string | null;
  workflows: AutomationWorkflow[];
  automationLogs: AutomationLog[];
  onRefresh: () => void;
}

export const WorkflowDesignerTab: React.FC<WorkflowDesignerTabProps> = ({
  token,
  workflows,
  automationLogs,
  onRefresh,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState<'PAYMENT_VERIFIED' | 'ORDER_SUBMITTED' | 'ORDER_OVERDUE' | 'STATUS_CHANGED' | 'DAILY_SCHEDULE' | 'MANUAL_RUN'>('PAYMENT_VERIFIED');
  const [actionType, setActionType] = useState<'UPDATE_ORDER_STATUS' | 'NOTIFY_CUSTOMER' | 'ASSIGN_STAFF' | 'SEND_SMS_ALERT' | 'LOG_EVENT' | 'TRIGGER_OCR'>('UPDATE_ORDER_STATUS');
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [maxRetries, setMaxRetries] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLogTab, setActiveLogTab] = useState<'all' | 'failed'>('all');

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          trigger,
          requiresHumanApproval: requiresApproval,
          maxRetries,
          conditions: [
            { field: 'orderStatus', operator: 'equals', value: 'Pending' }
          ],
          actions: [
            { type: actionType, params: { note: 'স্বয়ংক্রিয় অটোমেশন অ্যাকশন' } }
          ],
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        setName('');
        setDescription('');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerWorkflow = async (id: string) => {
    try {
      const res = await fetch(`/api/workflows/${id}/trigger`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('অটোমেশন রুল সফলভাবে টেস্ট রান করা হয়েছে!');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (wf: AutomationWorkflow) => {
    try {
      await fetch(`/api/workflows/${wf.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !wf.isActive }),
      });
      onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRetryLog = async (logId: string) => {
    try {
      const res = await fetch(`/api/automation-logs/${logId}/retry`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('টাস্কটি সফলভাবে পুনরায় নির্বাহ করা হয়েছে!');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLogs = automationLogs.filter((l) => {
    if (activeLogTab === 'failed') return l.status === 'failed';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              সেলফ-বিল্ডিং অটোমেশন ও রুলস ডিজাইনার (Workflow Automation Engine)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ট্রিগার, কন্ডিশন, হিউম্যান অ্যাপ্রুভাল গেট এবং ফেইলিওর রিট্রাই পলিসিসহ নো-কোড ওয়ার্কফ্লো
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অটোমেশন রুল তৈরি</span>
        </button>
      </div>

      {/* Active Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className={`p-5 rounded-3xl border transition-all space-y-4 ${
              wf.isActive
                ? 'bg-white border-slate-200/90 shadow-xs hover:border-purple-300'
                : 'bg-slate-50/80 border-slate-200 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  {wf.trigger}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1.5">{wf.name}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">{wf.description || 'স্বয়ংক্রিয় ব্যাকগ্রাউন্ড ওয়ার্কফ্লো রুল'}</p>
              </div>

              <button
                onClick={() => handleToggleActive(wf)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  wf.isActive ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    wf.isActive ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Actions & Metadata */}
            <div className="space-y-1.5 text-[11px] border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-slate-600">
                <span>হিউম্যান অ্যাপ্রুভাল গেট:</span>
                <span className={`font-bold ${wf.requiresHumanApproval ? 'text-amber-600' : 'text-slate-400'}`}>
                  {wf.requiresHumanApproval ? 'অনুমোদন আবশ্যক' : 'স্বয়ংক্রিয় নির্বাহ'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>সর্বোচ্চ রিট্রাই সীমা:</span>
                <span className="font-mono font-bold">{wf.maxRetries || 3} বার</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>মোট নির্বাহ সংখ্যা:</span>
                <span className="font-bold text-purple-700">{wf.executionCount || 0} বার</span>
              </div>
            </div>

            {/* Trigger Button */}
            <button
              onClick={() => handleTriggerWorkflow(wf.id)}
              className="w-full py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>টেস্ট রান (Trigger Now)</span>
            </button>
          </div>
        ))}
      </div>

      {/* Automation Failure Monitor & Execution Logs */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs space-y-4">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>অটোমেশন ফেইলিওর মনিটর ও এক্সিকিউশন লগস (Execution Monitor)</span>
            </h3>
            <p className="text-xs text-slate-500">ব্যাকগ্রাউন্ড কাজের রিয়েল-টাইম স্ট্যাটাস ও ১-ক্লিকে রিট্রাই ব্যবস্থা</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveLogTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeLogTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সকল লগ ({automationLogs.length})
            </button>
            <button
              onClick={() => setActiveLogTab('failed')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeLogTab === 'failed' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              ব্যর্থ কাজ ({automationLogs.filter((l) => l.status === 'failed').length})
            </button>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            কোনো অটোমেশন ত্রুটি বা লগ রেকর্ড নেই। সিস্টেম স্বাভাবিক গতিতে চলছে।
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    log.status === 'success'
                      ? 'bg-emerald-100 text-emerald-700'
                      : log.status === 'failed'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {log.status === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{log.workflowName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {log.status === 'success' ? 'সফল (Success)' : 'ব্যর্থ (Failed)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{log.details}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                      <span>ট্রিগার: <strong className="font-mono text-slate-600">{log.triggerEvent}</strong></span>
                      <span>• সময়: {new Date(log.timestamp).toLocaleString('bn-BD')}</span>
                      {log.retryCount ? <span>• রিট্রাই: {log.retryCount} বার</span> : null}
                    </div>
                  </div>
                </div>

                {log.status === 'failed' && (
                  <button
                    onClick={() => handleRetryLog(log.id)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer shrink-0 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>পুনরায় চেষ্টা করুন</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Workflow Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">নতুন অটোমেশন রুল তৈরি করুন</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkflow} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ওয়ার্কফ্লোর নাম:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="উদাঃ পেমেন্ট ভেরিফিকেশন হলে স্বয়ংক্রিয় প্রসেসিং"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ট্রিগার ইভেন্ট (When Event Occurs):</label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-xs"
                >
                  <option value="PAYMENT_VERIFIED">PAYMENT_VERIFIED (পেমেন্ট নিশ্চিত হলে)</option>
                  <option value="ORDER_SUBMITTED">ORDER_SUBMITTED (নতুন অর্ডার জমা হলে)</option>
                  <option value="STATUS_CHANGED">STATUS_CHANGED (স্ট্যাটাস পরিবর্তিত হলে)</option>
                  <option value="ORDER_OVERDUE">ORDER_OVERDUE (ডেডলাইন অতিক্রম হলে)</option>
                  <option value="DAILY_SCHEDULE">DAILY_SCHEDULE (দৈনিক শিডিউল)</option>
                  <option value="MANUAL_RUN">MANUAL_RUN (ম্যানুয়াল ট্রিগার)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অ্যাকশন পাইপলাইন (Execute Action):</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-xs"
                >
                  <option value="UPDATE_ORDER_STATUS">UPDATE_ORDER_STATUS (অর্ডার স্ট্যাটাস আপডেট)</option>
                  <option value="ASSIGN_STAFF">ASSIGN_STAFF (উপযুক্ত কর্মীকে বণ্টন)</option>
                  <option value="TRIGGER_OCR">TRIGGER_OCR (এআই ডকুমেন্ট বিশ্লেষণ চালান)</option>
                  <option value="SEND_SMS_ALERT">SEND_SMS_ALERT (গ্রাহককে এসএমএস পাঠান)</option>
                  <option value="NOTIFY_CUSTOMER">NOTIFY_CUSTOMER (ইন-অ্যাপ নোটিফিকেশন)</option>
                  <option value="LOG_EVENT">LOG_EVENT (অডিট সিস্টেমে লগ করুন)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/60 border border-purple-200/60">
                <div>
                  <span className="font-bold text-purple-900 block">হিউম্যান অ্যাপ্রুভাল গেট</span>
                  <span className="text-[10px] text-purple-700">গুরুত্বপূর্ণ অ্যাকশনের আগে মানুষের চূড়ান্ত অনুমোদন বাধ্যতামূলক করা</span>
                </div>
                <input
                  type="checkbox"
                  checked={requiresApproval}
                  onChange={(e) => setRequiresApproval(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'রুল সক্রিয় করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
