import React from 'react';
import {
  Globe,
  ExternalLink,
  Phone,
  FileText,
  CheckCircle2,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { OfficialGovDirectoryItem } from '../../types';

interface OfficialDirectoryTabProps {
  directories: OfficialGovDirectoryItem[];
}

export const OfficialDirectoryTab: React.FC<OfficialDirectoryTabProps> = ({ directories }) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              অফিসিয়াল সরকারি সার্ভিস ডিরেক্টরি ও গাইডলাইন (Official Government Directory)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            নির্বাচন কমিশন, এনবিআর, বিডিআরআইএস ও পাসপোর্টের অফিসিয়াল ফি, প্রয়োজনীয় নথিপত্র এবং হটলাইন যোগাযোগ
          </p>
        </div>

        <span className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold shrink-0">
          সরকারি ডাটাবেজ নির্দেশিকা
        </span>
      </div>

      {/* Directory Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {directories.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{item.serviceTitleBn}</h3>
                  <p className="text-xs text-teal-700 font-semibold mt-0.5">{item.departmentBn}</p>
                </div>

                <a
                  href={`tel:${item.helpline}`}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
                  title="সরকারি হেল্পলাইনে কল করুন"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>{item.helpline}</span>
                </a>
              </div>

              {/* Official Fee Badge */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">সরকারি নির্ধারিত ফি:</span>
                <span className="font-bold text-slate-900">{item.officialGovFeeBn}</span>
              </div>

              {/* Required Documents */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 block">প্রয়োজনীয় কাগজপত্র:</span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  {item.requiredDocumentsBn.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step by step guide */}
              <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-700 block">আবেদন প্রক্রিয়া:</span>
                <ol className="space-y-1 text-slate-600 text-[11px] list-decimal pl-4">
                  {item.stepByStepGuideBn.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Portal Action Buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <a
                href={item.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>অফিসিয়াল পোর্টালে যান</span>
              </a>

              {item.statusTrackerUrl && (
                <a
                  href={item.statusTrackerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  স্ট্যাটাস ট্র্যাকার
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
