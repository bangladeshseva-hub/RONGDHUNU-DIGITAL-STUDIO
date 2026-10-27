import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  MessageCircle,
  HelpCircle,
  Bot,
  User as UserIcon,
  PhoneCall,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { WebsiteSettings } from '../types';

interface CustomerAiConciergeProps {
  settings: WebsiteSettings;
}

export const CustomerAiConcierge: React.FC<CustomerAiConciergeProps> = ({ settings }) => {
  const { user, token } = useAuth();
  const { lang, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; text: string }[]>([
    {
      role: 'assistant',
      text: 'আসসালামু আলাইকুম! আমি রংধনু ডিজিটাল স্টুডিওর এআই ডিজিটাল সহকারী। জাতীয় পরিচয়পত্র, জন্ম নিবন্ধন, ই-টিআইএন, পাসপোর্ট বা আপনার বর্তমান অর্ডারের স্ট্যাটাস সম্পর্কে যেকোনো প্রশ্ন করতে পারেন। কীভাবে সাহায্য করতে পারি?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMsg;
    if (!textToSend.trim() || isLoading) return;

    if (!customPrompt) setInputMsg('');
    setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || 'ধন্যবাদ, আপনার প্রশ্নের উত্তর তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `সার্ভারে সংযোগে কিছুটা বিলম্ব হচ্ছে। জরুরি তথ্যের জন্য সরাসরি আমাদের অফিসিয়াল হোয়াটসঅ্যাপে যোগাযোগ করুন: ${settings.whatsapp}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 transition-all cursor-pointer border border-white/20"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-900 animate-pulse"></span>
          </div>
          <span className="font-bold text-xs sm:text-sm tracking-tight hidden sm:inline">
            {t('রংধনু ডিজিটাল সহকারী', 'Rongdhonu AI Assistant')}
          </span>
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[340px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm leading-tight">
                  {t('রংধনু স্মার্ট এআই কনসিয়ার্জ', 'Rongdhonu AI Concierge')}
                </h3>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {t('অনলাইন সহায়তা সক্রিয়', 'Live AI Assistance Active')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-sky-600 text-white rounded-br-none shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <span className="text-[10px] font-bold block mb-1 opacity-70">
                    {m.role === 'user' ? (user?.name || 'গ্রাহক') : 'রংধনু সহকারী'}
                  </span>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-sky-700 font-semibold p-1">
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce delay-200"></span>
                <span>তথ্য খোঁজা হচ্ছে...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSendMessage('এনআইডি রি-ইস্যুর ফি কত এবং কী কী কাগজপত্র লাগে?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 whitespace-nowrap transition-colors"
            >
              এনআইডি রি-ইস্যু খরচ?
            </button>
            <button
              onClick={() => handleSendMessage('আমার বর্তমান অর্ডারের সর্বশেষ অবস্থা বা খবর কী?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 whitespace-nowrap transition-colors"
            >
              আমার অর্ডার স্ট্যাটাস?
            </button>
            <button
              onClick={() => handleSendMessage('ই-পাসপোর্ট আবেদন করতে কত সময় লাগে?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 whitespace-nowrap transition-colors"
            >
              ই-পাসপোর্ট সময়?
            </button>
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="যেকোনো সেবা সম্পর্কে প্রশ্ন লিখুন..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMsg.trim()}
              className="p-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
