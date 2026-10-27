import React, { useState, useEffect } from 'react';
import {
  Wallet,
  FileCheck2,
  Clock,
  HelpCircle,
  Plus,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  ExternalLink,
  MessageSquare,
  Send,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  X,
  RotateCcw,
  FileText,
  ShieldAlert,
  Printer
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Order, WalletTransaction, SupportTicket, WebsiteSettings, JobDeliverable } from '../types';
import { PrintableSlipModal } from './PrintableSlipModal';

interface CustomerDashboardProps {
  settings: WebsiteSettings;
  initialTab?: 'overview' | 'orders' | 'wallet' | 'support';
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  settings,
  initialTab = 'overview',
}) => {
  const { user, token, refreshUser } = useAuth();
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wallet' | 'support'>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Top-up Modal State
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('500');
  const [topUpMethod, setTopUpMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [topUpTrxId, setTopUpTrxId] = useState('');
  const [topUpMsg, setTopUpMsg] = useState({ type: '', text: '' });
  const [isSubmittingTopUp, setIsSubmittingTopUp] = useState(false);

  // New Support Ticket Modal State
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('Order Status Query');
  const [newTicketMsg, setNewTicketMsg] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  // Selected Order for detail view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Revision Modal State
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedOrderForRevision, setSelectedOrderForRevision] = useState<Order | null>(null);
  const [revisionReason, setRevisionReason] = useState('');
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);
  const [revisionError, setRevisionError] = useState('');
  const [revisionSuccess, setRevisionSuccess] = useState('');

  // Printable Slip Modal State
  const [printSlipOrder, setPrintSlipOrder] = useState<Order | null>(null);
  const [printSlipOpen, setPrintSlipOpen] = useState(false);

  const handleDownloadDeliverable = async (orderId: string, del: JobDeliverable | any) => {
    try {
      fetch(`/api/orders/${orderId}/track-download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliverableId: del.id }),
      }).catch(() => {});
    } catch {}

    const link = document.createElement('a');
    link.href = del.fileUrl || del.downloadUrl;
    link.download = del.fileName || del.title || 'document';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Refresh after brief delay to update download count
    setTimeout(fetchCustomerData, 1200);
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForRevision || !revisionReason.trim()) {
      setRevisionError('অনুগ্রহ করে সংশোধনের সুনির্দিষ্ট কারণ বা তথ্য উল্লেখ করুন।');
      return;
    }
    setIsSubmittingRevision(true);
    setRevisionError('');
    setRevisionSuccess('');

    try {
      const res = await fetch(`/api/orders/${selectedOrderForRevision.id}/request-revision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customerNote: revisionReason }),
      });

      if (res.ok) {
        setRevisionSuccess('সংশোধনের অনুরোধ সফলভাবে পাঠানো হয়েছে! আমাদের টিম দ্রুত সমাধান করবে।');
        setRevisionReason('');
        await fetchCustomerData();
        setTimeout(() => {
          setRevisionModalOpen(false);
          setRevisionSuccess('');
          setSelectedOrderForRevision(null);
        }, 2200);
      } else {
        const data = await res.json();
        setRevisionError(data.error || 'আবেদন প্রক্রিয়া করতে ব্যর্থ হয়েছে।');
      }
    } catch {
      setRevisionError('সার্ভারে যোগাযোগ করা যায়নি।');
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  const fetchCustomerData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [ordRes, txRes, tktRes] = await Promise.all([
        fetch('/api/orders/my', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/wallet/transactions', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/support/tickets', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (ordRes.ok) setOrders(await ordRes.json());
      if (txRes.ok) setTransactions(await txRes.json());
      if (tktRes.ok) setTickets(await tktRes.json());
    } catch (err) {
      console.error('Failed to load customer dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [token]);

  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpTrxId.trim()) {
      setTopUpMsg({ type: 'error', text: 'অনুগ্রহ করে সঠিক TrxID লিখুন।' });
      return;
    }
    setIsSubmittingTopUp(true);
    setTopUpMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(topUpAmount),
          paymentMethod: topUpMethod,
          transactionId: topUpTrxId.toUpperCase(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTopUpMsg({
          type: 'success',
          text: 'টপ-আপ রিকোয়েস্ট সফলভাবে জমা হয়েছে! অ্যাডমিন দ্রুত ভেরিফাই করে ব্যালেন্স যোগ করবেন।',
        });
        setTopUpTrxId('');
        fetchCustomerData();
        setTimeout(() => {
          setTopUpModalOpen(false);
          setTopUpMsg({ type: '', text: '' });
        }, 2500);
      } else {
        setTopUpMsg({ type: 'error', text: data.error || 'টপ-আপ রিকোয়েস্ট ব্যর্থ হয়েছে।' });
      }
    } catch (e) {
      setTopUpMsg({ type: 'error', text: 'সার্ভারে সংযোগ ত্রুটি।' });
    } finally {
      setIsSubmittingTopUp(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMsg.trim()) return;

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: newTicketSubject,
          category: newTicketCategory,
          message: newTicketMsg,
        }),
      });

      if (res.ok) {
        setTicketModalOpen(false);
        setNewTicketSubject('');
        setNewTicketMsg('');
        fetchCustomerData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendTicketReply = async (ticketId: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: replyText }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedTicket(updated);
        setReplyText('');
        fetchCustomerData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const completedOrdersCount = orders.filter((o) => o.orderStatus === 'Completed').length;
  const inProgressOrdersCount = orders.filter((o) => o.orderStatus === 'Processing' || o.orderStatus === 'Payment Verification' || o.orderStatus === 'Submitted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Customer Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-indigo-900/40">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{user?.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                {t('সম্মানিত গ্রাহক', 'Customer')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-mono mt-0.5">
              {user?.phone} • {user?.email}
            </p>
          </div>
        </div>

        {/* Wallet Balance Widget */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 flex items-center justify-between sm:justify-end gap-6">
          <div>
            <span className="text-xs text-slate-300 font-medium block">{t('বর্তমান ওয়ালেট ব্যালেন্স', 'Current Wallet Balance')}</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-300">
              ৳{user?.walletBalance.toLocaleString() || 0}
            </span>
          </div>
          <button
            onClick={() => setTopUpModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('টাকা লোড করুন', 'Top-Up Wallet')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📊 {t('সারসংক্ষেপ', 'Overview')}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📜 {t('আমার অর্ডারসমূহ', 'My Orders')} ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'wallet'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          💳 {t('ওয়ালেট লেজার', 'Wallet Ledger')} ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'support'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          💬 {t('সাপোর্ট টিকেট', 'Support Desk')} ({tickets.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold">{t('মোট দাখিলকৃত অর্ডার', 'Total Orders')}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold">{t('প্রসেসিংয়ে থাকা কাজ', 'In Progress')}</p>
                <p className="text-2xl font-black text-amber-600 mt-1">{inProgressOrdersCount}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold">{t('সফলভাবে সম্পন্ন ডেলিভারি', 'Completed Orders')}</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{completedOrdersCount}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recent Orders List Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <span>{t('সাম্প্রতিক অর্ডারসমূহ', 'Recent Orders')}</span>
              </h2>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <span>{t('সকল দেখুন', 'View All')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                {t('আপনার এখনও কোনো অর্ডার নেই। উপরের যে কোনো সেবা বেছে নিন।', 'No orders submitted yet. Explore services to get started!')}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setActiveTab('orders');
                    }}
                    className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{order.orderNumber}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          order.orderStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Processing'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{order.serviceNameBn}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-900 block">৳{order.servicePrice}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {t('আমার দাখিলকৃত অর্ডারসমূহ', 'My Submitted Orders')}
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              মোট: {orders.length} টি
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-bold text-sm">{t('কোনো অর্ডার পাওয়া যায়নি', 'No orders found')}</p>
              <p className="text-slate-400 text-xs mt-1">{t('হোমপেইজ থেকে আপনার পছন্দের সার্ভিসের আবেদন করতে পারেন।', 'You can apply for any service from the homepage.')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs hover:border-sky-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900">{order.orderNumber}</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          order.orderStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : order.orderStatus === 'Processing'
                            ? 'bg-sky-100 text-sky-800 border border-sky-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {order.orderStatus}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {t('পেমেন্ট:', 'Payment:')} {order.paymentStatus} ({order.paymentMethod})
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mt-1">{order.serviceNameBn}</h3>
                    </div>

                    <div className="sm:text-right flex flex-col sm:items-end gap-1">
                      <span className="text-base font-black text-slate-900">৳{order.servicePrice}</span>
                      <span className="text-xs text-slate-400 block">
                        {new Date(order.createdAt).toLocaleString('bn-BD')}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPrintSlipOrder(order);
                          setPrintSlipOpen(true);
                        }}
                        className="mt-1 inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                        title={t('অফিসিয়াল মানি রিসিট / স্লিপ প্রিন্ট করুন', 'Print official money receipt')}
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>{t('রসিদ / স্লিপ', 'Receipt Slip')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Deliverables Center with Multi-Version Files */}
                  {order.deliverables && order.deliverables.length > 0 && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/90 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-emerald-950">
                              {t('ডেলিভারি ফাইল ও স্লিপ প্রস্তুত', 'Delivered Files & Official Documents')}
                            </p>
                            <p className="text-[10px] text-emerald-700">
                              {t('নীচের বাটন থেকে আপনার প্রস্তুতকৃত ফাইলটি ডাউনলোড করুন', 'Download the prepared document below')}
                            </p>
                          </div>
                        </div>

                        {/* Request Revision Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderForRevision(order);
                            setRevisionModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-emerald-100/70 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs shrink-0 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t('সংশোধনের অনুরোধ (Request Revision)', 'Request Revision')}</span>
                        </button>
                      </div>

                      {/* Versioned deliverables list */}
                      <div className="space-y-2">
                        {order.deliverables.map((del, idx) => (
                          <div
                            key={del.id || idx}
                            className="bg-white p-3 rounded-xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 text-white shrink-0 mt-0.5">
                                v{del.version || idx + 1}
                              </span>
                              <div>
                                <p className="text-xs font-bold text-slate-900">{del.title}</p>
                                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                  <span>{del.fileName}</span>
                                  {del.fileSize && <span>• {del.fileSize}</span>}
                                  <span>• {new Date(del.deliveredAt || (del as any).uploadedAt || order.createdAt).toLocaleDateString('bn-BD')}</span>
                                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                                    {del.downloadCount || 0} বার ডাউনলোড
                                  </span>
                                </div>
                                {del.notes && (
                                  <p className="text-[11px] text-slate-600 mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                    নোট: {del.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDownloadDeliverable(order.id, del)}
                              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer transition-all"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{t('ডাউনলোড করুন', 'Download')}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customer Revision Request History */}
                  {order.revisions && order.revisions.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <RotateCcw className="w-4 h-4 text-amber-600" />
                        <span>{t('সংশোধনের আবেদন ট্র্যাকিং', 'Revision Request History')}</span>
                      </div>
                      <div className="space-y-2">
                        {order.revisions.map((rev) => (
                          <div key={rev.id} className="bg-white p-2.5 rounded-xl border border-amber-200/60 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                rev.status === 'resolved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800 animate-pulse'
                              }`}>
                                {rev.status === 'resolved' ? 'সংশোধন সম্পন্ন (Resolved)' : 'পর্যালোচনাধীন (Pending Review)'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(rev.requestedAt).toLocaleDateString('bn-BD')}
                              </span>
                            </div>
                            <p className="text-slate-700 font-medium">আবেদন: {rev.customerNote}</p>
                            {rev.resolutionNote && (
                              <p className="text-emerald-700 bg-emerald-50 p-1.5 rounded-lg text-[11px] font-medium border border-emerald-100">
                                সমাধান নোট: {rev.resolutionNote}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Live Status Timeline */}
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold text-slate-500">{t('লাইভ অগ্রগতি ট্র্যাকিং:', 'Live Status History:')}</p>
                    <div className="space-y-2 pl-3 border-l-2 border-indigo-200">
                      {order.statusHistory.map((item, idx) => (
                        <div key={idx} className="relative text-xs">
                          <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-indigo-600 ring-4 ring-white"></span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{item.status}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(item.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-0.5">{item.noteBn}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WALLET LEDGER */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
            <div>
              <p className="text-xs text-slate-500 font-semibold">{t('আপনার বর্তমান জমা ব্যালেন্স', 'Available Wallet Balance')}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">৳{user?.walletBalance.toLocaleString() || 0}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t('ওয়ালেট ব্যালেন্স দিয়ে যেকোনো সেবা ১-ক্লিকে তাৎক্ষণিক নেওয়া যায়।', 'Instant 1-click checkout for any service with zero gateway delay.')}</p>
            </div>
            <button
              onClick={() => setTopUpModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('টাকা রিচার্জ করুন (Top-Up)', 'Add Funds to Wallet')}</span>
            </button>
          </div>

          {/* Transactions Statement Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Wallet className="w-4 h-4 text-sky-600" />
                <span>{t('লেনদেন বিবরণী (Ledger Statement)', 'Transaction Ledger')}</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {transactions.length} টি রেকর্ড
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                {t('এখনও কোনো লেনদেনের রেকর্ড নেই।', 'No transactions recorded yet.')}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        tx.type === 'credit'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}>
                        {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">{tx.reason}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{new Date(tx.createdAt).toLocaleString('bn-BD')}</span>
                          {tx.referenceId && (
                            <span>• TrxID: <span className="font-mono font-bold text-slate-600">{tx.referenceId}</span></span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-sm sm:text-base font-black ${
                        tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}৳{tx.amount}
                      </span>
                      <span className={`text-[10px] font-bold block ${
                        tx.status === 'completed'
                          ? 'text-emerald-600'
                          : tx.status === 'pending'
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}>
                        {tx.status === 'completed' ? '✓ সফল' : tx.status === 'pending' ? '⏳ অপেক্ষমান' : '✕ বাতিল'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT TICKETS */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {t('কাস্টমার সাপোর্ট টিকেট', 'Customer Support Tickets')}
            </h2>
            <button
              onClick={() => setTicketModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('নতুন টিকেট খুলুন', 'Open New Ticket')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tickets List */}
            <div className="lg:col-span-5 space-y-3">
              {tickets.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-xs text-slate-400">
                  {t('আপনার কোনো সাপোর্ট টিকেট নেই। যেকোনো সমস্যায় নতুন টিকেট খুলুন।', 'No tickets opened yet.')}
                </div>
              ) : (
                tickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    onClick={() => setSelectedTicket(tkt)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedTicket?.id === tkt.id
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-slate-800">{tkt.ticketNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tkt.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tkt.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{tkt.subject}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {new Date(tkt.createdAt).toLocaleDateString('bn-BD')} • {tkt.messages.length} টি বার্তা
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Conversation View */}
            <div className="lg:col-span-7">
              {selectedTicket ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col h-[480px]">
                  <div className="border-b border-slate-100 pb-3 mb-3">
                    <span className="font-mono text-xs text-indigo-600 font-bold">{selectedTicket.ticketNumber}</span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{selectedTicket.subject}</h3>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {selectedTicket.messages.map((m) => {
                      const isMe = m.senderId === user?.id;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-slate-100 text-slate-900 rounded-bl-none'
                            }`}
                          >
                            <span className="text-[10px] font-bold block mb-1 opacity-80">
                              {m.senderName} ({m.senderRole === 'customer' ? 'আপনি' : 'সাপোর্ট অফিসার'})
                            </span>
                            {m.message}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(m.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={t('আপনার উত্তর লিখুন...', 'Type your reply message...')}
                      className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendTicketReply(selectedTicket.id);
                      }}
                    />
                    <button
                      onClick={() => handleSendTicketReply(selectedTicket.id)}
                      className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center h-[300px]">
                  <MessageSquare className="w-10 h-10 text-slate-300 mb-2" />
                  <span>{t('বার্তা পড়তে বাম পাশ থেকে টিকেট নির্বাচন করুন।', 'Select a ticket on the left to read messages.')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOP-UP MODAL */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <span>{t('ওয়ালেটে টাকা রিচার্জ (Top-Up)', 'Top-Up Wallet Funds')}</span>
              </h3>
              <button onClick={() => setTopUpModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTopUpSubmit} className="space-y-4 pt-4">
              {/* Preset Amounts */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('টাকার পরিমাণ নির্বাচন করুন:', 'Select Amount (BDT):')}</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['100', '250', '500', '1000'].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        topUpAmount === amt
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-300'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  required
                  min="50"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="অন্য পরিমাণ লিখুন"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                />
              </div>

              {/* Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('পেমেন্ট মাধ্যম:', 'Payment Method:')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bkash', 'nagad', 'rocket'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setTopUpMethod(m)}
                      className={`py-2 rounded-xl text-xs font-bold border capitalize transition-all ${
                        topUpMethod === m
                          ? 'border-sky-500 bg-sky-50 text-sky-800 ring-2 ring-sky-300'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Number & Copy */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">
                    {topUpMethod.toUpperCase()} পার্সোনাল নম্বর:
                  </span>
                  <span className="font-mono font-bold text-slate-900">{settings.paymentGateways.bkashNumber}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  উক্ত নম্বরে ৳{topUpAmount} সেন্ড মানি করে নিচে পাওয়া ট্রানজেকশন আইডি দিন।
                </p>
              </div>

              {/* TrxID Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('ট্রানজেকশন আইডি (TrxID):', 'Transaction ID (TrxID):')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topUpTrxId}
                  onChange={(e) => setTopUpTrxId(e.target.value.toUpperCase())}
                  placeholder="উদাঃ BK88992211"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {topUpMsg.text && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  topUpMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {topUpMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingTopUp}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmittingTopUp ? 'প্রক্রিয়াকরণ চলছে...' : 'টপ-আপ রিকোয়েস্ট নিশ্চিত করুন'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW TICKET MODAL */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">{t('নতুন সাপোর্ট টিকেট তৈরি করুন', 'Create New Ticket')}</h3>
              <button onClick={() => setTicketModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('বিষয় (Subject):', 'Subject:')}</label>
                <input
                  type="text"
                  required
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  placeholder="উদাঃ আমার এনআইডি রি-ইস্যু অর্ডার সম্পর্কে তথ্য"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('ক্যাটাগরি:', 'Category:')}</label>
                <select
                  value={newTicketCategory}
                  onChange={(e) => setNewTicketCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                >
                  <option value="Order Status Query">অর্ডার স্ট্যাটাস অনুসন্ধান</option>
                  <option value="Payment / Wallet">পেমেন্ট অথবা ওয়ালেট ব্যালেন্স</option>
                  <option value="Service Correction">তথ্য সংশোধন ও ফাইল সমস্যা</option>
                  <option value="General Inquiry">সাধারণ সহায়তা</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('বিস্তারিত বার্তা:', 'Message Details:')}</label>
                <textarea
                  rows={4}
                  required
                  value={newTicketMsg}
                  onChange={(e) => setNewTicketMsg(e.target.value)}
                  placeholder="আপনার সমস্যার বিস্তারিত বিবরণ লিখুন..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {t('টিকেট দাখিল করুন', 'Submit Ticket')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {revisionModalOpen && selectedOrderForRevision && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t('কাজের সংশোধনের অনুরোধ', 'Request Deliverable Revision')}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    অর্ডার নং: {selectedOrderForRevision.orderNumber} ({selectedOrderForRevision.serviceNameBn})
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setRevisionModalOpen(false);
                  setSelectedOrderForRevision(null);
                  setRevisionError('');
                  setRevisionSuccess('');
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {revisionError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{revisionError}</span>
              </div>
            )}

            {revisionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{revisionSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRequestRevision} className="space-y-4">
              <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/50 text-[11px] text-amber-900 leading-relaxed">
                💡 <span className="font-bold">পরামর্শ:</span> আপনার প্রাপ্ত ডকুমেন্টে কী সংশোধন প্রয়োজন (যেমন: বানানের ত্রুটি, তারিখ সংশোধন, বা তথ্যের অমিল) তা বিস্তারিত লিখুন। আমাদের টিম দ্রুত আপনার ফাইলটি পুনরায় রিভিশন করে আপডেট কপি আপলোড করবে।
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('সংশোধনের সুনির্দিষ্ট বিবরণ:', 'Revision Details & Specific Changes:')}
                </label>
                <textarea
                  rows={4}
                  required
                  value={revisionReason}
                  onChange={(e) => setRevisionReason(e.target.value)}
                  placeholder="উদাঃ আমার নামের বানানে 'করিম'-এর বদলে 'করিমুল' হবে এবং পিতার নামের শেষ অংশ ঠিক করে দিন..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRevisionModalOpen(false);
                    setSelectedOrderForRevision(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRevision || !revisionReason.trim()}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingRevision ? 'পাঠানো হচ্ছে...' : t('অনুরোধ দাখিল করুন', 'Submit Request')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Voucher / Money Receipt Slip Modal */}
      <PrintableSlipModal
        order={printSlipOrder}
        isOpen={printSlipOpen}
        onClose={() => {
          setPrintSlipOpen(false);
          setPrintSlipOrder(null);
        }}
        settings={settings}
      />
    </div>
  );
};
