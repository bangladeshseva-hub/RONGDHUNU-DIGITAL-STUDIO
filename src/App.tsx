import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Clock,
  Layers,
  HelpCircle,
  X,
  Download,
  AlertCircle,
  WifiOff
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ServiceCard } from './components/ServiceCard';
import { DynamicOrderModal } from './components/DynamicOrderModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { CustomerAiConcierge } from './components/CustomerAiConcierge';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { PwaInstallModal } from './components/PwaInstallModal';
import { PublicTrackingPortal } from './components/PublicTrackingPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Service, Category, WebsiteSettings, Order } from './types';

function MainApp() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [currentView, setCurrentView] = useState<string>('home');
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>({
    brandNameBn: 'রংধনু ডিজিটাল স্টুডিও',
    brandNameEn: 'Rongdhonu Digital Studio',
    taglineBn: 'বাংলাদেশের সবচেয়ে নির্ভরযোগ্য ও দ্রুততম অনলাইন সেবা কেন্দ্র',
    taglineEn: 'Most Reliable & Fastest Online Citizen Service Hub in Bangladesh',
    phone: '01632-042441',
    whatsapp: '01632-042441',
    email: 'rongdhonustudio00@gmail.com',
    addressBn: 'সদর রোড, ঢাকা ও সারাদেশে অনলাইন সেবা',
    announcementBar: {
      enabled: true,
      textBn: '🎉 রংধনু ডিজিটাল স্টুডিওতে স্বাগতম! বিকাশ ও নগদ পেমেন্টে সকল অনলাইন সেবায় বিশেষ ক্যাশব্যাক ছাড় চলছে।',
      textEn: 'Welcome to Rongdhonu Digital Studio! Special cashback discount on all online services.',
      linkUrl: '#services',
    },
    socialLinks: {
      facebook: 'https://facebook.com/rongdhonudigitalstudio',
      youtube: 'https://youtube.com/@rongdhonustudio',
      whatsapp: 'https://wa.me/8801632042441',
      telegram: 'https://t.me/rongdhonustudio',
    },
    paymentGateways: {
      bkashNumber: '01632042441',
      bkashType: 'পার্সোনাল / মার্চেন্ট পেমেন্ট',
      nagadNumber: '01632042441',
      nagadType: 'পার্সোনাল / ক্যাশআউট',
      rocketNumber: '016320424418',
      rocketType: 'পার্সোনাল',
      bankName: 'Islami Bank Bangladesh Ltd / City Bank',
      bankAccountName: 'Rongdhonu Digital Studio',
      bankAccountNumber: '20501234567890',
      bankRouting: '125272635',
      sandboxGatewayEnabled: true,
    },
    maintenanceMode: false,
    currency: 'BDT (৳)',
    timezone: 'Asia/Dhaka',
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<Service | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [recentOrderSuccess, setRecentOrderSuccess] = useState<Order | null>(null);
  const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | null>(null);

  // Load Initial Catalog & Settings
  const loadData = async () => {
    try {
      const [svcRes, catRes, setRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/categories'),
        fetch('/api/settings'),
      ]);

      if (svcRes.ok) setServices(await svcRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (setRes.ok) setSettings(await setRes.json());
    } catch (err) {
      console.error('Failed to load application data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // PWA Install Prompt & Online/Offline Listener
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Live Presence Heartbeat ping every 30 seconds
  useEffect(() => {
    const sendHeartbeat = () => {
      const userAgent = navigator.userAgent;
      const device = /android|iphone|ipad|ipod/i.test(userAgent) ? 'mobile' : 'desktop';
      fetch('/api/presence/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'guest',
          userName: user?.name || 'অনলাইন ভিজিটর (Guest)',
          role: user?.role || 'visitor',
          route: currentView,
          device,
        }),
      }).catch(() => {});
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 30000);
    return () => clearInterval(interval);
  }, [user, currentView]);

  // Filter services by category and search query
  const filteredServices = services.filter((svc) => {
    if (selectedCategory !== 'all' && svc.categoryId !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBn = svc.nameBn.toLowerCase().includes(q);
      const matchEn = svc.nameEn.toLowerCase().includes(q);
      const matchDesc = svc.descriptionBn.toLowerCase().includes(q);
      const matchCat = svc.categoryNameBn.toLowerCase().includes(q);
      return matchBn || matchEn || matchDesc || matchCat;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Hind_Siliguri','Inter',sans-serif]">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 font-bold text-xs py-2 px-4 text-center flex items-center justify-center gap-2 shadow-xs transition-all">
          <WifiOff className="w-4 h-4 text-slate-950 shrink-0" />
          <span>{t('ইন্টারনেট সংযোগ বিচ্ছিন্ন! অফলাইন মোডে দেখছেন। পুনরায় সংযোগ আসলে ডেটা হালনাগাদ হবে।', 'You are currently offline. Viewing cached content. Reconnecting...')}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        settings={settings}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenInstallModal={() => setPwaModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        
        {/* VIEW: HOME & SERVICES */}
        {currentView === 'home' && (
          <div className="space-y-10 pb-16">
            
            {/* Hero Section */}
            <HeroBanner
              settings={settings}
              onExploreClick={() => {
                const el = document.getElementById('services-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                const el = document.getElementById('services-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Recent Order Celebratory Alert Toast */}
            {recentOrderSuccess && (
              <div className="max-w-4xl mx-auto px-4">
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm sm:text-base">
                        🎉 {t('অর্ডার সফলভাবে দাখিল হয়েছে!', 'Order Submitted Successfully!')}
                      </p>
                      <p className="text-xs text-emerald-100">
                        অর্ডার আইডি: <span className="font-mono font-bold text-white">{recentOrderSuccess.orderNumber}</span> • {recentOrderSuccess.serviceNameBn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentView('customer_orders');
                        setRecentOrderSuccess(null);
                      }}
                      className="px-4 py-2 bg-white text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-50 shadow-xs cursor-pointer"
                    >
                      {t('লাইভ ট্র্যাকিং দেখুন', 'Track Live Status')}
                    </button>
                    <button
                      onClick={() => setRecentOrderSuccess(null)}
                      className="p-2 text-emerald-200 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Service Categories Filter Section */}
            <div id="services-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-600 mb-1">
                    <Layers className="w-4 h-4" />
                    <span>{t('সার্ভিস ক্যাটালগ', 'Service Catalog')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {t('নাগরিক ও ডিজিটাল সেবাসমূহ', 'Citizen & Digital Services')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    {t('ঘরে বসেই সকল প্রকার সরকারি ফরম পূরণ, এনআইডি ও জন্ম সনদ সহায়তার তালিকা', 'Choose your desired service for instant online filing and processing assistance')}
                  </p>
                </div>

                {/* Filter info indicator */}
                <div className="text-xs font-bold text-slate-500 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-2xs self-start md:self-auto">
                  {filteredServices.length} {t('টি সেবা উপলব্ধ', 'Services Available')}
                </div>
              </div>

              {/* Category Pills (Horizontal scroll on mobile) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {t('সকল সেবা', 'All Services')}
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {lang === 'bn' ? cat.nameBn : cat.nameEn}
                  </button>
                ))}
              </div>

              {/* Service Cards Grid (Mobile 2-column, Tablet 2-3 column, Desktop 3-4 column) */}
              {filteredServices.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
                  <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-800 text-base">{t('কোনো সেবা পাওয়া যায়নি', 'No services found')}</p>
                  <p className="text-xs text-slate-500">অন্য কোনো নাম বা ফিল্টার দিয়ে আবার অনুসন্ধান করুন।</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    সকল সেবা রিসেট করুন
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onSelect={(svc) => setSelectedServiceForOrder(svc)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* How It Works Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-800/40 space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    {t('সহজ ৪টি ধাপে সেবা গ্রহণ', 'Simple 4-Step Process')}
                  </span>
                  <h3 className="text-xl sm:text-3xl font-black text-white">
                    {t('কীভাবে সেবা গ্রহণ করবেন?', 'How Rongdhonu Digital Studio Works')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    আমাদের নিরাপদ অটোমেশন ও পেশাদার অপারেটর দ্বারা আপনার আবেদন দ্রুততম সময়ে সম্পন্ন হয়।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-black text-sm flex items-center justify-center">
                      ১
                    </span>
                    <h4 className="font-bold text-sm text-white">{t('সেবা নির্বাচন করুন', '1. Select Service')}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      তালিকা থেকে কাঙ্ক্ষিত সেবাটি বেছে নিয়ে ‘সেবা নিন’ বাটনে ক্লিক করুন।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-sm flex items-center justify-center">
                      ২
                    </span>
                    <h4 className="font-bold text-sm text-white">{t('তথ্য ও ফাইল প্রদান', '2. Submit Info')}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      প্রয়োজনীয় তথ্য পূরণ করে প্রয়োজনীয় ডকুমেন্টের ছবি বা ফাইল আপলোড করুন।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-black text-sm flex items-center justify-center">
                      ৩
                    </span>
                    <h4 className="font-bold text-sm text-white">{t('পেমেন্ট ও নিশ্চিতকরণ', '3. Make Payment')}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      বিকাশ, নগদ বা ওয়ালেট ব্যালেন্স থেকে সরকারি ফি সহ মূল্য পরিশোধ করুন।
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center">
                      ৪
                    </span>
                    <h4 className="font-bold text-sm text-white">{t('ডেলিভারি স্লিপ সংগ্রহ', '4. Get Deliverables')}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      কাজ সম্পন্ন হলে আপনার ড্যাশবোর্ড থেকে অফিশিয়াল পিডিএফ ও স্লিপ ডাউনলোড করুন।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {t('সাধারণ জিজ্ঞাসাবলী (FAQ)', 'Frequently Asked Questions')}
                </h3>
                <p className="text-xs text-slate-500">আমাদের সার্ভিস সংক্রান্ত সচরাচর জানতে চাওয়া কিছু প্রশ্নের উত্তর</p>
              </div>

              <div className="space-y-3 pt-2">
                <details className="group bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs open:border-sky-300">
                  <summary className="font-bold text-xs sm:text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
                    <span>জাতীয় পরিচয়পত্র (NID) হারানো বা রি-ইস্যু আবেদন করতে কত সময় লাগে?</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed border-t border-slate-100 pt-2">
                    জিডি কপিসহ ফরম সাবমিট করার পর সাধারণত ১ থেকে ২ কর্মদিবসের মধ্যে নির্বাচন কমিশনের সার্ভারে চালান ফি জমা হয়ে ট্র্যাকিং স্লিপ রেডি হয়। আপনি সরাসরি ড্যাশবোর্ড থেকে ডাউনলোড করতে পারবেন।
                  </p>
                </details>

                <details className="group bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs open:border-sky-300">
                  <summary className="font-bold text-xs sm:text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
                    <span>পেমেন্ট নিশ্চিত করার নিয়ম কী?</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed border-t border-slate-100 pt-2">
                    বিকাশ বা নগদ নম্বর (০১৬৩২-০৪২৪৪১) এ নির্দিষ্ট ফি পাঠিয়ে TrxID প্রদান করলেই আমাদের সার্ভারে অটোমেশন বা অ্যাডমিন পেমেন্ট ভেরিফাই করে কাজ শুরু করবে। এছাড়া ওয়ালেটে টাকা রিচার্জ করে রাখলে ১-ক্লিকেই অর্ডার নিশ্চিত হয়।
                  </p>
                </details>

                <details className="group bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs open:border-sky-300">
                  <summary className="font-bold text-xs sm:text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
                    <span>জরুরি কোনো সমস্যায় কার সাথে সরাসরি যোগাযোগ করব?</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed border-t border-slate-100 pt-2">
                    আমাদের অফিশিয়াল হোয়াটসঅ্যাপ হটলাইন <strong>০১৬৩২-০৪২৪৪১</strong> এ সরাসরি মেসেজ বা কল দিতে পারেন অথবা আপনার একাউন্টের সাপোর্ট টিকেট সেকশন থেকে মেসেজ করতে পারেন।
                  </p>
                </details>
              </div>
            </div>

          </div>
        )}

        {/* VIEW: CUSTOMER DASHBOARD */}
        {(currentView === 'customer_dashboard' || currentView === 'customer_orders' || currentView === 'customer_wallet') && (
          <CustomerDashboard
            settings={settings}
            initialTab={
              currentView === 'customer_orders'
                ? 'orders'
                : currentView === 'customer_wallet'
                ? 'wallet'
                : 'overview'
            }
          />
        )}

        {/* VIEW: SECRET ADMIN PANEL */}
        {currentView === 'admin' && (
          !user || user.role === 'customer' ? (
            <div className="max-w-md mx-auto my-12 p-8 bg-slate-900 text-white rounded-3xl text-center space-y-4 shadow-2xl border border-indigo-900/60">
              <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-lg font-bold">অ্যাডমিন এক্সেস সংরক্ষিত (Admin Access Protected)</h3>
              <p className="text-xs text-slate-400">এই ব্যক্তিগত ড্যাশবোর্ডে প্রবেশের জন্য যথাযথ অ্যাডমিন লগইন প্রয়োজন।</p>
              <button
                onClick={() => setAdminLoginOpen(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer transition-all"
              >
                অ্যাডমিন প্যানেলে লগইন করুন →
              </button>
            </div>
          ) : (
            <AdminPanel
              settings={settings}
              onUpdateSettings={setSettings}
              onRefreshServices={loadData}
              onNavigateHome={() => setCurrentView('home')}
            />
          )
        )}

        {/* VIEW: PUBLIC APPLICATION TRACKING PORTAL */}
        {currentView === 'track' && (
          <PublicTrackingPortal
            settings={settings}
            onExploreServices={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Floating Customer AI Concierge (Gemini 3.8-flash) */}
      <CustomerAiConcierge settings={settings} />

      {/* Dynamic Order Form Modal */}
      {selectedServiceForOrder && (
        <DynamicOrderModal
          service={selectedServiceForOrder}
          settings={settings}
          onClose={() => setSelectedServiceForOrder(null)}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOrderSuccess={(newOrder) => {
            setSelectedServiceForOrder(null);
            setRecentOrderSuccess(newOrder);
          }}
        />
      )}

      {/* Auth Modal (Login / Register / Demo 1-click switcher) */}
      {authModalOpen && (
        <AuthModal onClose={() => setAuthModalOpen(false)} />
      )}

      {/* PWA Install Guide Modal */}
      <PwaInstallModal
        isOpen={pwaModalOpen}
        onClose={() => setPwaModalOpen(false)}
        settings={settings}
        deferredPrompt={deferredPrompt}
      />

      {/* Policy Modals */}
      {policyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {policyModal === 'privacy' ? 'গোপনীয়তা নীতিমালা (Privacy Policy)' : 'ব্যবহারের শর্তাবলী (Terms & Conditions)'}
              </h3>
              <button onClick={() => setPolicyModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              <p>১. রংধনু ডিজিটাল স্টুডিও গ্রাহকদের ব্যক্তিগত তথ্য (যেমন এনআইডি নম্বর, ফোন, ছবি) সর্বোচ্চ গোপনীয়তার সাথে সংরক্ষণ করে এবং শুধুমাত্র নির্দিষ্ট সেবা সম্পন্নের উদ্দেশ্যে ব্যবহার করে।</p>
              <p>২. আমরা কোনো গোপন ব্যাংকিং পিন বা পাসওয়ার্ড সংরক্ষণ করি না। পেমেন্ট লেনদেন সরাসরি মোবাইল ফাইন্যান্সিয়াল সার্ভিস (বিকাশ/নগদ/রকেট) এর ট্রানজেকশন আইডির মাধ্যমে ভেরিফাই করা হয়।</p>
              <p>৩. সরকারি বা প্রাতিষ্ঠানিক নীতিমালার কারণে কোনো আবেদন বাতিল হলে উপযুক্ত প্রমাণ সাপেক্ষে ওয়ালেটে ফি সমন্বয় বা রিফান্ড প্রক্রিয়া করা হয়।</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={() => setCurrentView('admin')}
        settings={settings}
      />

      {/* Global Footer */}
      <Footer
        settings={settings}
        onOpenPrivacy={() => setPolicyModal('privacy')}
        onOpenTerms={() => setPolicyModal('terms')}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </AuthProvider>
  );
}
