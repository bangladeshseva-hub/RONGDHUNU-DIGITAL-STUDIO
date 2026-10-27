import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Wallet,
  User as UserIcon,
  PhoneCall,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Layers,
  HelpCircle,
  FileCheck2,
  ChevronDown,
  Download,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { WebsiteSettings } from '../types';

interface NavbarProps {
  settings: WebsiteSettings;
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAuth: () => void;
  onOpenInstallModal: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  currentView,
  setCurrentView,
  onOpenAuth,
  onOpenInstallModal,
  onSearchChange,
  searchQuery,
}) => {
  const { user, logout, switchDemoRole } = useAuth();
  const { lang, toggleLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const isStaff = user && user.role !== 'customer';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      {settings.announcementBar?.enabled && (
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
          <span className="truncate">
            {lang === 'bn' ? settings.announcementBar.textBn : settings.announcementBar.textEn}
          </span>
          <a
            href={settings.announcementBar.linkUrl || '#services'}
            className="hidden md:inline-flex underline font-bold hover:text-amber-200 transition-colors ml-2"
          >
            {t('বিস্তারিত দেখুন →', 'Explore Now →')}
          </a>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo & Title */}
          <div
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-sky-900 flex items-center justify-center shadow-md p-1 group-hover:scale-105 transition-transform">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 opacity-30 blur-xs"></div>
              <img
                src="/favicon.svg"
                alt="Rongdhonu Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 relative z-10"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <Sparkles className="w-5 h-5 text-amber-300 relative z-10 hidden" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight flex items-center gap-1">
                  {lang === 'bn' ? settings.brandNameBn : settings.brandNameEn}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {t('অনলাইন', 'ONLINE')}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 font-medium">
                {lang === 'bn' ? settings.taglineBn : settings.taglineEn}
              </p>
            </div>
          </div>

          {/* Search bar on desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-sm relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('সার্ভিসের নাম বা এনআইডি খুঁজুন...', 'Search services by name or category...')}
              className="w-full pl-9.5 pr-4 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct WhatsApp Callout Button */}
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl text-xs font-semibold transition-all shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>{settings.whatsapp}</span>
            </a>

            {/* Public Track Order Button */}
            <button
              onClick={() => {
                setCurrentView('track');
                setMobileMenuOpen(false);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                currentView === 'track'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80'
              }`}
              title="Track Application without login"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>{t('ট্র্যাক আবেদন', 'Track Order')}</span>
            </button>

            {/* PWA Install Button */}
            <button
              onClick={onOpenInstallModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Install Web App / Add to Home Screen"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t('অ্যাপ ইনস্টল', 'Install App')}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
              title="Toggle Language"
            >
              {lang === 'bn' ? 'ENGLISH' : 'বাংলা'}
            </button>

            {/* Demo Quick Role Switcher Pill (Great for inspection and fast testing) */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-all"
              >
                <span>{t('রোল সুইচার', 'Role Switch')}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('দ্রুত ভূমিকা পরিবর্তন', 'Quick Switch Role')}
                  </div>
                  <button
                    onClick={() => {
                      switchDemoRole('customer');
                      setRoleSwitcherOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>👤 {t('গ্রাহক একাউন্ট (Customer)', 'Customer Demo')}</span>
                    {user?.role === 'customer' && <span className="text-sky-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('super_admin');
                      setRoleSwitcherOpen(false);
                      setCurrentView('admin');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 flex items-center justify-between"
                  >
                    <span>⚡ {t('সুপার অ্যাডমিন (Super Admin)', 'Super Admin')}</span>
                    {user?.role === 'super_admin' && <span className="text-purple-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('service_manager');
                      setRoleSwitcherOpen(false);
                      setCurrentView('admin');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50 flex items-center justify-between"
                  >
                    <span>🛠️ {t('সার্ভিস ম্যানেজার (Manager)', 'Service Manager')}</span>
                    {user?.role === 'service_manager' && <span className="text-indigo-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* User Account / Wallet Area */}
            {user ? (
              <div className="flex items-center gap-2">
                {/* Wallet Balance Badge */}
                <button
                  onClick={() => setCurrentView('customer_dashboard')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-bold text-sky-800 transition-all shadow-2xs"
                  title="Your Wallet Balance"
                >
                  <Wallet className="w-3.5 h-3.5 text-sky-600" />
                  <span>৳{user.walletBalance.toLocaleString()}</span>
                </button>

                {/* Secret Admin Panel Link for Staff */}
                {isStaff && (
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                      currentView === 'admin'
                        ? 'bg-purple-700 text-white shadow-purple-200'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('অ্যাডমিন প্যানেল', 'Admin Panel')}</span>
                  </button>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all"
                  >
                    <span className="text-xs font-semibold text-slate-800 max-w-[90px] truncate hidden sm:inline">
                      {user.name.split(' ')[0]}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-800">
                          {user.role}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentView('customer_dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        {t('গ্রাহক ড্যাশবোর্ড', 'Customer Dashboard')}
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('customer_orders');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <FileCheck2 className="w-4 h-4 text-slate-400" />
                        {t('আমার অর্ডারসমূহ', 'My Orders')}
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('customer_wallet');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Wallet className="w-4 h-4 text-slate-400" />
                        {t('ওয়ালেট টপ-আপ ও হিস্ট্রি', 'Wallet & Balance')}
                      </button>

                      {isStaff && (
                        <button
                          onClick={() => {
                            setCurrentView('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-2 border-t border-slate-100 mt-1"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          {t('অ্যাডমিন কন্ট্রোল সেন্টার', 'Admin Control Center')}
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          setCurrentView('home');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        {t('লগআউট', 'Sign Out')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-sky-500/20 hover:shadow-lg transition-all"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t('লগইন / নিবন্ধন', 'Login / Register')}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('সার্ভিস খুঁজুন...', 'Search services...')}
              className="w-full pl-9.5 pr-4 py-2 bg-slate-100 text-sm rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              🏠 {t('হোমপেইজ', 'Home')}
            </button>
            <button
              onClick={() => {
                setCurrentView('services');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              📂 {t('সকল সেবা', 'All Services')}
            </button>
            <button
              onClick={() => {
                setCurrentView('track');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 rounded-xl flex items-center gap-1.5"
            >
              🔍 {t('আবেদন ট্র্যাকিং', 'Track Order')}
            </button>
            <button
              onClick={() => {
                setCurrentView('customer_orders');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              📜 {t('আমার অর্ডার', 'My Orders')}
            </button>
            <button
              onClick={() => {
                setCurrentView('customer_wallet');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              💳 {t('ওয়ালেট রিচার্জ', 'Wallet')}
            </button>
            <button
              onClick={() => {
                onOpenInstallModal();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-bold text-sky-700 bg-sky-50 rounded-xl col-span-2 flex items-center justify-center gap-1.5"
            >
              <Smartphone className="w-4 h-4" />
              <span>📱 {t('মোবাইলে অ্যাপ ইনস্টল করুন (Install App)', 'Install App on Phone')}</span>
            </button>
          </div>

          {isStaff && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-purple-600 text-white font-bold rounded-xl text-center text-sm shadow-md"
              >
                ⚡ {t('অ্যাডমিন কন্ট্রোল সেন্টারে প্রবেশ', 'Open Admin Command Center')}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
