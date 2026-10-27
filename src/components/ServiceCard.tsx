import React from 'react';
import {
  CreditCard,
  Edit3,
  Baby,
  Receipt,
  FileText,
  MapPin,
  Car,
  Zap,
  Send,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Service } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  CreditCard: <CreditCard className="w-5 h-5" />,
  Edit3: <Edit3 className="w-5 h-5" />,
  Baby: <Baby className="w-5 h-5" />,
  Receipt: <Receipt className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Send: <Send className="w-5 h-5" />,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/90 hover:border-sky-300 p-4 sm:p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top badges */}
      <div className="flex items-center justify-between gap-1 mb-3">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          {service.categoryNameBn}
        </span>
        <div className="flex items-center gap-1">
          {service.isFeatured && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {t('স্পেশাল', 'Featured')}
            </span>
          )}
          {service.isPopular && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {t('জনপ্রিয়', 'Popular')}
            </span>
          )}
        </div>
      </div>

      {/* Main Service Content */}
      <div className="flex-1 space-y-2.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
            {iconMap[service.iconName] || <FileText className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">
              {lang === 'bn' ? service.nameBn : service.nameEn}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium block">
              {service.nameEn}
            </span>
          </div>
        </div>

        <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
          {lang === 'bn' ? service.descriptionBn : service.descriptionEn}
        </p>

        {/* Turnaround Time info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="font-medium">
            {t('সময়সীমা:', 'Delivery:')} {lang === 'bn' ? service.estimatedTimeBn : service.estimatedTimeEn}
          </span>
        </div>
      </div>

      {/* Footer: Price & Order Action Button */}
      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-slate-900">
              ৳{service.price}
            </span>
            {service.originalPrice && service.originalPrice > service.price && (
              <span className="text-xs text-slate-400 line-through">
                ৳{service.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            {t('নিশ্চিত ডেলিভারি স্লিপ', 'Verified Slip')}
          </span>
        </div>

        <button
          onClick={() => onSelect(service)}
          className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>{t('সেবা নিন', 'Order Now')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
