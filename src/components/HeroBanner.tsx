import React from 'react';
import { Sparkles, ShieldCheck, Zap, Clock, ArrowRight, Award, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WebsiteSettings } from '../types';

interface HeroBannerProps {
  settings: WebsiteSettings;
  onExploreClick: () => void;
  onSelectCategory: (catId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  settings,
  onExploreClick,
  onSelectCategory,
}) => {
  const { lang, t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/50">
      {/* Dynamic Rainbow Glow Orbs */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{t('রংধনু ডিজিটাল স্টুডিও — নাগরিক সেবার ডিজিটাল ঠিকানা', 'Rongdhonu Digital Studio — Digital Service Portal')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {lang === 'bn' ? (
                <>
                  ঘরে বসেই সকল সরকারি ও ডিজিটাল সেবা নিন{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300">
                    সহজে ও নির্ভুলভাবে
                  </span>
                </>
              ) : (
                <>
                  Fast, Secure & Verified Citizen Digital Services{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300">
                    From Home
                  </span>
                </>
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              {lang === 'bn'
                ? 'এনআইডি সংশোধন, হারানো কার্ড রি-ইস্যু, ডিজিটাল জন্ম নিবন্ধন, ই-টিআইএন সনদ, ই-পাসপোর্ট আবেদন, জমির পর্চা (খতিয়ান) ও ইউটিলিটি বিল পরিশোধের নির্ভরযোগ্য ওয়ান-স্টপ হাব।'
                : 'Your trusted digital portal for NID reissue, online birth certificate, e-TIN certificate, e-Passport applications, land Khatian porcha, and verified utility assistance.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t('সকল সেবা দেখুন', 'Explore All Services')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base rounded-2xl border border-white/15 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{t('জরুরি হোয়াটসঅ্যাপ সাপোর্ট', 'WhatsApp Live Support')}</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">
                  {t('১০০% নিরাপদ প্রক্রিয়া', '100% Safe Process')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">
                  {t('দ্রুততম ডেলিভারি স্লিপ', 'Fastest Turnaround')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">
                  {t('সার্বক্ষণিক সহায়তা', '24/7 Dedicated Support')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual Card: Live Highlights */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-indigo-950/90 border border-slate-700/60 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-bold text-slate-200">
                    {t('জনপ্রিয় তাৎক্ষণিক সেবাসমূহ', 'Popular Instant Services')}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800">
                  {t('আজকের অফার', 'Today Promo')}
                </span>
              </div>

              {/* Quick Service Teasers */}
              <div className="space-y-3 pt-4">
                <div
                  onClick={() => onSelectCategory('cat_nid')}
                  className="p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700/50 flex items-center justify-between cursor-pointer transition-all hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm">
                      NID
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">এনআইডি কার্ড হারানো রি-ইস্যু আবেদন</p>
                      <p className="text-[11px] text-slate-400">ডেলিভারি: ১-২ কর্মদিবস</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">৳২৫০</span>
                    <span className="text-[10px] text-slate-500 line-through block">৳৩৫০</span>
                  </div>
                </div>

                <div
                  onClick={() => onSelectCategory('cat_tax')}
                  className="p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700/50 flex items-center justify-between cursor-pointer transition-all hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                      TIN
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">ই-টিআইএন সনদপত্র ইনস্ট্যান্ট ডাউনলোড</p>
                      <p className="text-[11px] text-slate-400">ডেলিভারি: ৩০ মিনিট</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">৳১৫০</span>
                    <span className="text-[10px] text-slate-500 line-through block">৳২০০</span>
                  </div>
                </div>

                <div
                  onClick={() => onSelectCategory('cat_passport')}
                  className="p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700/50 flex items-center justify-between cursor-pointer transition-all hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                      PASS
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">ই-পাসপোর্ট অনলাইন আবেদন ও এ-চালান</p>
                      <p className="text-[11px] text-slate-400">ডেলিভারি: ২-৪ ঘণ্টা</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400">৳৪৫০</span>
                    <span className="text-[10px] text-slate-500 line-through block">৳৬০০</span>
                  </div>
                </div>
              </div>

              {/* Supported Payment Logos preview */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>{t('গৃহীত পেমেন্ট মাধ্যম:', 'Accepted Payment:')}</span>
                <span className="font-semibold text-slate-300">
                  বিকাশ • নগদ • রকেট • ব্যাংক
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
