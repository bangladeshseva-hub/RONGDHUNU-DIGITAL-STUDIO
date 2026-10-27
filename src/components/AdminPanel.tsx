import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Activity,
  UserCheck,
  Layers,
  FileCheck2,
  Columns3,
  UserPlus,
  Send,
  RotateCcw,
  Wallet,
  BarChart3,
  Bell,
  Image,
  Palette,
  ShieldAlert,
  History,
  Database,
  Smartphone,
  Sparkles,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Lock,
  FileText,
  Save,
  Undo2,
  Mic,
  MicOff,
  Cpu,
  FileSearch,
  Check,
  Zap,
  Server,
  Plug,
  MessageSquare,
  Phone,
  Globe,
  Printer,
  Sliders,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Service,
  Category,
  Order,
  WalletTransaction,
  AutomationWorkflow,
  AutomationLog,
  FraudAlert,
  AuditLog,
  WebsiteSettings,
  ServiceField,
  User,
  UserPresence,
  Banner,
  BrandingVersion,
  AppNotification,
  BackupSnapshot,
  JobDeliverable,
  ApiIntegration,
  PluginItem,
  CommunicationLog,
  OcrAnalysisRecord,
  OfficialGovDirectoryItem
} from '../types';
import { PrintableSlipModal } from './PrintableSlipModal';
import { WorkflowDesignerTab } from './admin/WorkflowDesignerTab';
import { OcrAssistantTab } from './admin/OcrAssistantTab';
import { IdentityValidatorTab } from './admin/IdentityValidatorTab';
import { PredictiveSlaTab } from './admin/PredictiveSlaTab';
import { ApiHubTab } from './admin/ApiHubTab';
import { PluginMarketplaceTab } from './admin/PluginMarketplaceTab';
import { OmnichannelTab } from './admin/OmnichannelTab';
import { OfficialDirectoryTab } from './admin/OfficialDirectoryTab';
import { SystemHealthTab } from './admin/SystemHealthTab';
import { StaffCopilotTab } from './admin/StaffCopilotTab';
import { SocialMediaManagerTab } from './admin/SocialMediaManagerTab';
import { AdminCredentialsTab } from './admin/AdminCredentialsTab';
import { Share2, KeyRound, Home } from 'lucide-react';

interface AdminPanelProps {
  settings: WebsiteSettings;
  onUpdateSettings: (newSettings: WebsiteSettings) => void;
  onRefreshServices: () => void;
  onNavigateHome?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  settings,
  onUpdateSettings,
  onRefreshServices,
  onNavigateHome,
}) => {
  const { user, token } = useAuth();
  const { lang, t } = useLanguage();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Core Data
  const [metrics, setMetrics] = useState<any>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [walletTx, setWalletTx] = useState<WalletTransaction[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [activePresences, setActivePresences] = useState<UserPresence[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [brandingHistory, setBrandingHistory] = useState<BrandingVersion[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [backups, setBackups] = useState<BackupSnapshot[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  
  // Future AI Online Seva Automation Platform State
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>([]);
  const [apiIntegrations, setApiIntegrations] = useState<ApiIntegration[]>([]);
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([]);
  const [ocrRecords, setOcrRecords] = useState<OcrAnalysisRecord[]>([]);
  const [officialDirectories, setOfficialDirectories] = useState<OfficialGovDirectoryItem[]>([]);
  const [printSlipOrder, setPrintSlipOrder] = useState<Order | null>(null);
  const [printSlipOpen, setPrintSlipOpen] = useState(false);

  // Bengali Voice Recognition
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [speechRecognizer, setSpeechRecognizer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filters & Searches
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Delivery Modal State
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [deliveryOrder, setDeliveryOrder] = useState<Order | null>(null);
  const [delivTitle, setDelivTitle] = useState('');
  const [delivFileName, setDelivFileName] = useState('');
  const [delivFileUrl, setDelivFileUrl] = useState('');
  const [delivFileSize, setDelivFileSize] = useState('PDF / 1.5 MB');
  const [delivNotes, setDelivNotes] = useState('');

  // Assignment Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignOrder, setAssignOrder] = useState<Order | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [assignmentDeadline, setAssignmentDeadline] = useState('');

  // Service Builder Modal
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [svcNameBn, setSvcNameBn] = useState('');
  const [svcNameEn, setSvcNameEn] = useState('');
  const [svcCategoryId, setSvcCategoryId] = useState('');
  const [svcPrice, setSvcPrice] = useState(250);
  const [svcEstimatedTimeBn, setSvcEstimatedTimeBn] = useState('১ কর্মদিবস');
  const [svcDescriptionBn, setSvcDescriptionBn] = useState('');
  const [svcFields, setSvcFields] = useState<ServiceField[]>([]);

  // Banner Modal State
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerTitleBn, setBannerTitleBn] = useState('');
  const [bannerSubtitleBn, setBannerSubtitleBn] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerBtnText, setBannerBtnText] = useState('সেবা দেখুন');
  const [bannerBtnUrl, setBannerBtnUrl] = useState('#services');

  // Staff Create Modal State
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'super_admin' | 'service_manager' | 'operations_admin'>('service_manager');

  // Broadcast Notification State
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'all' | 'staff' | 'customer'>('all');

  // Central Branding Form State
  const [brandingForm, setBrandingForm] = useState<WebsiteSettings>(settings);
  const [brandingSnapshotLabel, setBrandingSnapshotLabel] = useState('');

  // AI Command Center State
  const [aiCmdInput, setAiCmdInput] = useState('');
  const [aiHistory, setAiHistory] = useState<{ role: 'user' | 'assistant'; text: string; actionPayload?: any }[]>([
    {
      role: 'assistant',
      text: `👋 আসসালামু আলাইকুম ${user?.name}! আমি রংধনু ডিজিটাল স্টুডিওর আল্ট্রা এআই অপারেশন্স অ্যাসিস্ট্যান্ট।\nআমি আপনার রিয়েল ডেটাবেজ ট্র্যাক করে যে কোনো তথ্য ও অ্যাকশন পরিচালনা করতে পারি:\n• "আজকের সেলস ও পেন্ডিং অর্ডারের বিবরণ দাও"\n• "কোন কর্মীর কাছে কতগুলো কাজ এসাইন করা আছে?"\n• "বিলম্বিত (Overdue) কাজের তালিকা দেখাও"\n• "নতুন সেবা বা ব্যানারের খসড়া তৈরি করো"`,
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Load All Admin Data
  const fetchAllAdminData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [
        mRes,
        oRes,
        sRes,
        cRes,
        wRes,
        custRes,
        stfRes,
        presRes,
        banRes,
        brHistRes,
        notifRes,
        bkRes,
        audRes,
        frdRes,
        wfRes,
        aLogRes,
        intRes,
        plugRes,
        commRes,
        ocrRes,
        dirRes,
      ] = await Promise.all([
        fetch('/api/admin/metrics', { headers }),
        fetch('/api/orders', { headers }),
        fetch('/api/services', { headers }),
        fetch('/api/categories', { headers }),
        fetch('/api/wallet/transactions', { headers }),
        fetch('/api/customers', { headers }),
        fetch('/api/admin/staff', { headers }),
        fetch('/api/presence/active', { headers }),
        fetch('/api/banners', { headers }),
        fetch('/api/branding/history', { headers }),
        fetch('/api/notifications', { headers }),
        fetch('/api/backup/list', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
        fetch('/api/admin/fraud-alerts', { headers }),
        fetch('/api/workflows', { headers }),
        fetch('/api/automation-logs', { headers }),
        fetch('/api/integrations', { headers }),
        fetch('/api/plugins', { headers }),
        fetch('/api/communications/logs', { headers }),
        fetch('/api/ocr/records', { headers }),
        fetch('/api/official-directory', { headers }),
      ]);

      if (mRes.ok) setMetrics(await mRes.json());
      if (oRes.ok) setOrders(await oRes.json());
      if (sRes.ok) setServices(await sRes.json());
      if (cRes.ok) setCategories(await cRes.json());
      if (wRes.ok) setWalletTx(await wRes.json());
      if (custRes.ok) setCustomers(await custRes.json());
      if (stfRes.ok) setStaffList(await stfRes.json());
      if (presRes.ok) {
        const presData = await presRes.json();
        setActivePresences(presData.presences || []);
      }
      if (banRes.ok) setBanners(await banRes.json());
      if (brHistRes.ok) setBrandingHistory(await brHistRes.json());
      if (notifRes.ok) setNotifications(await notifRes.json());
      if (bkRes.ok) setBackups(await bkRes.json());
      if (audRes.ok) setAuditLogs(await audRes.json());
      if (frdRes.ok) setFraudAlerts(await frdRes.json());
      if (wfRes.ok) setWorkflows(await wfRes.json());
      if (aLogRes.ok) setAutomationLogs(await aLogRes.json());
      if (intRes.ok) setApiIntegrations(await intRes.json());
      if (plugRes.ok) setPlugins(await plugRes.json());
      if (commRes.ok) setCommunicationLogs(await commRes.json());
      if (ocrRes.ok) setOcrRecords(await ocrRes.json());
      if (dirRes.ok) setOfficialDirectories(await dirRes.json());
    } catch (err) {
      console.error('Failed to fetch admin operations data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Bengali Voice Recognition
  const toggleVoiceRecording = () => {
    if (isVoiceListening) {
      if (speechRecognizer) {
        try { speechRecognizer.stop(); } catch (e) {}
      }
      setIsVoiceListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('আপনার ব্রাউজারে ভয়েস রিকগনিশন সাপোর্ট নেই। গুগল ক্রোম বা এজ ব্রাউজার ব্যবহার করুন।');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-BD';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsVoiceListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setAiCmdInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsVoiceListening(false);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognition.start();
      setSpeechRecognizer(recognition);
    } catch (err) {
      console.error('Speech recognition failed to initialize:', err);
      setIsVoiceListening(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
    // Auto-refresh presence every 20 seconds
    const interval = setInterval(() => {
      fetch('/api/presence/active', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => setActivePresences(d.presences || []))
        .catch(() => {});
    }, 20000);
    return () => clearInterval(interval);
  }, [token]);

  // AI Command Execution
  const handleExecuteAiCmd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCmdInput.trim() || isAiLoading) return;
    const cmd = aiCmdInput.trim();
    setAiCmdInput('');
    setAiHistory((prev) => [...prev, { role: 'user', text: cmd }]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/admin-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ command: cmd }),
      });
      const data = await res.json();
      setAiHistory((prev) => [
        ...prev,
        { role: 'assistant', text: data.reply, actionPayload: data.actionPayload },
      ]);
      fetchAllAdminData();
    } catch (err) {
      setAiHistory((prev) => [
        ...prev,
        { role: 'assistant', text: 'সার্ভারে কমান্ড প্রসেস করতে ব্যর্থ হয়েছে।' },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Deliver Job
  const handleDeliverJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryOrder || !delivTitle.trim() || !delivFileUrl.trim()) return;

    try {
      const res = await fetch(`/api/orders/${deliveryOrder.id}/deliver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: delivTitle,
          fileName: delivFileName || delivTitle,
          fileUrl: delivFileUrl,
          fileSize: delivFileSize,
          notes: delivNotes,
        }),
      });

      if (res.ok) {
        setDeliveryModalOpen(false);
        setDelivTitle('');
        setDelivFileUrl('');
        setDelivNotes('');
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Assign Job
  const handleAssignJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignOrder) return;

    try {
      const res = await fetch(`/api/orders/${assignOrder.id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignedStaffId: selectedStaffId,
          priority: selectedPriority,
          deadline: assignmentDeadline,
        }),
      });

      if (res.ok) {
        setAssignModalOpen(false);
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Quick Status Transition
  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          noteBn: `স্ট্যাটাস পরিবর্তন: ${newStatus}`,
          paymentStatus: newStatus === 'Processing' ? 'paid' : undefined,
        }),
      });
      if (res.ok) fetchAllAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  // Approve Top-Up
  const handleApproveTopUp = async (txId: string) => {
    try {
      const res = await fetch('/api/wallet/approve-topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactionId: txId }),
      });
      if (res.ok) fetchAllAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  // Reject Top-Up
  const handleRejectTopUp = async (txId: string) => {
    const reason = prompt('বাতিলের কারণ উল্লেখ করুন:') || 'অবৈধ TrxID বা পেমেন্ট মেলেনি';
    try {
      const res = await fetch('/api/wallet/reject-topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactionId: txId, reason }),
      });
      if (res.ok) fetchAllAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  // Save Central Branding
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/branding/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          settings: brandingForm,
          label: brandingSnapshotLabel || `ভার্সন হালনাগাদ (${new Date().toLocaleTimeString('bn-BD')})`,
        }),
      });

      if (res.ok) {
        onUpdateSettings(brandingForm);
        setBrandingSnapshotLabel('');
        alert('সেন্ট্রাল ব্র্যান্ডিং সংরক্ষিত হয়েছে এবং সকল পেজে ব্রডকাস্ট হয়েছে!');
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Restore Branding Version
  const handleRestoreBrandingVersion = async (versionId: string) => {
    if (!confirm('আপনি কি পূর্ববর্তী এই ব্র্যান্ডিং সংস্করণে ফিরে যেতে চান?')) return;
    try {
      const res = await fetch(`/api/branding/restore/${versionId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBrandingForm(data.settings);
        onUpdateSettings(data.settings);
        alert('পূর্ববর্তী সংস্করণ সফলভাবে রিস্টোর করা হয়েছে!');
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Database Backup
  const handleCreateBackup = async () => {
    try {
      const res = await fetch('/api/backup/create', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('ডাটাবেজ ব্যাকআপ স্ন্যাপশট সফলভাবে সম্পন্ন হয়েছে!');
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Restore Database Backup
  const handleRestoreBackup = async (backupId: string) => {
    if (!confirm('সতর্কতা: ব্যাকআপ রিস্টোর করলে বর্তমান ডেটাবেজের তথ্য ওই স্ন্যাপশটে ফিরে যাবে। নিশ্চিত?')) return;
    try {
      const res = await fetch(`/api/backup/restore/${backupId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('ডাটাবেজ সফলভাবে রিস্টোর হয়েছে!');
        fetchAllAdminData();
        onRefreshServices();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Staff
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/staff/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newStaffName,
          email: newStaffEmail,
          phone: newStaffPhone,
          password: newStaffPassword,
          role: newStaffRole,
        }),
      });

      if (res.ok) {
        setStaffModalOpen(false);
        setNewStaffName('');
        setNewStaffEmail('');
        setNewStaffPassword('');
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Broadcast Notification
  const handleBroadcastNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: broadcastTitle,
          message: broadcastMessage,
          targetRole: broadcastTarget,
        }),
      });

      if (res.ok) {
        setNotifModalOpen(false);
        setBroadcastTitle('');
        setBroadcastMessage('');
        fetchAllAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Export CSV
  const handleExportCSV = (type: 'orders' | 'customers' | 'wallet') => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'orders') {
      csvContent += 'Order ID,Customer,Phone,Service,Price,Status,Payment,Created\n';
      orders.forEach((o) => {
        csvContent += `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.serviceNameBn}",${o.servicePrice},"${o.orderStatus}","${o.paymentStatus}","${o.createdAt}"\n`;
      });
    } else if (type === 'customers') {
      csvContent += 'Customer ID,Name,Phone,Email,Wallet Balance,Total Orders,Created\n';
      customers.forEach((c) => {
        csvContent += `"${c.id}","${c.name}","${c.phone}","${c.email}",${c.walletBalance},${c.totalOrders},"${c.createdAt}"\n`;
      });
    } else if (type === 'wallet') {
      csvContent += 'Transaction ID,Customer,Type,Amount,Reason,Status,Date\n';
      walletTx.forEach((w) => {
        csvContent += `"${w.id}","${w.customerName}","${w.type}",${w.amount},"${w.reason}","${w.status}","${w.createdAt}"\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rongdhonu_${type}_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Navigation Items
  const navItems = [
    { id: 'dashboard', labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'live_customers', labelBn: 'লাইভ মনিটরিং', labelEn: 'Live Customers', icon: <Activity className="w-4 h-4 text-emerald-500" />, badge: activePresences.length },
    { id: 'jobs_all', labelBn: 'সকল কাজ ও অর্ডার', labelEn: 'All Jobs', icon: <FileCheck2 className="w-4 h-4 text-indigo-500" />, badge: orders.length },
    { id: 'kanban', labelBn: 'কানবান ওয়ার্কফ্লো', labelEn: 'Kanban Board', icon: <Columns3 className="w-4 h-4 text-sky-500" /> },
    { id: 'delivery_center', labelBn: 'ডেলিভারি সেন্টার', labelEn: 'Delivery Center', icon: <Send className="w-4 h-4 text-emerald-600" /> },
    
    // Advanced AI & Online Seva Automation Modules
    { id: 'workflow_designer', labelBn: 'অটোমেশন রুলস', labelEn: 'Workflow Engine', icon: <Zap className="w-4 h-4 text-amber-500" />, badge: workflows.length },
    { id: 'ocr_assistant', labelBn: 'এআই ডকুমেন্ট ওসিআর', labelEn: 'AI OCR Assistant', icon: <FileSearch className="w-4 h-4 text-sky-500" />, badge: ocrRecords.length },
    { id: 'identity_assistant', labelBn: 'আইডেন্টিটি ভ্যালিডেটর', labelEn: 'Govt ID Validator', icon: <Check className="w-4 h-4 text-emerald-500" /> },
    { id: 'predictive_sla', labelBn: 'কাজের চাপ ও এসএলএ', labelEn: 'SLA & Workload', icon: <Clock className="w-4 h-4 text-rose-500" /> },
    { id: 'staff_copilot', labelBn: 'স্টাফ কো-পাইলট', labelEn: 'Staff Copilot', icon: <Sliders className="w-4 h-4 text-indigo-500" /> },
    { id: 'api_hub', labelBn: 'এপিআই ইন্টিগ্রেশন হাব', labelEn: 'API Integration Hub', icon: <Server className="w-4 h-4 text-purple-500" />, badge: apiIntegrations.length },
    { id: 'plugin_market', labelBn: 'প্লাগইন মার্কেটপ্লেস', labelEn: 'Plugin Marketplace', icon: <Plug className="w-4 h-4 text-emerald-600" /> },
    { id: 'omnichannel', labelBn: 'কমিউনিকেশন হাব', labelEn: 'Omnichannel Logs', icon: <MessageSquare className="w-4 h-4 text-blue-500" /> },
    { id: 'official_directory', labelBn: 'সরকারি ডিরেক্টরি', labelEn: 'Official Directory', icon: <Globe className="w-4 h-4 text-teal-600" />, badge: officialDirectories.length },
    { id: 'system_health', labelBn: 'সিস্টেম হেলথ', labelEn: 'System Health', icon: <Cpu className="w-4 h-4 text-slate-700" /> },

    // Management & Settings
    { id: 'home_page', labelBn: 'হোম পেজ (Back to Home)', labelEn: 'Home Page', icon: <Home className="w-4 h-4 text-emerald-500" /> },
    { id: 'social_media', labelBn: 'সোশ্যাল মিডিয়া লিংক', labelEn: 'Social Media Links', icon: <Share2 className="w-4 h-4 text-indigo-500" /> },
    { id: 'admin_credentials', labelBn: 'ইউজারনেম ও পাসওয়ার্ড', labelEn: 'Admin Credentials', icon: <KeyRound className="w-4 h-4 text-purple-600" /> },
    { id: 'revisions', labelBn: 'সংশোধন ও অভিযোগ', labelEn: 'Revisions', icon: <RotateCcw className="w-4 h-4 text-amber-500" /> },
    { id: 'finance', labelBn: 'হিসাব ও পেমেন্ট', labelEn: 'Finance & Payments', icon: <Wallet className="w-4 h-4 text-emerald-500" />, badge: metrics.pendingTopUps || 0 },
    { id: 'customers', labelBn: 'গ্রাহক তালিকা', labelEn: 'Customers', icon: <Users className="w-4 h-4 text-blue-500" /> },
    { id: 'staff', labelBn: 'কর্মী ও ভূমিকা', labelEn: 'Staff & Roles', icon: <UserCheck className="w-4 h-4 text-purple-500" /> },
    { id: 'services', labelBn: 'সার্ভিস বিল্ডার', labelEn: 'Services & Forms', icon: <Layers className="w-4 h-4 text-cyan-500" /> },
    { id: 'banners', labelBn: 'বিজ্ঞাপন ও ব্যানার', labelEn: 'Banner Ads', icon: <Image className="w-4 h-4 text-pink-500" /> },
    { id: 'branding', labelBn: 'সেন্ট্রাল ব্র্যান্ডিং', labelEn: 'Branding & Theme', icon: <Palette className="w-4 h-4 text-amber-500" /> },
    { id: 'analytics', labelBn: 'রিপোর্ট ও বিশ্লেষণ', labelEn: 'Analytics', icon: <BarChart3 className="w-4 h-4 text-indigo-500" /> },
    { id: 'notifications', labelBn: 'নোটিফিকেশন সেন্টার', labelEn: 'Notifications', icon: <Bell className="w-4 h-4 text-rose-500" /> },
    { id: 'ai_command', labelBn: 'এআই অপারেশন্স', labelEn: 'AI Operations', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'security', labelBn: 'সিকিউরিটি সেন্টার', labelEn: 'Security Center', icon: <ShieldAlert className="w-4 h-4 text-rose-600" /> },
    { id: 'audit', labelBn: 'অডিট লগ', labelEn: 'Audit Logs', icon: <History className="w-4 h-4 text-slate-500" /> },
    { id: 'backup', labelBn: 'ব্যাকআপ সেন্টার', labelEn: 'Backup Center', icon: <Database className="w-4 h-4 text-teal-600" /> },
    { id: 'pwa_settings', labelBn: 'PWA অ্যাপ সেটিংস', labelEn: 'PWA Settings', icon: <Smartphone className="w-4 h-4 text-sky-600" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Top Operations Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-pink-500 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-sky-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {settings.brandNameBn} — অ্যাডমিন কন্ট্রোল সেন্টার
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              লগইনকৃত: <strong className="text-white">{user?.name}</strong> • লাইভ উপস্থিতি: <span className="text-emerald-400 font-bold">{activePresences.length} জন সক্রিয়</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all border border-emerald-400/30"
              title="মূল ওয়েবসাইটের হোম পেজে সরাসরি প্রবেশ করুন"
            >
              <Home className="w-4 h-4" />
              <span>হোম পেজ (Back to Home)</span>
            </button>
          )}
          <button
            onClick={() => handleExportCSV('orders')}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export Orders CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV এক্সপোর্ট</span>
          </button>
          <button
            onClick={fetchAllAdminData}
            disabled={isLoading}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Navigation Menu Grid (Horizontal scrollable pill list) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              {item.icon}
              <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-800'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. DASHBOARD OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t('মোট ভেরিফায়েড সেলস', 'Total Verified Sales')}</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">৳{(metrics.totalSalesBDT || 0).toLocaleString()}</p>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">✓ নিশ্চিত পেমেন্ট রেকর্ড</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t('লাইভ সক্রিয় গ্রাহক', 'Live Active Users')}</span>
              <p className="text-2xl sm:text-3xl font-black text-sky-600 mt-1">{activePresences.length}</p>
              <span className="text-[11px] text-sky-700 font-semibold mt-1 block">রিয়েল-টাইম প্রেজেন্স</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t('চলমান ও অপেক্ষমাণ কাজ', 'Running / Pending Jobs')}</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                {(metrics.pendingOrders || 0) + (metrics.processingOrders || 0)}
              </p>
              <span className="text-[11px] text-amber-700 font-semibold mt-1 block">প্রসেসিং তালিকায় রয়েছে</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">{t('সম্পন্ন ও ডেলিভারি সম্পন্ন', 'Completed Deliveries')}</span>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">{metrics.completedOrders || 0}</p>
              <span className="text-[11px] text-indigo-700 font-semibold mt-1 block">সফলভাবে হস্তান্তর</span>
            </div>
          </div>

          {/* Quick Operations Bar */}
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700">দ্রুত অপারেশন:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('delivery_center');
                  setDeliveryModalOpen(true);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>নতুন ডেলিভারি পাঠান</span>
              </button>
              <button
                onClick={() => setActiveTab('kanban')}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>কানবান বোর্ড দেখুন</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('notifications');
                  setNotifModalOpen(true);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>ব্রডকাস্ট নোটিশ পাঠান</span>
              </button>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <span>সর্বশেষ দাখিলকৃত কাজের তালিকা</span>
              </h3>
              <button
                onClick={() => setActiveTab('jobs_all')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <span>সকল দেখুন</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.orderStatus === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Processing'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      {order.serviceNameBn} — {order.customerName} ({order.customerPhone})
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-slate-900 block">৳{order.servicePrice}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(order.createdAt).toLocaleTimeString('bn-BD')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LIVE CUSTOMER MONITORING (Heartbeat / Presence) */}
      {/* ========================================================================= */}
      {activeTab === 'live_customers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                <span>লাইভ গ্রাহক উপস্থিতি মনিটরিং (Live Presence)</span>
              </h2>
              <p className="text-xs text-slate-500">
                হার্টবিট সিগন্যাল দ্বারা রিয়েল-টাইমে অনলাইনে থাকা ব্যবহারকারী ও পেজ অ্যাক্টিভিটি
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              ● {activePresences.length} জন এই মুহূর্তে অনলাইনে আছেন
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">ব্যবহারকারী</th>
                    <th className="p-4">ভূমিকা</th>
                    <th className="p-4">ডিভাইস ও ব্রাউজার</th>
                    <th className="p-4">বর্তমান পেজ / রুট</th>
                    <th className="p-4">সর্বশেষ অ্যাক্টিভ</th>
                    <th className="p-4 text-right">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activePresences.map((pres, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <div>
                          <p>{pres.name}</p>
                          {pres.phone && <p className="text-[10px] text-slate-400 font-mono">{pres.phone}</p>}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-indigo-700">{pres.role}</td>
                      <td className="p-4 text-slate-500">{pres.device || 'Android Mobile'}</td>
                      <td className="p-4 font-mono text-purple-700 font-semibold">{pres.currentRoute || '/'}</td>
                      <td className="p-4 text-slate-400">
                        {new Date(pres.lastSeen).toLocaleTimeString('bn-BD')}
                      </td>
                      <td className="p-4 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active Now
                        </span>
                      </td>
                    </tr>
                  ))}
                  {activePresences.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        কোনো সক্রিয় ব্যবহারকারী নেই
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. KANBAN WORKFLOW BOARD (Master Requirement) */}
      {/* ========================================================================= */}
      {activeTab === 'kanban' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Columns3 className="w-5 h-5 text-sky-600" />
                <span>কাজের অগ্রগতি কানবান বোর্ড (Job Workflow Board)</span>
              </h2>
              <p className="text-xs text-slate-500">
                এক ক্লিকেই কাজের স্ট্যাটাস এক পর্যায় থেকে অন্য পর্যায়ে রূপান্তর করুন
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Column 1: Submitted (নতুন কাজ) */}
            <div className="bg-slate-100/70 p-4 rounded-3xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">📥 জমা হওয়া কাজ (Submitted)</span>
                <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full text-slate-600">
                  {orders.filter((o) => o.orderStatus === 'Submitted').length}
                </span>
              </div>
              <div className="space-y-2.5">
                {orders
                  .filter((o) => o.orderStatus === 'Submitted')
                  .map((order) => (
                    <div key={order.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">{order.orderNumber}</span>
                        <span className="text-xs font-black text-emerald-600">৳{order.servicePrice}</span>
                      </div>
                      <p className="font-bold text-xs text-slate-800 line-clamp-1">{order.serviceNameBn}</p>
                      <p className="text-[11px] text-slate-500">{order.customerName}</p>
                      <button
                        onClick={() => handleQuickStatusChange(order.id, 'Processing')}
                        className="w-full py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        প্রসেসিংয়ে পাঠান →
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 2: In Progress (চলমান কাজ) */}
            <div className="bg-sky-50/50 p-4 rounded-3xl border border-sky-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-sky-200">
                <span className="text-xs font-bold text-sky-950">⚙️ চলমান প্রসেসিং (In Progress)</span>
                <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full text-sky-700">
                  {orders.filter((o) => o.orderStatus === 'Processing').length}
                </span>
              </div>
              <div className="space-y-2.5">
                {orders
                  .filter((o) => o.orderStatus === 'Processing')
                  .map((order) => (
                    <div key={order.id} className="bg-white p-3.5 rounded-2xl border border-sky-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">{order.orderNumber}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded">
                          {order.priority || 'Normal'}
                        </span>
                      </div>
                      <p className="font-bold text-xs text-slate-800 line-clamp-1">{order.serviceNameBn}</p>
                      <p className="text-[11px] text-slate-500">এসাইনকৃত: {order.assignedStaffName || 'প্রধান অ্যাডমিন'}</p>
                      <button
                        onClick={() => {
                          setDeliveryOrder(order);
                          setDelivTitle(`${order.serviceNameBn} - ফাইনাল ফাইল`);
                          setDeliveryModalOpen(true);
                        }}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        ফাইল ডেলিভারি করুন →
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 3: Ready for Delivery */}
            <div className="bg-amber-50/50 p-4 rounded-3xl border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <span className="text-xs font-bold text-amber-950">📦 ডেলিভারি প্রস্তুত (Ready)</span>
                <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full text-amber-700">
                  {orders.filter((o) => o.orderStatus === 'Payment Verification' || o.orderStatus === 'Need More Information').length}
                </span>
              </div>
              <div className="space-y-2.5">
                {orders
                  .filter((o) => o.orderStatus === 'Payment Verification' || o.orderStatus === 'Need More Information')
                  .map((order) => (
                    <div key={order.id} className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{order.orderNumber}</span>
                      <p className="font-bold text-xs text-slate-800">{order.serviceNameBn}</p>
                      <button
                        onClick={() => handleQuickStatusChange(order.id, 'Completed')}
                        className="w-full py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        সম্পন্ন চিহ্নিত করুন
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 4: Completed & Delivered */}
            <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <span className="text-xs font-bold text-emerald-950">✓ সম্পন্ন ও ডেলিভার্ড</span>
                <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full text-emerald-700">
                  {orders.filter((o) => o.orderStatus === 'Completed').length}
                </span>
              </div>
              <div className="space-y-2.5">
                {orders
                  .filter((o) => o.orderStatus === 'Completed')
                  .map((order) => (
                    <div key={order.id} className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">{order.orderNumber}</span>
                        <span className="text-xs font-black text-emerald-600">✓ Delivered</span>
                      </div>
                      <p className="font-bold text-xs text-slate-800 line-clamp-1">{order.serviceNameBn}</p>
                      <p className="text-[11px] text-slate-500">গ্রাহক: {order.customerName}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DELIVERY CENTER (Master Requirement G) */}
      {/* ========================================================================= */}
      {activeTab === 'delivery_center' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" />
                <span>ডেলিভারি সেন্টার ও ভার্সন কন্ট্রোল (Delivery Center)</span>
              </h2>
              <p className="text-xs text-slate-500">
                কাজ সম্পন্ন করে অফিশিয়াল ফাইল আপলোড, ভার্সন ট্র্যাকিং এবং গ্রাহকের কাছে নিরাপদ ডেলিভারি
              </p>
            </div>
            <button
              onClick={() => {
                if (orders.length > 0) {
                  setDeliveryOrder(orders[0]);
                  setDelivTitle(`${orders[0].serviceNameBn} - ফাইল`);
                  setDeliveryModalOpen(true);
                }
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ডেলিভারি ফাইল আপলোড</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">অর্ডার নং</th>
                    <th className="p-4">গ্রাহক</th>
                    <th className="p-4">সেবার বিবরণ</th>
                    <th className="p-4">সর্বশেষ ডেলিভারি ফাইল</th>
                    <th className="p-4">ডেলিভারি সময় ও ভার্সন</th>
                    <th className="p-4 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders
                    .filter((o) => o.deliverables && o.deliverables.length > 0)
                    .map((order) => {
                      const latestDeliv = order.deliverables![order.deliverables!.length - 1];
                      return (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-900">{order.orderNumber}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-900">{order.customerName}</p>
                            <p className="text-[10px] text-slate-400">{order.customerPhone}</p>
                          </td>
                          <td className="p-4 font-medium text-slate-800">{order.serviceNameBn}</td>
                          <td className="p-4">
                            <span className="font-bold text-emerald-800 flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-emerald-600" />
                              {latestDeliv.title}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              ডাউনলোড সংখ্যা: {latestDeliv.downloadCount || 0} বার
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              v{latestDeliv.version || 1}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {new Date(latestDeliv.deliveredAt).toLocaleString('bn-BD')}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                setDeliveryOrder(order);
                                setDelivTitle(`${order.serviceNameBn} - সংশোধিত কপি`);
                                setDeliveryModalOpen(true);
                              }}
                              className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-bold text-xs cursor-pointer"
                            >
                              নতুন ভার্সন দিন
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CENTRAL BRANDING & AUTOMATIC GLOBAL UPDATE (Master Requirement 3 & D) */}
      {/* ========================================================================= */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-indigo-600" />
                  <span>সেন্ট্রাল ব্র্যান্ডিং ও অটোমেটিক গ্লোবাল আপডেট সিস্টেম</span>
                </h2>
                <p className="text-xs text-slate-500">
                  এখান থেকে পরিবর্তন করলে হোমপেইজ, গ্রাহক ড্যাশবোর্ড, ফুটার ও PWA অ্যাপে একযোগে আপডেট হবে
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveBranding} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বাংলা ব্র্যান্ড নাম:</label>
                  <input
                    type="text"
                    value={brandingForm.brandNameBn}
                    onChange={(e) => setBrandingForm({ ...brandingForm, brandNameBn: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">English Brand Name:</label>
                  <input
                    type="text"
                    value={brandingForm.brandNameEn}
                    onChange={(e) => setBrandingForm({ ...brandingForm, brandNameEn: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">অফিসিয়াল হোয়াটসঅ্যাপ নম্বর:</label>
                  <input
                    type="text"
                    value={brandingForm.whatsapp}
                    onChange={(e) => setBrandingForm({ ...brandingForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">যোগাযোগের ইমেইল:</label>
                  <input
                    type="text"
                    value={brandingForm.email}
                    onChange={(e) => setBrandingForm({ ...brandingForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">স্ন্যাপশট নোট বা রিলিজ লেবেল (ঐচ্ছিক):</label>
                <input
                  type="text"
                  value={brandingSnapshotLabel}
                  onChange={(e) => setBrandingSnapshotLabel(e.target.value)}
                  placeholder="উদাঃ ঈদ ক্যাম্পেইন ও নতুন হটলাইন আপডেট"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>পরিবর্তন সংরক্ষণ ও লাইভ পাবলিশ করুন</span>
              </button>
            </form>
          </div>

          {/* Branding History & Version Rollback */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Undo2 className="w-4 h-4 text-purple-600" />
              <span>পূর্ববর্তী ব্র্যান্ডিং সংস্করণ ও রোলব্যাক সুবিধা</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {brandingHistory.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block">
                      সংরক্ষক: {item.savedBy} • {new Date(item.timestamp).toLocaleString('bn-BD')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRestoreBrandingVersion(item.id)}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    রোলব্যাক করুন
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. BANNER & ADVERTISEMENT MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Image className="w-5 h-5 text-pink-600" />
                <span>বিজ্ঞাপন ও ব্যানার ব্যবস্থাপনা (Banner Management)</span>
              </h2>
              <p className="text-xs text-slate-500">
                হোমপেইজের প্রমোশনাল ব্যানার, ছবি, শিরোনাম ও বাটনের লিংক নিয়ন্ত্রণ
              </p>
            </div>
            <button
              onClick={() => {
                setEditingBannerId(null);
                setBannerTitleBn('');
                setBannerSubtitleBn('');
                setBannerImageUrl('');
                setBannerModalOpen(true);
              }}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ব্যানার যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((ban) => (
              <div key={ban.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="h-40 bg-slate-900 relative overflow-hidden">
                  <img src={ban.imageUrl} alt={ban.titleBn} className="w-full h-full object-cover opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                    <span className="text-[10px] font-bold text-amber-300">অর্ডার: #{ban.displayOrder}</span>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{ban.titleBn}</h4>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-slate-600">{ban.subtitleBn}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-sky-600">বাটন: "{ban.buttonTextBn}"</span>
                    <span className="text-emerald-600 font-bold">✓ সক্রিয়</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. STAFF MANAGEMENT & ROLES */}
      {/* ========================================================================= */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                <span>অ্যাডমিন ও কর্মী ব্যবস্থাপনা (Staff & RBAC)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Super Admin, Manager ও Operator ভূমিকা ও অনুমতি নিয়ন্ত্রণ
              </p>
            </div>
            <button
              onClick={() => setStaffModalOpen(true)}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>নতুন কর্মী যোগ করুন</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">কর্মী</th>
                    <th className="p-4">ভূমিকা (Role)</th>
                    <th className="p-4">ফোন ও ইমেইল</th>
                    <th className="p-4">স্ট্যাটাস</th>
                    <th className="p-4 text-right">অনুমতি</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffList.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
                          {st.name.charAt(0)}
                        </div>
                        <span>{st.name}</span>
                      </td>
                      <td className="p-4 font-bold text-purple-700 uppercase">{st.role}</td>
                      <td className="p-4 font-mono">{st.email} • {st.phone}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {st.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-right font-semibold text-slate-500">
                        {st.role === 'super_admin' ? 'সম্পূর্ণ নিয়ন্ত্রণ' : 'সার্ভিস ও ডেলিভারি'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. BACKUP CENTER */}
      {/* ========================================================================= */}
      {activeTab === 'backup' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-600" />
                <span>ডেটাবেজ ব্যাকআপ ও রিস্টোর সেন্টার (Backup Center)</span>
              </h2>
              <p className="text-xs text-slate-500">
                নিয়মিত স্ন্যাপশট গ্রহণ এবং যে কোনো জরুরি পরিস্থিতিতে তাৎক্ষণিক রিস্টোর
              </p>
            </div>
            <button
              onClick={handleCreateBackup}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ব্যাকআপ তৈরি করুন</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {backups.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{b.name}</p>
                  <span className="text-[10px] text-slate-400">
                    সাইজ: {b.size} • সৃষ্টিকারী: {b.createdBy} • {new Date(b.createdAt).toLocaleString('bn-BD')}
                  </span>
                </div>
                <button
                  onClick={() => handleRestoreBackup(b.id)}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  এই স্ন্যাপশটে রিস্টোর করুন
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. PWA APP SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'pwa_settings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-sky-600" />
              <span>PWA ও অ্যাপ কনফিগারেশন সেটিংস (PWA Settings)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Web App Manifest, Service Worker ক্যাশ ভার্সন ও হোম স্ক্রিন ইনস্টল প্রম্পট
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="font-bold text-slate-800">PWA ম্যানিফেস্ট স্ট্যাটাস:</p>
              <p>অ্যাপের নাম: <strong>{settings.brandNameBn}</strong></p>
              <p>শর্ট নেম: <strong>রংধনু স্টুডিও</strong></p>
              <p>স্টার্ট URL: <strong>/</strong> (Standalone Mode)</p>
              <p>ক্যাশ ইঞ্জিন: <strong>Service Worker Active (v1.0)</strong></p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2 text-sky-950">
              <p className="font-bold">ইনস্টল প্রম্পট কার্যকারিতা:</p>
              <p>✓ Android Chrome: Native `beforeinstallprompt` সক্রিয়</p>
              <p>✓ iOS Safari: "Add to Home Screen" ভিজ্যুয়াল গাইড সংযুক্ত</p>
              <p>✓ Desktop: এক-ক্লিক অ্যাপ ক্রিয়েট শর্টকাট সক্রিয়</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. AI COMMAND CENTER (Tab ai_command) */}
      {/* ========================================================================= */}
      {activeTab === 'ai_command' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">এআই অ্যাডমিন কোপাইলট (AI Admin Copilot)</h3>
                <p className="text-xs text-slate-500">বাংলা ও ইংরেজি কমান্ডে রিয়েল ডেটাবেজ অ্যানালাইসিস</p>
              </div>
            </div>
          </div>

          <div className="h-[380px] overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            {aiHistory.map((item, idx) => (
              <div key={idx} className={`flex flex-col ${item.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-line ${
                  item.role === 'user'
                    ? 'bg-purple-700 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                }`}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleExecuteAiCmd} className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isVoiceListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={isVoiceListening ? 'ভয়েস রেকর্ডিং চলছে (ক্লিক করে থামান)' : 'বাংলায় কথা বলে কমান্ড দিন'}
            >
              {isVoiceListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-purple-600" />}
            </button>
            <input
              type="text"
              value={aiCmdInput}
              onChange={(e) => setAiCmdInput(e.target.value)}
              placeholder="অ্যাডমিন কমান্ড বা প্রশ্ন লিখুন (উদাঃ আজকের বিক্রয় বিবরণী দেখাও)..."
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={isAiLoading}
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isAiLoading ? 'প্রসেসিং...' : 'পাঠান'}
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ALL JOBS & ORDERS MANAGEMENT (Tab jobs_all) */}
      {/* ========================================================================= */}
      {activeTab === 'jobs_all' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <span>সকল সেবা আবেদন ও কাজের তালিকা (All Service Orders)</span>
              </h2>
              <p className="text-xs text-slate-500">
                মোট {orders.length} টি আবেদন দাখিল হয়েছে • রসিদ প্রিন্ট, প্রসেসিং ও ডেলিভারি নিয়ন্ত্রণ
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExportCSV('orders')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV এক্সপোর্ট</span>
              </button>
              <button
                onClick={fetchAllAdminData}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>রিফ্রেশ</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="অর্ডার নং, গ্রাহকের নাম বা মোবাইল নম্বর দিয়ে সার্চ করুন..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 text-xs">স্ট্যাটাস:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs"
              >
                <option value="all">সকল স্ট্যাটাস ({orders.length})</option>
                <option value="Submitted">দাখিলকৃত (Submitted)</option>
                <option value="Processing">চলমান (Processing)</option>
                <option value="Need More Information">তথ্য প্রয়োজন</option>
                <option value="Completed">সম্পন্ন (Completed)</option>
                <option value="Cancelled">বাতিল (Cancelled)</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">অর্ডার নং ও সময়</th>
                    <th className="p-4">গ্রাহক বিবরণ</th>
                    <th className="p-4">সেবা ও ফি</th>
                    <th className="p-4">পেমেন্ট</th>
                    <th className="p-4">বর্তমান স্ট্যাটাস</th>
                    <th className="p-4">দায়িত্বপ্রাপ্ত</th>
                    <th className="p-4 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders
                    .filter((o) => {
                      const matchQuery =
                        !orderSearchQuery ||
                        o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                        o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                        o.customerPhone.includes(orderSearchQuery);
                      const matchStatus =
                        orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
                      return matchQuery && matchStatus;
                    })
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-mono">
                          <span className="font-bold text-slate-900 block">{order.orderNumber}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900">{order.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{order.customerPhone}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-slate-900">{order.serviceNameBn}</p>
                          <p className="text-emerald-700 font-black text-xs">৳{order.servicePrice}</p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.paymentStatus === 'paid' ? 'পরিশোধিত' : 'বকেয়া / অপেক্ষমাণ'}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                            className="text-xs px-2.5 py-1 rounded-lg border bg-white font-bold cursor-pointer"
                          >
                            <option value="Submitted">দাখিলকৃত</option>
                            <option value="Processing">চলমান</option>
                            <option value="Need More Information">তথ্য প্রয়োজন</option>
                            <option value="Completed">সম্পন্ন</option>
                            <option value="Cancelled">বাতিল</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-semibold text-slate-700">
                            {order.assignedStaffName || 'প্রধান অ্যাডমিন'}
                          </span>
                          {order.priority && (
                            <span className="text-[10px] block text-purple-600 font-bold uppercase">
                              {order.priority}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setPrintSlipOrder(order);
                                setPrintSlipOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="অফিসিয়াল গ্রাহক রসিদ প্রিন্ট করুন"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-600" />
                              <span>রসিদ</span>
                            </button>
                            <button
                              onClick={() => {
                                setDeliveryOrder(order);
                                setDelivTitle(`${order.serviceNameBn} - ফাইল`);
                                setDeliveryModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="ফাইল ডেলিভারি প্রদান করুন"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>ডেলিভারি</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        কোনো অর্ডার বা আবেদন পাওয়া যায়নি
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUTOMATION TAB 1: WORKFLOW DESIGNER */}
      {/* ========================================================================= */}
      {activeTab === 'workflow_designer' && (
        <WorkflowDesignerTab
          token={token}
          workflows={workflows}
          automationLogs={automationLogs}
          onRefresh={fetchAllAdminData}
        />
      )}

      {/* ========================================================================= */}
      {/* AUTOMATION TAB 2: AI OCR ASSISTANT */}
      {/* ========================================================================= */}
      {activeTab === 'ocr_assistant' && (
        <OcrAssistantTab
          token={token}
          ocrRecords={ocrRecords}
          orders={orders}
          onRefresh={fetchAllAdminData}
        />
      )}

      {/* ========================================================================= */}
      {/* AUTOMATION TAB 3: IDENTITY VALIDATOR */}
      {/* ========================================================================= */}
      {activeTab === 'identity_assistant' && (
        <IdentityValidatorTab />
      )}

      {/* ========================================================================= */}
      {/* AUTOMATION TAB 4: PREDICTIVE SLA & WORKLOAD */}
      {/* ========================================================================= */}
      {activeTab === 'predictive_sla' && (
        <PredictiveSlaTab token={token} orders={orders} />
      )}

      {/* ========================================================================= */}
      {/* AUTOMATION TAB 5: STAFF COPILOT & CHECKLIST */}
      {/* ========================================================================= */}
      {activeTab === 'staff_copilot' && (
        <StaffCopilotTab orders={orders} />
      )}

      {/* ========================================================================= */}
      {/* AUTOMATION TAB 6: API INTEGRATION HUB */}
      {/* ========================================================================= */}
      {activeTab === 'api_hub' && (
        <ApiHubTab
          token={token}
          integrations={apiIntegrations}
          onRefresh={fetchAllAdminData}
        />
      )}

      {/* ========================================================================= */}
      {/* AUTOMATION TAB 7: PLUGIN MARKETPLACE */}
      {/* ========================================================================= */}
      {activeTab === 'plugin_market' && (
        <PluginMarketplaceTab
          token={token}
          plugins={plugins}
          onRefresh={fetchAllAdminData}
        />
      )}

      {/* ========================================================================= */}
      {/* AUTOMATION TAB 8: OMNICHANNEL COMMUNICATION */}
      {/* ========================================================================= */}
      {activeTab === 'omnichannel' && (
        <OmnichannelTab
          token={token}
          logs={communicationLogs}
          onRefresh={fetchAllAdminData}
        />
      )}

      {/* ========================================================================= */}
      {/* AUTOMATION TAB 9: OFFICIAL GOV DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'official_directory' && (
        <OfficialDirectoryTab
          directories={officialDirectories}
        />
      )}

      {/* ========================================================================= */}
      {/* AUTOMATION TAB 10: SYSTEM HEALTH MONITOR */}
      {/* ========================================================================= */}
      {activeTab === 'system_health' && (
        <SystemHealthTab token={token} />
      )}

      {/* ========================================================================= */}
      {/* HOME PAGE DIRECT SWITCH */}
      {/* ========================================================================= */}
      {activeTab === 'home_page' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
          <Home className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-lg">মূল ওয়েবসাইটের হোম পেজে নিয়ে যাওয়া হচ্ছে...</h3>
          <button
            onClick={() => onNavigateHome?.()}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            এখানে ক্লিক করে হোম পেজে প্রবেশ করুন →
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SOCIAL MEDIA MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'social_media' && (
        <SocialMediaManagerTab
          token={token}
          settings={settings}
          onRefresh={fetchAllAdminData}
        />
      )}

      {/* ========================================================================= */}
      {/* ADMIN CREDENTIALS & SECURITY */}
      {/* ========================================================================= */}
      {activeTab === 'admin_credentials' && (
        <AdminCredentialsTab token={token} />
      )}

      {/* ========================================================================= */}
      {/* FINANCE & PAYMENTS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <span>আর্থিক লেনদেন ও ওয়ালেট ডিপোজিট ম্যানেজমেন্ট</span>
              </h2>
              <p className="text-xs text-slate-500">
                bKash, Nagad, Rocket, Upay ও ব্যাংক ট্রান্সফার অনুমোদন ও রিজেক্ট
              </p>
            </div>
            <button
              onClick={() => handleExportCSV('wallet')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ট্রানজ্যাকশন CSV</span>
            </button>
          </div>

          {/* Pending Top-Up Requests */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>অপেক্ষমাণ ব্যালেন্স ডিপোজিট অনুমোদন ({walletTx.filter((w) => w.status === 'pending').length} টি)</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">গ্রাহক</th>
                    <th className="p-4">পেমেন্ট মেথড</th>
                    <th className="p-4">TrxID ও প্রেরক নম্বর</th>
                    <th className="p-4">পরিমাণ</th>
                    <th className="p-4">তারিখ</th>
                    <th className="p-4 text-right">অনুমোদন / বাতিল</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {walletTx
                    .filter((w) => w.status === 'pending')
                    .map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{tx.customerName}</td>
                        <td className="p-4">
                          <span className="font-bold text-indigo-700 uppercase">{tx.paymentMethod || 'bKash'}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-800">
                          {tx.trxId || 'N/A'}
                          {tx.senderPhone && <span className="block text-[10px] text-slate-400 font-normal">{tx.senderPhone}</span>}
                        </td>
                        <td className="p-4 font-black text-emerald-600 text-sm">৳{tx.amount}</td>
                        <td className="p-4 text-slate-400">{new Date(tx.createdAt).toLocaleString('bn-BD')}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveTopUp(tx.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-2xs"
                            >
                              অনুমোদন
                            </button>
                            <button
                              onClick={() => handleRejectTopUp(tx.id)}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-xs cursor-pointer"
                            >
                              বাতিল
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {walletTx.filter((w) => w.status === 'pending').length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        বর্তমানে কোনো অপেক্ষমাণ ডিপোজিট রিকোয়েস্ট নেই
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* All Transaction Ledger */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">সকল ওয়ালেট লেনদেনের খতিয়ান</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-4">ট্রানজ্যাকশন আইডি</th>
                    <th className="p-4">গ্রাহক</th>
                    <th className="p-4">বিবরণ / কারণ</th>
                    <th className="p-4">পরিমাণ</th>
                    <th className="p-4">স্ট্যাটাস</th>
                    <th className="p-4 text-right">তারিখ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {walletTx.slice(0, 30).map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80">
                      <td className="p-4 font-mono font-bold text-slate-700">{tx.id.substring(0, 12)}</td>
                      <td className="p-4 font-semibold text-slate-900">{tx.customerName}</td>
                      <td className="p-4">{tx.reason}</td>
                      <td className={`p-4 font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {tx.type === 'credit' ? `+৳${tx.amount}` : `-৳${tx.amount}`}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-400">{new Date(tx.createdAt).toLocaleDateString('bn-BD')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CUSTOMERS DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>নিবন্ধিত গ্রাহক তালিকা (Customers Directory)</span>
              </h2>
              <p className="text-xs text-slate-500">
                মোট নিবন্ধিত গ্রাহক: {customers.length} জন • ব্যালেন্স ও হিস্ট্রি
              </p>
            </div>
            <button
              onClick={() => handleExportCSV('customers')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>গ্রাহক ডেটা CSV</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">গ্রাহক</th>
                    <th className="p-4">মোবাইল নম্বর</th>
                    <th className="p-4">ইমেইল</th>
                    <th className="p-4">ওয়ালেট ব্যালেন্স</th>
                    <th className="p-4">মোট অর্ডার</th>
                    <th className="p-4 text-right">যোগদানের তারিখ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <span>{c.name}</span>
                      </td>
                      <td className="p-4 font-mono font-semibold text-slate-800">{c.phone}</td>
                      <td className="p-4 font-mono text-slate-500">{c.email || 'N/A'}</td>
                      <td className="p-4 font-black text-emerald-600">৳{(c.walletBalance || 0).toLocaleString()}</td>
                      <td className="p-4 font-bold text-slate-700">{c.totalOrders || 0} টি</td>
                      <td className="p-4 text-right text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString('bn-BD')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SERVICE BUILDER & CATALOG */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-600" />
                <span>সার্ভিস বিল্ডার ও ক্যাটালগ (Online Services)</span>
              </h2>
              <p className="text-xs text-slate-500">
                মোট সক্রিয় সেবা: {services.length} টি • সরকারি ও ডিজিটাল সেবার মূল্য ও ফর্ম ম্যানেজমেন্ট
              </p>
            </div>
            <button
              onClick={() => {
                setEditingServiceId(null);
                setSvcNameBn('');
                setSvcNameEn('');
                setSvcPrice(250);
                setSvcFields([]);
                setServiceModalOpen(true);
              }}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন সেবা যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((svc) => (
              <div key={svc.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                      {svc.category}
                    </span>
                    <span className="text-sm font-black text-emerald-600">৳{svc.price}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{svc.nameBn}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">{svc.nameEn}</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{svc.descriptionBn}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {svc.estimatedProcessingTimeBn}
                  </span>
                  <span className="text-cyan-700 font-bold">
                    {svc.formFields?.length || 0} টি ফর্ম ফিল্ড
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ANALYTICS & REPORTS */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>স্টুডিও বিশ্লেষণ ও পারফরম্যান্স রিপোর্ট (Analytics)</span>
            </h2>
            <p className="text-xs text-slate-500">রিয়েল-টাইম রাজস্ব, অর্ডার বৃদ্ধি ও টার্নঅ্যারাউন্ড রেট</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">মোট অর্ডার নিষ্পত্তি হার</span>
              <p className="text-3xl font-black text-indigo-600">
                {orders.length > 0 ? Math.round((orders.filter((o) => o.orderStatus === 'Completed').length / orders.length) * 100) : 0}%
              </p>
              <p className="text-[11px] text-slate-400">সফল ডেলিভারি অনুপাত</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">গড় প্রসেসিং সময়</span>
              <p className="text-3xl font-black text-sky-600">৩.৫ ঘণ্টা</p>
              <p className="text-[11px] text-slate-400">সরকারি আবেদন ড্রাফট টু ডেলিভারি</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold">গ্রাহক সন্তুষ্টি স্কোর</span>
              <p className="text-3xl font-black text-emerald-600">৯৯.২%</p>
              <p className="text-[11px] text-slate-400">জিরো রিজেকশন গ্যারান্টি</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NOTIFICATIONS CENTER */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-500" />
                <span>নোটিফিকেশন ও ঘোষণা কেন্দ্র (Broadcast Center)</span>
              </h2>
              <p className="text-xs text-slate-500">সকল গ্রাহক ও কর্মীদের কাছে লাইভ ব্রডকাস্ট বার্তা প্রেরণ</p>
            </div>
            <button
              onClick={() => setNotifModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ঘোষণা তৈরি করুন</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{n.title}</h4>
                  <p className="text-slate-600 mt-1">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    টার্গেট: {n.targetRole || 'all'} • {new Date(n.createdAt).toLocaleString('bn-BD')}
                  </span>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">কোনো নোটিফিকেশন নেই</div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REVISIONS & COMPLAINTS */}
      {/* ========================================================================= */}
      {activeTab === 'revisions' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-500" />
              <span>সংশোধন অনুরোধ ও অভিযোগ (Revisions & Support)</span>
            </h2>
            <p className="text-xs text-slate-500">গ্রাহকদের থেকে আসা সেবা সংশোধন এবং রিভিউ ফাইল ব্যবস্থাপনা</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 text-xs shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-slate-800">বর্তমানে কোনো অমীমাংসিত অভিযোগ বা সংশোধন অনুরোধ নেই</p>
            <p className="text-[11px] text-slate-400 mt-1">সব কাজ গ্রাহক অনুমোদিত অবস্থায় রয়েছে।</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECURITY & FRAUD PREVENTION */}
      {/* ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>সিকিউরিটি ও ফ্রড প্রতিরোধ কেন্দ্র (Security Center)</span>
            </h2>
            <p className="text-xs text-slate-500">সন্দেহজনক লেনদেন, মাল্টিপল আইপি লগইন ও সিকিউরিটি সতর্কতা</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {fraudAlerts.map((fa) => (
              <div key={fa.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-700 uppercase">[{fa.severity}]</span>
                    <span className="font-bold text-slate-900">{fa.reason}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">গ্রাহক: {fa.customerName} ({fa.customerPhone})</p>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(fa.createdAt).toLocaleString('bn-BD')}</span>
              </div>
            ))}
            {fraudAlerts.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                ✓ কোনো সক্রিয় ফ্রড সতর্কতা বা সিকিউরিটি থ্রেট নেই
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUDIT LOGS */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-600" />
              <span>সিস্টেম অডিট ও কার্যকলাপ লগ (Audit Logs)</span>
            </h2>
            <p className="text-xs text-slate-500">সকল অ্যাডমিন ও কর্মীদের স্পর্শকাতর অ্যাকশন ট্র্যাক রেকর্ড</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-4">ব্যবহারকারী</th>
                    <th className="p-4">পদক্ষেপ (Action)</th>
                    <th className="p-4">টার্গেট</th>
                    <th className="p-4">বিস্তারিত</th>
                    <th className="p-4 text-right">সময়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {auditLogs.slice(0, 30).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="p-4 font-bold text-slate-900">{log.userName || log.userId}</td>
                      <td className="p-4 text-indigo-700 font-bold">{log.action}</td>
                      <td className="p-4 text-slate-700">{log.targetEntity}</td>
                      <td className="p-4 text-slate-500 font-sans">{JSON.stringify(log.details)}</td>
                      <td className="p-4 text-right text-slate-400 font-sans">
                        {new Date(log.timestamp).toLocaleString('bn-BD')}
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-sans">কোনো অডিট লগ নেই</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. DELIVERY MODAL */}
      {/* ========================================================================= */}
      {deliveryModalOpen && deliveryOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-purple-700">{deliveryOrder.orderNumber}</span>
                <h3 className="font-bold text-slate-900 text-base">ফাইল ডেলিভারি প্রদান</h3>
              </div>
              <button onClick={() => setDeliveryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeliverJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ডেলিভারি ডকুমেন্টের শিরোনাম:</label>
                <input
                  type="text"
                  required
                  value={delivTitle}
                  onChange={(e) => setDelivTitle(e.target.value)}
                  placeholder="উদাঃ NID Reissue Verified Slip.pdf"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ফাইল ডাউনলোড লিংক (URL):</label>
                <input
                  type="text"
                  required
                  value={delivFileUrl}
                  onChange={(e) => setDelivFileUrl(e.target.value)}
                  placeholder="https://... অথবা অফিসিয়াল ডাউনলোড লিংক"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">গ্রাহকের জন্য বিশেষ নোট:</label>
                <textarea
                  rows={2}
                  value={delivNotes}
                  onChange={(e) => setDelivNotes(e.target.value)}
                  placeholder="উদাঃ নির্বাচন কমিশন সার্ভারে চালান ফি সফলভাবে জমা হয়েছে।"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                নিশ্চিত করুন ও গ্রাহকের কাছে ডেলিভারি পাঠান
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. STAFF CREATE MODAL */}
      {/* ========================================================================= */}
      {staffModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">নতুন কর্মী যোগ করুন</h3>
              <button onClick={() => setStaffModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">কর্মীর নাম:</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="নাম লিখুন"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">ইমেইল এড্রেস:</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="staff@rongdhonustudio.com"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">লগইন পাসওয়ার্ড:</label>
                <input
                  type="password"
                  required
                  value={newStaffPassword}
                  onChange={(e) => setNewStaffPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">ভূমিকা (Role):</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                >
                  <option value="service_manager">সার্ভিস ম্যানেজার (Service Manager)</option>
                  <option value="operations_admin">অপারেশন্স অ্যাডমিন (Operations Admin)</option>
                  <option value="super_admin">সুপার অ্যাডমিন (Super Admin)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                কর্মী একাউন্ট তৈরি করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. NOTIFICATION BROADCAST MODAL */}
      {/* ========================================================================= */}
      {notifModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">ইন-অ্যাপ নোটিশ ব্রডকাস্ট করুন</h3>
              <button onClick={() => setNotifModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcastNotification} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">বিজ্ঞপ্তির শিরোনাম:</label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="উদাঃ জরুরি সার্ভার রক্ষণাবেক্ষণ নোটিশ"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিস্তারিত বার্তা:</label>
                <textarea
                  rows={3}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="বার্তার বিবরণ লিখুন..."
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                সকল গ্রাহক ও কর্মীর কাছে পাঠান
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. OFFICIAL PRINTABLE VOUCHER / MONEY RECEIPT SLIP MODAL */}
      {/* ========================================================================= */}
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
