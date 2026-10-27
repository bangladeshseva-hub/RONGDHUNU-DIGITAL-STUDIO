import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  Smartphone,
  Plus,
  Clock,
  Check,
  X
} from 'lucide-react';
import { CommunicationLog } from '../../types';

interface OmnichannelTabProps {
  token: string | null;
  logs: CommunicationLog[];
  onRefresh: () => void;
}

export const OmnichannelTab: React.FC<OmnichannelTabProps> = ({
  token,
  logs,
  onRefresh,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [channel, setChannel] = useState<'sms' | 'whatsapp' | 'email' | 'in_app'>('sms');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !content.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/communications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          channel,
          recipient,
          recipientName: recipientName || recipient,
          content,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        setRecipient('');
        setRecipientName('');
        setContent('');
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              অমনিচ্যানেল কমিউনিকেশন সেন্টার (Omnichannel Communication Center)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            গ্রাহকদের সরাসরি বাংলা এসএমএস, হোয়াটসঅ্যাপ নোটিফিকেশন ও ইন-অ্যাপ অ্যালার্ট প্রেরণ ও ট্র্যাকিং হিস্ট্রি
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer shrink-0 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>মেসেজ পাঠান</span>
        </button>
      </div>

      {/* Communication Transmission Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">মেসেজ ট্রান্সমিশন ও ডেলিভারি হিস্ট্রি</h3>
          <span className="text-xs text-slate-400">{logs.length} টি রেকর্ড</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">কোনো মেসেজ রেকর্ড নেই।</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/80 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    item.channel === 'sms'
                      ? 'bg-blue-100 text-blue-700'
                      : item.channel === 'whatsapp'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {item.channel === 'sms' ? <Smartphone className="w-4 h-4" /> : item.channel === 'whatsapp' ? <MessageSquare className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.recipientName}</span>
                      <span className="font-mono text-slate-500">({item.recipient})</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {item.channel}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 leading-relaxed">{item.content}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span>{new Date(item.createdAt).toLocaleString('bn-BD')}</span>
                      {item.costBDT ? <span>• খরচ: ৳{item.costBDT}</span> : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Message Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in zoom-in-95">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">গ্রাহককে সরাসরি বার্তা পাঠান</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">কমিউনিকেশন চ্যানেল:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sms', label: 'এসএমএস (SMS)' },
                    { id: 'whatsapp', label: 'WhatsApp' },
                    { id: 'in_app', label: 'ইন-অ্যাপ' },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setChannel(ch.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        channel === ch.id
                          ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রাপকের মোবাইল নম্বর / আইডি:</label>
                <input
                  type="text"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="01912345678"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">গ্রাহকের নাম (ঐচ্ছিক):</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="উদাঃ মোঃ মেহেদী হাসান"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বার্তার বিষয়বস্তু:</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="আপনার এনআইডি সংশোধনের কাজটি সফলভাবে সম্পন্ন হয়েছে..."
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs"
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
                  disabled={isSending}
                  className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSending ? 'পাঠানো হচ্ছে...' : 'পাঠান'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
