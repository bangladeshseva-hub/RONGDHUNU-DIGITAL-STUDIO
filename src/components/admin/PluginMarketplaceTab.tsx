import React from 'react';
import {
  Plug,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Check,
  Send,
  MessageSquare,
  Printer,
  ShieldAlert,
  Mic,
  FileSearch
} from 'lucide-react';
import { PluginItem } from '../../types';

interface PluginMarketplaceTabProps {
  token: string | null;
  plugins: PluginItem[];
  onRefresh: () => void;
}

export const PluginMarketplaceTab: React.FC<PluginMarketplaceTabProps> = ({
  token,
  plugins,
  onRefresh,
}) => {
  const handleToggle = async (pluginId: string) => {
    try {
      const res = await fetch(`/api/plugins/${pluginId}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSearch':
        return <FileSearch className="w-5 h-5 text-sky-600" />;
      case 'Mic':
        return <Mic className="w-5 h-5 text-purple-600" />;
      case 'Printer':
        return <Printer className="w-5 h-5 text-emerald-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'Send':
        return <Send className="w-5 h-5 text-indigo-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      default:
        return <Plug className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Plug className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              ফিউচার প্লাগইন ও এক্সটেনশন মার্কেটপ্লেস (Plugin Marketplace)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            মডিউলার আর্কিটেকচার — প্রয়োজন অনুযায়ী এআই, মেসেজিং, প্রিন্ট ও সিকিউরিটি ফিচার ১-ক্লিকে অন/অফ নিয়ন্ত্রণ
          </p>
        </div>

        <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold shrink-0">
          Super Admin নিয়ন্ত্রিত
        </span>
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              plugin.isEnabled
                ? 'bg-white border-slate-200/90 shadow-xs hover:border-indigo-300'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(plugin.icon)}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">v{plugin.version}</span>
                  <button
                    onClick={() => handleToggle(plugin.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      plugin.isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        plugin.isEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">{plugin.nameBn}</h3>
                <p className="text-[11px] text-slate-400 font-medium">{plugin.nameEn}</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{plugin.descriptionBn}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="capitalize">ক্যাটাগরি: {plugin.category}</span>
              <span className={`font-bold ${plugin.isEnabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                {plugin.isEnabled ? '● সক্রিয় (Enabled)' : '○ নিষ্ক্রিয় (Disabled)'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
