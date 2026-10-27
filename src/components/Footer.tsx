import React from 'react';
import { PhoneCall, Mail, MapPin, Sparkles, ShieldCheck, Heart, Lock, ExternalLink } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  settings: WebsiteSettings;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenPrivacy, onOpenTerms, onOpenAdminLogin }) => {
  const { lang, t } = useLanguage();

  const socialLinksList = settings.socialMediaLinks || [
    { id: '1', platform: 'facebook', title: 'Facebook', url: settings.socialLinks?.facebook || 'https://facebook.com/rongdhonustudio', isActive: true },
    { id: '2', platform: 'whatsapp', title: 'WhatsApp', url: `https://wa.me/${settings.whatsapp || '8801632042441'}`, isActive: true },
    { id: '3', platform: 'youtube', title: 'YouTube', url: settings.socialLinks?.youtube || 'https://youtube.com', isActive: true },
    { id: '4', platform: 'telegram', title: 'Telegram', url: settings.socialLinks?.telegram || 'https://t.me', isActive: true },
  ];

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-pink-500 p-0.5 flex items-center justify-center shadow-lg">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                {lang === 'bn' ? settings.brandNameBn : settings.brandNameEn}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {lang === 'bn'
                ? 'বাংলাদেশের নাগরিকদের জন্য ওয়ান-স্টপ বিশ্বস্ত অনলাইন সার্ভিস হাব। নির্বাচন কমিশন, জন্ম নিবন্ধন, এনবিআর এবং সরকারি ফরম নির্ভুলভাবে পূরণের পেশাদার সহায়তা কেন্দ্র।'
                : 'Your trusted one-stop digital service hub in Bangladesh for NID, birth registration, e-TIN, land porcha, and official portal application guidance.'}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>হটলাইন ও হোয়াটসঅ্যাপ: <strong className="text-white">{settings.whatsapp}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>ইমেইল: <strong className="text-white">{settings.email}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>{settings.addressBn}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">সোশ্যাল মিডিয়া সংযুক্ত থাকুন:</p>
              <div className="flex flex-wrap gap-2">
                {socialLinksList.filter(s => s.isActive !== false).map((soc, idx) => (
                  <a
                    key={soc.id || idx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span>{soc.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Service Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
              {t('জনপ্রিয় সেবাসমূহ', 'Popular Services')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#services" className="hover:text-white transition-colors">এনআইডি কার্ড সংশোধন ও রি-ইস্যু</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">অনলাইন জন্ম নিবন্ধন যাচাই</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">তাত্ক্ষণিক ই-টিআইএন সার্টিফিকেট</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">ই-পাসপোর্ট আবেদন ও এ-চালান</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">জমির খতিয়ান ও পর্চা কপি</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">ইউটিলিটি ও পল্লী বিদ্যুৎ বিল</a></li>
            </ul>
          </div>

          {/* Security & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
              {t('নীতিমালা ও নিরাপত্তা', 'Security & Policy')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-white transition-colors cursor-pointer">
                  {t('গোপনীয়তা নীতিমালা (Privacy Policy)', 'Privacy Policy')}
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-white transition-colors cursor-pointer">
                  {t('ব্যবহারের শর্তাবলী (Terms & Conditions)', 'Terms of Service')}
                </button>
              </li>
              <li>
                <span className="text-emerald-400 font-medium">✓ ২৫৬-বিট এসএসএল সুরক্ষিত</span>
              </li>
              <li>
                <span className="text-sky-400 font-medium">✓ সরকারি ফি সরাসরি জমা</span>
              </li>
              <li>
                <span className="text-purple-400 font-medium">✓ নিজস্ব কোনো পিন সংরক্ষণ নেই</span>
              </li>
            </ul>
          </div>

          {/* Payment Gateways accepted */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
              {t('নিরাপদ পেমেন্ট মাধ্যম', 'Payment Accepted')}
            </h4>
            <p className="text-[11px] text-slate-400">
              আমরা নিম্নলিখিত নিরাপদ মোবাইল ব্যাংকিং ও ব্যাংক ট্রান্সফার গ্রহণ করি:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-pink-950/80 border border-pink-700/60 text-pink-400 font-bold text-xs">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-amber-950/80 border border-amber-700/60 text-amber-400 font-bold text-xs">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-700/60 text-purple-400 font-bold text-xs">
                Rocket
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-700/60 text-blue-400 font-bold text-xs">
                Bank Transfer
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed text-center sm:text-left">
          <p className="font-semibold text-slate-300 mb-1">
            ⚠️ {t('আইনি বিবৃতি ও স্বত্বাধিকার:', 'Official Legal Disclosure:')}
          </p>
          <p>
            {lang === 'bn'
              ? 'রংধনু ডিজিটাল স্টুডিও একটি স্বাধীন ও নিবন্ধিত ডিজিটাল সার্ভিস পয়েন্ট। আমরা নাগরিকদের সরকারি ও বেসরকারি অনলাইন পোর্টালের আবেদন ফরম পূরণ, এ-চালান ফি পরিশোধ এবং প্রযুক্তিগত সহায়তা প্রদান করে থাকি। আমরা কোনো সরকারি সংস্থা নই এবং সরকারি অনুমোদনের নিশ্চয়তা প্রদান করি না। সকল সিদ্ধান্ত ও চূড়ান্ত অনুমোদন সংশ্লিষ্ট সরকারি কর্তৃপক্ষ দ্বারা নিয়ন্ত্রিত হয়।'
              : 'Rongdhonu Digital Studio is an independent citizen digital service center assisting customers with verified form-filling, A-Challan fee deposits, and document formatting. We do not claim government affiliation; official approvals remain strictly at the discretion of respective state authorities.'}
          </p>
        </div>

        {/* Bottom Copyright & Discrete Admin Login Icon */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            © {new Date().getFullYear()} {settings.brandNameBn} ({settings.brandNameEn})। সর্বস্বত্ব সংরক্ষিত।
          </p>
          
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1 text-[11px]">
              <span>বাংলাদেশে তৈরি • ভালোবাসার সাথে</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            </p>

            {/* Discrete Admin Login Button at Bottom Corner */}
            <button
              onClick={onOpenAdminLogin}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer opacity-70 hover:opacity-100"
              title="অ্যাডমিন প্যানেলে নিরাপদ প্রবেশ"
            >
              <Lock className="w-3 h-3 text-indigo-400" />
              <span>অ্যাডমিন লগইন</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
