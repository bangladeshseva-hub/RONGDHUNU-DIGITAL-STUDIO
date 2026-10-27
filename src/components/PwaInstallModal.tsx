import React from 'react';
import {
  X,
  Smartphone,
  Download,
  Share,
  PlusSquare,
  Monitor,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WebsiteSettings } from '../types';

interface PwaInstallModalProps {
  isOpen?: boolean;
  settings: WebsiteSettings;
  onClose: () => void;
  deferredPrompt: any;
  onInstalled?: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen = true,
  settings,
  onClose,
  deferredPrompt,
  onInstalled,
}) => {
  const { lang, t } = useLanguage();

  if (!isOpen) return null;

  const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isAndroid = /android/.test(window.navigator.userAgent.toLowerCase());

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        if (onInstalled) onInstalled();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
        
        {/* Header with App Branding */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-lg text-white">
                {lang === 'bn' ? settings.brandNameBn : settings.brandNameEn}
              </h3>
              <p className="text-xs text-sky-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('অফিসিয়াল ইনস্টলেবল PWA অ্যাপ', 'Official Installable PWA App')}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions Body */}
        <div className="p-6 space-y-5">
          
          {/* Quick Direct Install Button if supported */}
          {deferredPrompt && (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-center space-y-2">
              <p className="text-xs font-bold text-sky-950">
                {t('১-ক্লিকে সরাসরি ইনস্টল করুন:', 'Direct 1-Click Installation:')}
              </p>
              <button
                onClick={handleNativeInstall}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t('অ্যাপ ইনস্টল করুন (Install Now)', 'Install App Now')}</span>
              </button>
            </div>
          )}

          {/* iOS Safari Instructions */}
          {isIos && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span>{t('iPhone / iPad-এ হোম স্ক্রিনে যোগ করার নিয়ম:', 'How to Install on iPhone / iPad:')}</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ১
                  </span>
                  <p>
                    নিচে Safari ব্রাউজারের <strong className="text-slate-900">Share</strong> (শেয়ার <Share className="w-3.5 h-3.5 inline mx-0.5" />) আইকনে চাপ দিন।
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ২
                  </span>
                  <p>
                    মেনু থেকে <strong className="text-slate-900">Add to Home Screen</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-0.5" />) অপশনটি নির্বাচন করুন।
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ৩
                  </span>
                  <p>
                    ডানদিকের উপরে <strong className="text-purple-700">Add</strong> বাটনে ট্যাপ করলেই অ্যাপটি হোম স্ক্রিনে যোগ হয়ে যাবে!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Android Chrome Instructions */}
          {isAndroid && !deferredPrompt && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>{t('Android ফোনে ইনস্টল করার নিয়ম:', 'Android Chrome Instructions:')}</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p>১. Chrome ব্রাউজারের উপরে ডানদিকের তিনটি ডট (⋮) মেনুতে চাপ দিন।</p>
                <p>২. <strong>"Install app"</strong> অথবা <strong>"Add to Home Screen"</strong> নির্বাচন করুন।</p>
                <p>৩. নিশ্চিত করলে আপনার হোম স্ক্রিনে রংধনু অ্যাপের আইকন যুক্ত হবে।</p>
              </div>
            </div>
          )}

          {/* Desktop Computer Instructions */}
          {!isIos && !isAndroid && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Monitor className="w-4 h-4 text-indigo-600" />
                <span>{t('কম্পিউটার বা ল্যাপটপে ইনস্টল:', 'Desktop App Shortcut:')}</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <p>
                  ব্রাউজারের এড্রেস বারের ডানপাশে থাকা <strong className="text-slate-900">Install App</strong> আইকন অথবা মেনু থেকে <strong className="text-slate-900">"Create Shortcut"</strong> নির্বাচন করুন।
                </p>
                <p className="text-[11px] text-slate-500">
                  ইনস্টল করার পর কম্পিউটার চালু থাকলে সরাসরি ডেস্কটপ আইকন থেকে অ্যাপের মতো কাজ করবে।
                </p>
              </div>
            </div>
          )}

          {/* PWA Benefits */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              দ্রুতগতির লোডিং
            </span>
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
              অফলাইন ক্যাশিং
            </span>
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
              রিয়েল-টাইম নোটিফিকেশন
            </span>
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
              হোম স্ক্রিন শর্টকাট
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {t('ঠিক আছে, বুঝেছি', 'Got It')}
          </button>
        </div>
      </div>
    </div>
  );
};
