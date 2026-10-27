import React, { useState } from 'react';
import {
  Share2,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertTriangle,
  Globe,
  MessageCircle,
  Video,
  Instagram,
  Facebook,
  Twitter,
  Send
} from 'lucide-react';
import { SocialMediaLink, WebsiteSettings } from '../../types';

interface SocialMediaManagerTabProps {
  token: string | null;
  settings: WebsiteSettings;
  onRefresh: () => void;
}

export const SocialMediaManagerTab: React.FC<SocialMediaManagerTabProps> = ({
  token,
  settings,
  onRefresh,
}) => {
  const initialLinks: SocialMediaLink[] = settings.socialMediaLinks || [
    {
      id: 'soc_1',
      platform: 'facebook',
      title: 'অফিসিয়াল ফেসবুক পেইজ',
      url: settings.socialLinks?.facebook || 'https://facebook.com/rongdhonustudio',
      iconName: 'Facebook',
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 'soc_2',
      platform: 'whatsapp',
      title: 'হোয়াটসঅ্যাপ কাস্টমার সাপোর্ট',
      url: `https://wa.me/${settings.whatsapp || '8801632042441'}`,
      iconName: 'MessageCircle',
      displayOrder: 2,
      isActive: true,
    },
    {
      id: 'soc_3',
      platform: 'youtube',
      title: 'ইউটিউব অফিশিয়াল চ্যানেল',
      url: settings.socialLinks?.youtube || 'https://youtube.com/@rongdhonustudio',
      iconName: 'Video',
      displayOrder: 3,
      isActive: true,
    },
    {
      id: 'soc_4',
      platform: 'instagram',
      title: 'ইনস্টাগ্রাম প্রোফাইল',
      url: 'https://instagram.com/rongdhonustudio',
      iconName: 'Instagram',
      displayOrder: 4,
      isActive: true,
    },
    {
      id: 'soc_5',
      platform: 'telegram',
      title: 'টেলিগ্রাম সাপোর্ট চ্যানেল',
      url: settings.socialLinks?.telegram || 'https://t.me/rongdhonustudio',
      iconName: 'Send',
      displayOrder: 5,
      isActive: true,
    },
  ];

  const [links, setLinks] = useState<SocialMediaLink[]>(initialLinks);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddLink = () => {
    const newLink: SocialMediaLink = {
      id: `soc_${Date.now()}`,
      platform: 'other',
      title: 'নতুন সোশ্যাল মিডিয়া লিংক',
      url: 'https://',
      iconName: 'Globe',
      displayOrder: links.length + 1,
      isActive: true,
    };
    setLinks([...links, newLink]);
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const handleUpdateLink = (id: string, field: keyof SocialMediaLink, value: any) => {
    setLinks(
      links.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/settings/social-media', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ links }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('সোশ্যাল মিডিয়া লিংকসমূহ সফলভাবে সংরক্ষণ ও হোমপেজে প্রকাশিত হয়েছে!');
        onRefresh();
      } else {
        setErrorMsg(data.error || 'সংরক্ষণ করতে ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারে যোগাযোগ করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-emerald-500" />;
      case 'youtube':
        return <Video className="w-5 h-5 text-rose-600" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'telegram':
        return <Send className="w-5 h-5 text-sky-500" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-sky-400" />;
      default:
        return <Globe className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              সোশ্যাল মিডিয়া লিংক ব্যবস্থাপনা (Social Media Links)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ফেসবুক, হোয়াটসঅ্যাপ, ইউটিউবসহ সব সোশ্যাল মিডিয়া লিংক কাস্টমাইজ করুন। হোমপেজ ও ফুটারে সরাসরি লাইভ হবে।
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddLink}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সোশ্যাল প্ল্যাটফর্ম যোগ করুন</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Links List Form */}
      <form onSubmit={handleSaveAll} className="space-y-4">
        <div className="space-y-3">
          {links.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3 transition-all hover:border-indigo-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    {getPlatformIcon(item.platform)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      ক্রমানুসার: #{item.displayOrder || idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateLink(item.id, 'title', e.target.value)}
                      className="block text-sm font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-indigo-600 focus:outline-none"
                      placeholder="লিংকের শিরোনাম"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={(e) => handleUpdateLink(item.id, 'isActive', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>{item.isActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveLink(item.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                    title="লিংক মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্ল্যাটফর্ম টাইপ:</label>
                  <select
                    value={item.platform}
                    onChange={(e) => handleUpdateLink(item.id, 'platform', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="facebook">ফেসবুক (Facebook)</option>
                    <option value="whatsapp">হোয়াটসঅ্যাপ (WhatsApp)</option>
                    <option value="youtube">ইউটিউব (YouTube)</option>
                    <option value="instagram">ইনস্টাগ্রাম (Instagram)</option>
                    <option value="telegram">টেলিগ্রাম (Telegram)</option>
                    <option value="twitter">টুইটার (Twitter / X)</option>
                    <option value="other">অন্যান্য (Other Link)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">নিরাপদ URL (https://):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      required
                      value={item.url}
                      onChange={(e) => handleUpdateLink(item.id, 'url', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-none"
                    />
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0"
                      title="লিংক প্রিভিউ দেখুন"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'সংরক্ষণ করা হচ্ছে...' : 'সকল সোশ্যাল মিডিয়া লিংক সংরক্ষণ ও প্রকাশ করুন'}</span>
        </button>
      </form>
    </div>
  );
};
