import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string; // simulated safe hash for demo
  role: 'super_admin' | 'operations_admin' | 'service_manager' | 'accounts_manager' | 'support_agent' | 'analyst' | 'customer';
  walletBalance: number;
  avatarUrl?: string;
  createdAt: string;
  status: 'active' | 'suspended';
}

export interface ServiceField {
  id: string;
  labelBn: string;
  labelEn: string;
  type: 'text' | 'number' | 'date' | 'select' | 'file' | 'textarea';
  required: boolean;
  placeholderBn?: string;
  placeholderEn?: string;
  options?: string[]; // for select
  helpTextBn?: string;
}

export interface Service {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  categoryId: string;
  categoryNameBn: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  estimatedTimeBn: string;
  estimatedTimeEn: string;
  iconName: string;
  descriptionBn: string;
  descriptionEn: string;
  instructionsBn: string;
  termsBn: string;
  fields: ServiceField[];
  processingMode: 'manual' | 'semi_automated' | 'api_connected';
  status: 'published' | 'draft' | 'maintenance' | 'archived';
  isFeatured: boolean;
  isPopular: boolean;
  orderCount: number;
  displayOrder: number;
  createdAt: string;
}

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  iconName: string;
  descriptionBn?: string;
  displayOrder: number;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Submitted'
  | 'Payment Verification'
  | 'Processing'
  | 'Need More Information'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled'
  | 'Refund Pending'
  | 'Refunded';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  noteBn: string;
  updatedBy: string;
}

export interface JobDeliverable {
  id: string;
  version: number;
  title: string;
  fileName: string;
  fileUrl: string;
  downloadUrl?: string;
  uploadedAt?: string;
  fileSize?: string;
  notes?: string;
  deliveredBy: string;
  deliveredAt: string;
  downloadCount: number;
}

export interface JobRevisionRequest {
  id: string;
  orderId: string;
  customerNote: string;
  requestedAt: string;
  status: 'pending' | 'resolved';
  resolutionNote?: string;
}

export interface UserPresence {
  userId: string;
  name: string;
  role: string;
  phone?: string;
  ip?: string;
  device?: string;
  lastSeen: string;
  currentRoute: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  imageUrl: string;
  buttonTextBn: string;
  buttonUrl: string;
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface BrandingVersion {
  id: string;
  timestamp: string;
  savedBy: string;
  label: string;
  settings: WebsiteSettings;
}

export interface AppNotification {
  id: string;
  targetRole?: 'all' | 'staff' | 'customer';
  userId?: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'delivery' | 'security' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface BackupSnapshot {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  createdBy: string;
  data: any;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. RDS-2026-1001
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceNameBn: string;
  serviceNameEn: string;
  servicePrice: number;
  submissionData: Record<string, any>;
  uploadedFiles: { fieldId: string; fileName: string; fileUrl: string }[];
  paymentStatus: 'unpaid' | 'verification_pending' | 'paid' | 'refunded';
  paymentMethod: 'wallet' | 'bkash' | 'nagad' | 'rocket' | 'bank' | 'online_gateway';
  transactionId?: string;
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  adminNotes?: string;
  deliverables?: JobDeliverable[];
  revisions?: JobRevisionRequest[];
  customerNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  customerId: string;
  customerName: string;
  type: 'credit' | 'debit';
  amount: number;
  previousBalance: number;
  newBalance: number;
  reason: string;
  referenceId?: string; // orderId or topUp transactionId
  status: 'completed' | 'pending' | 'rejected';
  paymentMethod?: string;
  createdAt: string;
  approvedBy?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderId?: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: 'customer' | 'staff' | 'ai';
    message: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: 'PAYMENT_VERIFIED' | 'ORDER_SUBMITTED' | 'ORDER_OVERDUE' | 'STATUS_CHANGED' | 'DAILY_SCHEDULE' | 'MANUAL_RUN';
  conditions: {
    field: string;
    operator: 'equals' | 'greater_than' | 'contains';
    value: any;
  }[];
  actions: {
    type: 'UPDATE_ORDER_STATUS' | 'NOTIFY_CUSTOMER' | 'ASSIGN_STAFF' | 'SEND_SMS_ALERT' | 'LOG_EVENT' | 'TRIGGER_OCR';
    params: Record<string, any>;
  }[];
  requiresHumanApproval?: boolean;
  maxRetries?: number;
  lastExecutedAt?: string;
  executionCount: number;
  failureCount?: number;
  lastStatus?: 'success' | 'failed' | 'pending_approval' | 'idle';
}

export interface AutomationLog {
  id: string;
  workflowId: string;
  workflowName: string;
  triggerEvent: string;
  targetId: string;
  status: 'success' | 'failed' | 'skipped' | 'retry_pending';
  details: string;
  retryCount?: number;
  executionTimeMs?: number;
  errorStack?: string;
  timestamp: string;
}

export interface ApiIntegration {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'government_portal' | 'payment_gateway' | 'sms_messaging' | 'identity_verification';
  status: 'active' | 'configured' | 'demo_mode' | 'not_configured';
  officialUrl: string;
  portalDescriptionBn: string;
  webhookUrl?: string;
  apiKeyConfigured: boolean;
  lastPingTimestamp?: string;
  latencyMs?: number;
}

export interface PluginItem {
  id: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  category: 'messaging' | 'ai' | 'documents' | 'security' | 'payments';
  icon: string;
  version: string;
  isInstalled: boolean;
  isEnabled: boolean;
  author: string;
}

export interface CommunicationLog {
  id: string;
  channel: 'sms' | 'whatsapp' | 'email' | 'in_app';
  recipient: string;
  recipientName: string;
  subject?: string;
  content: string;
  status: 'sent' | 'delivered' | 'failed';
  retryCount: number;
  costBDT?: number;
  createdAt: string;
}

export interface OcrAnalysisRecord {
  id: string;
  orderId?: string;
  documentType: 'bangladesh_nid' | 'birth_certificate' | 'e_tin' | 'passport' | 'other';
  detectedFields: Record<string, string>;
  qualityScore: number;
  missingFields: string[];
  anomaliesDetected: string[];
  analyzedAt: string;
  isHumanVerified: boolean;
  verifiedBy?: string;
}

export interface OfficialGovDirectoryItem {
  id: string;
  serviceTitleBn: string;
  departmentBn: string;
  officialPortalUrl: string;
  officialGovFeeBn: string;
  requiredDocumentsBn: string[];
  stepByStepGuideBn: string[];
  statusTrackerUrl?: string;
  helpline: string;
}

export interface FraudAlert {
  id: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  targetType: 'transaction' | 'order' | 'user';
  targetId: string;
  status: 'unresolved' | 'investigating' | 'dismissed' | 'resolved';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface WebsiteSettings {
  brandNameBn: string;
  brandNameEn: string;
  taglineBn: string;
  taglineEn: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressBn: string;
  logoUrl?: string;
  faviconUrl?: string;
  appIconUrl?: string;
  themePrimaryColor?: string;
  announcementBar: {
    enabled: boolean;
    textBn: string;
    textEn: string;
    linkUrl?: string;
  };
  socialLinks: {
    facebook: string;
    youtube: string;
    whatsapp: string;
    telegram: string;
  };
  socialMediaLinks?: any[];
  paymentGateways: {
    bkashNumber: string;
    bkashType: string;
    nagadNumber: string;
    nagadType: string;
    rocketNumber: string;
    rocketType: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankRouting: string;
    sandboxGatewayEnabled: boolean;
  };
  pwaSettings?: {
    appName: string;
    shortName: string;
    themeColor: string;
    backgroundColor: string;
    installPromptEnabled: boolean;
    cacheVersion: string;
  };
  maintenanceMode: boolean;
  currency: string;
  timezone: string;
}

export interface DatabaseSchema {
  users: User[];
  categories: Category[];
  services: Service[];
  orders: Order[];
  walletTransactions: WalletTransaction[];
  supportTickets: SupportTicket[];
  workflows: AutomationWorkflow[];
  automationLogs: AutomationLog[];
  fraudAlerts: FraudAlert[];
  auditLogs: AuditLog[];
  settings: WebsiteSettings;
  presences: UserPresence[];
  banners: Banner[];
  brandingHistory: BrandingVersion[];
  notifications: AppNotification[];
  backups: BackupSnapshot[];
  apiIntegrations: ApiIntegration[];
  plugins: PluginItem[];
  communicationLogs: CommunicationLog[];
  ocrRecords: OcrAnalysisRecord[];
  officialDirectories: OfficialGovDirectoryItem[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// Initial Seed Data with Bengali government & digital citizen services
const initialSeedData: DatabaseSchema = {
  settings: {
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
  },
  users: [
    {
      id: 'usr_admin_1',
      name: 'প্রধান অ্যাডমিন (Super Admin)',
      email: 'admin@rongdhonustudio.com',
      phone: '01632-042441',
      passwordHash: 'admin123',
      role: 'super_admin',
      walletBalance: 25000,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      status: 'active',
    },
    {
      id: 'usr_manager_1',
      name: 'তন্ময় আহমেদ (Service Manager)',
      email: 'manager@rongdhonustudio.com',
      phone: '01711-223344',
      passwordHash: 'manager123',
      role: 'service_manager',
      walletBalance: 5000,
      createdAt: new Date().toISOString(),
      status: 'active',
    },
    {
      id: 'usr_customer_demo',
      name: 'মেহেদী হাসান (গ্রাহক)',
      email: 'customer@rongdhonustudio.com',
      phone: '01912-345678',
      passwordHash: 'customer123',
      role: 'customer',
      walletBalance: 1250,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      status: 'active',
    },
  ],
  categories: [
    {
      id: 'cat_nid',
      slug: 'nid-services',
      nameBn: 'জাতীয় পরিচয়পত্র (NID)',
      nameEn: 'National ID (NID)',
      iconName: 'CreditCard',
      descriptionBn: 'নতুন এনআইডি আবেদন, তথ্য সংশোধন, হারানো কার্ড রি-ইস্যু ও অনলাইন কপি সংগ্রহ',
      displayOrder: 1,
    },
    {
      id: 'cat_birth',
      slug: 'birth-registration',
      nameBn: 'জন্ম ও মৃত্যু নিবন্ধন',
      nameEn: 'Birth Registration',
      iconName: 'Baby',
      descriptionBn: 'অনলাইন জন্ম সনদ আবেদন, ইংরেজি অনুবাদ, বয়স ও নামের ভুল সংশোধন',
      displayOrder: 2,
    },
    {
      id: 'cat_land',
      slug: 'land-services',
      nameBn: 'ভূমি ও খতিয়ান (পর্চা)',
      nameEn: 'Land & Khatian',
      iconName: 'MapPin',
      descriptionBn: 'অনলাইন আরএস/সিএস/এসএ খতিয়ান কপি, দাখিলা ও মিউটেশন আবেদন',
      displayOrder: 3,
    },
    {
      id: 'cat_tax',
      slug: 'tax-tin',
      nameBn: 'কর ও ই-টিআইএন (e-TIN)',
      nameEn: 'Tax & e-TIN',
      iconName: 'Receipt',
      descriptionBn: 'নতুন ই-টিআইএন সনদপত্র প্রস্তুত ও বাৎসরিক জিরো রিটার্ন দাখিল ফর্ম',
      displayOrder: 4,
    },
    {
      id: 'cat_passport',
      slug: 'passport-visa',
      nameBn: 'ই-পাসপোর্ট ও ভিসা',
      nameEn: 'e-Passport & Visa',
      iconName: 'FileText',
      descriptionBn: 'ই-পাসপোর্ট অনলাইন আবেদন ফর্ম পূরণ, চালান জমা ও অ্যাপয়েন্টমেন্ট শিডিউলিং',
      displayOrder: 5,
    },
    {
      id: 'cat_driving',
      slug: 'driving-license',
      nameBn: 'ড্রাইভিং লাইসেন্স (BRTA)',
      nameEn: 'BRTA Driving License',
      iconName: 'Car',
      descriptionBn: 'শিক্ষানবিস ড্রাইভিং লাইসেন্স (লার্নার), ফি জমা ও স্মার্ট কার্ড রিনিউয়াল',
      displayOrder: 6,
    },
    {
      id: 'cat_utility',
      slug: 'utility-bills',
      nameBn: 'ইউটিলিটি ও সরকারি ফি',
      nameEn: 'Utility & Gov Fees',
      iconName: 'Zap',
      descriptionBn: 'পল্লী বিদ্যুৎ, ডেসকো, নেসকো, ওয়াসা, গ্যাস বিল ও ট্রাফিক জরিমানা পেমেন্ট',
      displayOrder: 7,
    },
    {
      id: 'cat_application',
      slug: 'online-applications',
      nameBn: 'চাকরি ও ভর্তি আবেদন',
      nameEn: 'Job & Admission Forms',
      iconName: 'Send',
      descriptionBn: 'বিসিএস, সরকারি চাকরি, বিশ্ববিদ্যালয় ভর্তি ফর্ম পূরণ ও প্রফেশনাল সিভি তৈরি',
      displayOrder: 8,
    },
  ],
  services: [
    {
      id: 'srv_nid_reissue',
      slug: 'nid-card-reissue',
      nameBn: 'জাতীয় পরিচয়পত্র হারানো / রি-ইস্যু আবেদন',
      nameEn: 'NID Card Lost / Reissue Application',
      categoryId: 'cat_nid',
      categoryNameBn: 'জাতীয় পরিচয়পত্র (NID)',
      price: 250,
      originalPrice: 350,
      costPrice: 100,
      estimatedTimeBn: '১ থেকে ২ কর্মদিবস',
      estimatedTimeEn: '1 to 2 business days',
      iconName: 'CreditCard',
      descriptionBn: 'হারিয়ে যাওয়া এনআইডি কার্ড পুনরায় সংগ্রহের জন্য জিডি কপিসহ নির্বাচন কমিশন সার্ভারে নিখুঁত আবেদন ও চালান জমা।',
      descriptionEn: 'Official submission for reissue of lost National ID card with GD copy and Treasury fee payment.',
      instructionsBn: 'আপনার এনআইডি নম্বর, জন্ম তারিখ এবং নিকটস্থ থানার জিডি নম্বরের ছবি আপলোড করুন।',
      termsBn: 'নির্বাচন কমিশন নীতিমালার আওতায় সরকারি ফি অন্তর্ভুক্ত। ভুল তথ্যের জন্য আবেদন প্রত্যাখ্যাত হলে পুনরায় যাচাই করা হবে।',
      fields: [
        { id: 'f_nid_number', labelBn: 'এনআইডি বা ভোটার নম্বর', labelEn: 'NID or Voter Number', type: 'text', required: true, placeholderBn: 'উদাঃ 19901234567890' },
        { id: 'f_dob', labelBn: 'জন্ম তারিখ (DD/MM/YYYY)', labelEn: 'Date of Birth', type: 'date', required: true },
        { id: 'f_district', labelBn: 'ভোটার এলাকা / জেলা', labelEn: 'Voter District', type: 'text', required: true, placeholderBn: 'উদাঃ ঢাকা' },
        { id: 'f_gd_copy', labelBn: 'থানার জিডি কপি (ছবি বা PDF)', labelEn: 'GD Copy Document', type: 'file', required: false, helpTextBn: 'হারিয়ে গেলে জিডি কপি দিলে দ্রুত কাজ হয়।' },
        { id: 'f_mobile', labelBn: 'যোগাযোগের মোবাইল নম্বর', labelEn: 'Contact Mobile Number', type: 'number', required: true, placeholderBn: '01XXXXXXXXX' },
      ],
      processingMode: 'semi_automated',
      status: 'published',
      isFeatured: true,
      isPopular: true,
      orderCount: 142,
      displayOrder: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'srv_nid_correction',
      slug: 'nid-information-correction',
      nameBn: 'এনআইডি কার্ডের নাম/বয়স/পিতার নাম সংশোধন',
      nameEn: 'NID Information Correction',
      categoryId: 'cat_nid',
      categoryNameBn: 'জাতীয় পরিচয়পত্র (NID)',
      price: 350,
      originalPrice: 500,
      costPrice: 150,
      estimatedTimeBn: '২ থেকে ৩ কর্মদিবস',
      estimatedTimeEn: '2 to 3 business days',
      iconName: 'Edit3',
      descriptionBn: 'জাতীয় পরিচয়পত্রের বাংলা ও ইংরেজি নাম, জন্ম তারিখ, পিতা-মাতার নাম সংশোধনের অনলাইন ফাইল প্রস্তুতকরণ।',
      descriptionEn: 'Preparation and filing of correction requests for NID name, DOB, parents name with supporting proofs.',
      instructionsBn: 'যে তথ্য সংশোধন করতে চান তার পক্ষে এসএসসি সনদ, জন্ম নিবন্ধন বা পাসপোর্ট কপি সংযুক্ত করুন।',
      termsBn: 'সংশোধনের ক্ষেত্রে নির্বাচন কমিশনের প্রয়োজনীয় ক্যাটাগরি অনুযায়ী চালান প্রদান করা হবে।',
      fields: [
        { id: 'f_nid_cur', labelBn: 'বর্তমান এনআইডি নম্বর', labelEn: 'Current NID Number', type: 'text', required: true },
        { id: 'f_correction_type', labelBn: 'কী সংশোধন করতে চান?', labelEn: 'Correction Type', type: 'select', required: true, options: ['নামের বানান (বাংলা/ইংরেজি)', 'জন্ম তারিখ', 'পিতা/মাতার নাম', 'ঠিকানা বা বৈবাহিক অবস্থা'] },
        { id: 'f_correct_info', labelBn: 'সঠিক তথ্য যা বসবে', labelEn: 'Corrected Information Text', type: 'textarea', required: true, placeholderBn: 'উদাঃ ইংরেজি নাম MD MEHEDI HASAN করতে হবে' },
        { id: 'f_doc_proof', labelBn: 'প্রমাণক কাগজপত্র (সনদ/পাসপোর্ট)', labelEn: 'Supporting Document', type: 'file', required: true },
      ],
      processingMode: 'manual',
      status: 'published',
      isFeatured: true,
      isPopular: true,
      orderCount: 89,
      displayOrder: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'srv_birth_cert_online',
      slug: 'online-birth-certificate',
      nameBn: 'ডিজিটাল জন্ম নিবন্ধন সনদ যাচাই ও আবেদন',
      nameEn: 'Digital Birth Certificate Verification & Apply',
      categoryId: 'cat_birth',
      categoryNameBn: 'জন্ম ও মৃত্যু নিবন্ধন',
      price: 180,
      originalPrice: 250,
      costPrice: 60,
      estimatedTimeBn: '১ কর্মদিবস',
      estimatedTimeEn: '1 business day',
      iconName: 'Baby',
      descriptionBn: '১৬ বা ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর যাচাই, অনলাইন কপি ও নতুন ইংরেজি জন্ম সনদের ফরম পূরণ।',
      descriptionEn: '16/17 digit birth registration verification, English translation and online application assistance.',
      instructionsBn: 'আবেদনকারীর নাম, পিতা ও মাতার নাম এবং আগের জন্ম নিবন্ধন নম্বর প্রদান করুন।',
      termsBn: 'ইউনিয়ন পরিষদ বা পৌরসভায় আবেদনের ট্র্যাকিং স্লিপ এবং ফি পরিশোধের নিশ্চিত রসিদ প্রদান করা হয়।',
      fields: [
        { id: 'f_birth_reg_no', labelBn: '১৭ ডিজিট জন্ম নিবন্ধন নম্বর', labelEn: '17 Digit Birth Reg Number', type: 'number', required: true, placeholderBn: '2001XXXXXXXXXXXXX' },
        { id: 'f_applicant_name', labelBn: 'আবেদনকারীর পূর্ণ নাম', labelEn: 'Applicant Full Name', type: 'text', required: true },
        { id: 'f_union_ward', labelBn: 'ইউনিয়ন / পৌরসভা / ওয়ার্ড', labelEn: 'Union / Municipality', type: 'text', required: true },
      ],
      processingMode: 'semi_automated',
      status: 'published',
      isFeatured: true,
      isPopular: false,
      orderCount: 65,
      displayOrder: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'srv_etin_certificate',
      slug: 'instant-etin-registration',
      nameBn: 'তাত্ক্ষণিক ই-টিআইএন (e-TIN) সনদ তৈরি',
      nameEn: 'Instant e-TIN Certificate Generation',
      categoryId: 'cat_tax',
      categoryNameBn: 'কর ও ই-টিআইএন (e-TIN)',
      price: 150,
      originalPrice: 200,
      costPrice: 40,
      estimatedTimeBn: '৩০ মিনিট',
      estimatedTimeEn: '30 minutes',
      iconName: 'Receipt',
      descriptionBn: 'জাতীয় রাজস্ব বোর্ড (NBR) সার্ভার থেকে বৈধ ১২ ডিজিটের নতুন ই-টিআইএন সার্টিফিকেট ডাউনলোড ও প্রিন্ট কপি।',
      descriptionEn: 'Valid 12 digit official NBR e-TIN Certificate generation for bank account or trade license.',
      instructionsBn: 'আপনার এনআইডি নম্বর ও এনআইডির সাথে লিঙ্ক করা মোবাইল নম্বর প্রয়োজন।',
      termsBn: 'ব্যক্তিগত টিআইএন এর ক্ষেত্রে প্রথমবার করদাতা হিসেবে রেজিস্ট্রেশন করা হয়।',
      fields: [
        { id: 'f_nid_etin', labelBn: 'এনআইডি নম্বর', labelEn: 'NID Number', type: 'text', required: true },
        { id: 'f_dob_etin', labelBn: 'জন্ম তারিখ', labelEn: 'Date of Birth', type: 'date', required: true },
        { id: 'f_occupation', labelBn: 'পেশা / উদ্দেশ্য', labelEn: 'Profession / Purpose', type: 'select', required: true, options: ['চাকরিজীবী', 'ব্যবসায়ী', 'ব্যাংক হিসাব খোলা', 'গাড়ি রেজিস্ট্রেশন', 'অন্যান্য'] },
      ],
      processingMode: 'api_connected',
      status: 'published',
      isFeatured: false,
      isPopular: true,
      orderCount: 210,
      displayOrder: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'srv_epassport_apply',
      slug: 'epassport-online-application',
      nameBn: 'ই-পাসপোর্ট অনলাইন আবেদন ও ফি জমা চালান',
      nameEn: 'e-Passport Online Application & Challan',
      categoryId: 'cat_passport',
      categoryNameBn: 'ই-পাসপোর্ট ও ভিসা',
      price: 450,
      originalPrice: 600,
      costPrice: 200,
      estimatedTimeBn: '২ থেকে ৪ ঘণ্টা',
      estimatedTimeEn: '2 to 4 hours',
      iconName: 'FileText',
      descriptionBn: '১০ বছর বা ৫ বছর মেয়াদি ৪৮/৬৪ পৃষ্ঠার ই-পাসপোর্ট অনলাইন ফর্ম নির্ভুল পূরণ, এ-চালান পেমেন্ট ও অ্যাপয়েন্টমেন্ট শিডিউল স্লিপ প্রস্তুত।',
      descriptionEn: 'Flawless 48/64 page 5/10 year e-Passport application with official A-Challan payment support.',
      instructionsBn: 'আপনার এনআইডি বা জন্ম নিবন্ধন, পেশা এবং জরুরি যোগাযোগের ব্যক্তির বিবরণ লিখুন।',
      termsBn: 'সরকারি পাসপোর্ট ফি আলাদা। আমরা অনলাইন ডাটা এন্ট্রি ও ফর্ম প্রস্তুত করে ফাইনাল পিডিএফ এবং চালান স্লিপ সরবরাহ করব।',
      fields: [
        { id: 'f_pass_type', labelBn: 'পাসপোর্টের মেয়াদ ও পৃষ্ঠা', labelEn: 'Passport Pages & Validity', type: 'select', required: true, options: ['৪৮ পৃষ্ঠা (৫ বছর)', '৪৮ পৃষ্ঠা (১০ বছর)', '৬৪ পৃষ্ঠা (৫ বছর)', '৬৪ পৃষ্ঠা (১০ বছর)'] },
        { id: 'f_pass_nid', labelBn: 'এনআইডি বা জন্ম নিবন্ধন নম্বর', labelEn: 'NID or Birth Certificate No', type: 'text', required: true },
        { id: 'f_pass_profession', labelBn: 'পেশা (Profession)', labelEn: 'Profession', type: 'text', required: true, placeholderBn: 'উদাঃ Private Service' },
        { id: 'f_pass_emergency', labelBn: 'জরুরি যোগাযোগের ফোন ও ঠিকানা', labelEn: 'Emergency Contact', type: 'textarea', required: true },
      ],
      processingMode: 'manual',
      status: 'published',
      isFeatured: true,
      isPopular: true,
      orderCount: 115,
      displayOrder: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'srv_land_khatian',
      slug: 'land-khatian-porcha-copy',
      nameBn: 'অনলাইন জমির খতিয়ান / পর্চা কপি সংগ্রহ',
      nameEn: 'Online Land Khatian / Porcha Copy',
      categoryId: 'cat_land',
      categoryNameBn: 'ভূমি ও খতিয়ান (পর্চা)',
      price: 200,
      originalPrice: 300,
      costPrice: 70,
      estimatedTimeBn: '১ কর্মদিবস',
      estimatedTimeEn: '1 business day',
      iconName: 'MapPin',
      descriptionBn: 'ভূমি মন্ত্রণালয়ের ই-পর্চা সার্ভার থেকে আরএস, সিএস, এসএ বা বিএস খতিয়ান যাচাই ও সার্টিফাইড অনুলিপি আবেদন।',
      descriptionEn: 'Certified digital Khatian/Porcha copy from Bangladesh Ministry of Land portal.',
      instructionsBn: 'বিভাগ, জেলা, উপজেলা, মৌজা এবং খতিয়ান নম্বর বা দাগ নম্বর উল্লেখ করুন।',
      termsBn: 'অনলাইন ভিউ কপি বা ডাকযোগে সার্টিফাইড কপির আবেদন স্লিপ সরবরাহ করা হবে।',
      fields: [
        { id: 'f_khatian_div', labelBn: 'বিভাগ ও জেলা', labelEn: 'Division & District', type: 'text', required: true, placeholderBn: 'উদাঃ ঢাকা বিভাগ, মানিকগঞ্জ জেলা' },
        { id: 'f_mouza', labelBn: 'মৌজা ও জেএল নম্বর', labelEn: 'Mouza & JL Number', type: 'text', required: true },
        { id: 'f_khatian_type', labelBn: 'খতিয়ানের ধরন', labelEn: 'Khatian Type', type: 'select', required: true, options: ['আরএস (RS)', 'সিএস (CS)', 'এসএ (SA)', 'বিএস (BS / City)'] },
        { id: 'f_khatian_num', labelBn: 'খতিয়ান নম্বর বা দাগ নম্বর', labelEn: 'Khatian Number', type: 'text', required: true },
      ],
      processingMode: 'semi_automated',
      status: 'published',
      isFeatured: false,
      isPopular: false,
      orderCount: 78,
      displayOrder: 6,
      createdAt: new Date().toISOString(),
    },
  ],
  orders: [
    {
      id: 'ord_1001',
      orderNumber: 'RDS-2026-1001',
      customerId: 'usr_customer_demo',
      customerName: 'মেহেদী হাসান (গ্রাহক)',
      customerPhone: '01912-345678',
      customerEmail: 'customer@rongdhonustudio.com',
      serviceId: 'srv_nid_reissue',
      serviceNameBn: 'জাতীয় পরিচয়পত্র হারানো / রি-ইস্যু আবেদন',
      serviceNameEn: 'NID Card Lost / Reissue Application',
      servicePrice: 250,
      submissionData: {
        f_nid_number: '19952691234567890',
        f_dob: '1995-04-12',
        f_district: 'ঢাকা উত্তর',
        f_mobile: '01912345678',
      },
      uploadedFiles: [
        { fieldId: 'f_gd_copy', fileName: 'mirpur_thana_gd_copy.pdf', fileUrl: '#' },
      ],
      paymentStatus: 'paid',
      paymentMethod: 'bkash',
      transactionId: 'BK9X7281A4',
      orderStatus: 'Processing',
      statusHistory: [
        { status: 'Submitted', timestamp: '2026-10-25T14:30:00Z', noteBn: 'গ্রাহক নতুন আবেদন দাখিল করেছেন।', updatedBy: 'মেহেদী হাসান' },
        { status: 'Payment Verification', timestamp: '2026-10-25T14:35:00Z', noteBn: 'বিকাশ TrxID: BK9X7281A4 যাচাই প্রক্রিয়াধীন।', updatedBy: 'System' },
        { status: 'Processing', timestamp: '2026-10-25T15:10:00Z', noteBn: 'পেমেন্ট অনুমোদিত। নির্বাচন কমিশন সার্ভারে ফাইল আপলোড চলছে।', updatedBy: 'প্রধান অ্যাডমিন' },
      ],
      assignedStaffId: 'usr_admin_1',
      assignedStaffName: 'প্রধান অ্যাডমিন',
      adminNotes: 'জিডি কপি ক্লিয়ার আছে, আজ সন্ধ্যার মধ্যেই ডেলিভারি স্লিপ আপলোড হবে।',
      customerNote: 'জরুরি প্রয়োজন, অনুগ্রহ করে দ্রুত দেখবেন।',
      createdAt: '2026-10-25T14:30:00Z',
      updatedAt: '2026-10-25T15:10:00Z',
    },
    {
      id: 'ord_1002',
      orderNumber: 'RDS-2026-1002',
      customerId: 'usr_customer_demo',
      customerName: 'মেহেদী হাসান (গ্রাহক)',
      customerPhone: '01912-345678',
      customerEmail: 'customer@rongdhonustudio.com',
      serviceId: 'srv_etin_certificate',
      serviceNameBn: 'তাত্ক্ষণিক ই-টিআইএন (e-TIN) সনদ তৈরি',
      serviceNameEn: 'Instant e-TIN Certificate Generation',
      servicePrice: 150,
      submissionData: {
        f_nid_etin: '19952691234567890',
        f_dob_etin: '1995-04-12',
        f_occupation: 'ব্যবসায়ী',
      },
      uploadedFiles: [],
      paymentStatus: 'paid',
      paymentMethod: 'wallet',
      transactionId: 'WLT-TXN-9901',
      orderStatus: 'Completed',
      statusHistory: [
        { status: 'Submitted', timestamp: '2026-10-26T09:00:00Z', noteBn: 'ওয়ালেট ব্যালেন্স থেকে সরাসরি ফি পরিশোধ।', updatedBy: 'System' },
        { status: 'Processing', timestamp: '2026-10-26T09:05:00Z', noteBn: 'এনবিআর সার্ভারে স্বয়ংক্রিয় রিকোয়েস্ট পাঠানো হয়েছে।', updatedBy: 'System' },
        { status: 'Completed', timestamp: '2026-10-26T09:20:00Z', noteBn: 'ই-টিআইএন সনদপত্র সফলভাবে ডাউনলোড উপযোগী করা হয়েছে।', updatedBy: 'তন্ময় আহমেদ' },
      ],
      deliverables: [
        {
          id: 'del_seed_1',
          version: 1,
          title: 'NBR e-TIN Certificate (Mehedi Hasan)',
          fileName: 'NBR_e-TIN_Certificate.pdf',
          fileUrl: '#',
          downloadUrl: '#',
          fileSize: '420 KB',
          deliveredBy: 'তন্ময় আহমেদ',
          deliveredAt: '2026-10-26T09:20:00Z',
          downloadCount: 1,
        }
      ],
      createdAt: '2026-10-26T09:00:00Z',
      updatedAt: '2026-10-26T09:20:00Z',
    },
  ],
  walletTransactions: [
    {
      id: 'tx_wlt_01',
      customerId: 'usr_customer_demo',
      customerName: 'মেহেদী হাসান (গ্রাহক)',
      type: 'credit',
      amount: 1400,
      previousBalance: 0,
      newBalance: 1400,
      reason: 'বিকাশ অ্যাকাউন্টের মাধ্যমে ব্যালেন্স রিচার্জ (টপ-আপ)',
      referenceId: 'BK88992211',
      status: 'completed',
      paymentMethod: 'bKash',
      createdAt: '2026-10-24T18:00:00Z',
      approvedBy: 'প্রধান অ্যাডমিন',
    },
    {
      id: 'tx_wlt_02',
      customerId: 'usr_customer_demo',
      customerName: 'মেহেদী হাসান (গ্রাহক)',
      type: 'debit',
      amount: 150,
      previousBalance: 1400,
      newBalance: 1250,
      reason: 'অর্ডার পেমেন্ট: ই-টিআইএন সনদ তৈরি (RDS-2026-1002)',
      referenceId: 'ord_1002',
      status: 'completed',
      paymentMethod: 'Wallet Balance',
      createdAt: '2026-10-26T09:00:00Z',
    },
  ],
  supportTickets: [
    {
      id: 'tkt_201',
      ticketNumber: 'TKT-8841',
      customerId: 'usr_customer_demo',
      customerName: 'মেহেদী হাসান (গ্রাহক)',
      customerPhone: '01912-345678',
      orderId: 'ord_1001',
      subject: 'এনআইডি রি-ইস্যু আবেদনের অগ্রগতি সম্পর্কে তথ্য',
      category: 'Order Status Query',
      priority: 'medium',
      status: 'open',
      messages: [
        {
          id: 'msg_1',
          senderId: 'usr_customer_demo',
          senderName: 'মেহেদী হাসান',
          senderRole: 'customer',
          message: 'আসসালামু আলাইকুম। আমার অর্ডার RDS-2026-1001 ফাইলটি নির্বাচন কমিশন সার্ভারে সাবমিট হয়েছে কি না দয়া করে জানাবেন?',
          createdAt: '2026-10-25T16:00:00Z',
        },
        {
          id: 'msg_2',
          senderId: 'usr_admin_1',
          senderName: 'প্রধান অ্যাডমিন',
          senderRole: 'staff',
          message: 'ওয়ালাইকুম আসসালাম ভাইয়া। হ্যাঁ, আপনার চালান ফি জমা দিয়ে নির্বাচন কমিশন সার্ভারে এন্ট্রি করা হয়েছে। আজকের মধ্যেই ডাউনলোড স্লিপ রেডি হয়ে যাবে।',
          createdAt: '2026-10-25T16:15:00Z',
        },
      ],
      createdAt: '2026-10-25T16:00:00Z',
      updatedAt: '2026-10-25T16:15:00Z',
    },
  ],
  workflows: [
    {
      id: 'wf_auto_pay_activate',
      name: 'ভেরিফায়েড পেমেন্টে স্বয়ংক্রিয় অর্ডার প্রসেসিং সক্রিয়করণ',
      description: 'গ্রাহক যখন বিকাশ/নগদে ভেরিফায়েড পেমেন্ট সম্পন্ন করেন তখন অর্ডার স্বয়ংক্রিয়ভাবে Processing এ যাবে এবং কাস্টমারকে এসএমএস নোটিফিকেশন দেবে।',
      isActive: true,
      trigger: 'PAYMENT_VERIFIED',
      conditions: [
        { field: 'paymentStatus', operator: 'equals', value: 'paid' },
      ],
      actions: [
        { type: 'UPDATE_ORDER_STATUS', params: { targetStatus: 'Processing', noteBn: 'অটোমেশন বট দ্বারা পেমেন্ট কনফার্মেশনের পর প্রসেসিং শুরু।' } },
        { type: 'NOTIFY_CUSTOMER', params: { title: 'পেমেন্ট নিশ্চিত ও কাজ শুরু!', message: 'আপনার পেমেন্ট সফল হয়েছে। রংপুর ও সদর সার্ভারে আপনার কাজ শুরু করা হয়েছে।' } },
      ],
      executionCount: 28,
      lastExecutedAt: '2026-10-26T08:30:00Z',
    },
    {
      id: 'wf_overdue_alert',
      name: '২৪ ঘণ্টার বেশি বিলম্বিত অর্ডারে অ্যাডমিন অ্যালার্ট',
      description: 'কোনো অর্ডার Processing অবস্থায় ২৪ ঘণ্টা অতিবাহিত হলে সাপোর্ট ম্যানেজারকে অবিলম্বে সতর্কবার্তা পাঠাবে।',
      isActive: true,
      trigger: 'ORDER_OVERDUE',
      conditions: [
        { field: 'orderStatus', operator: 'equals', value: 'Processing' },
      ],
      actions: [
        { type: 'SEND_SMS_ALERT', params: { recipientRole: 'service_manager', message: 'সতর্কতা: একটি অর্ডার ডেলিভারি সময়সীমা অতিক্রম করেছে।' } },
        { type: 'LOG_EVENT', params: { level: 'warning', event: 'SLA_BREACH_WARNING' } },
      ],
      executionCount: 4,
      lastExecutedAt: '2026-10-26T04:00:00Z',
    },
  ],
  automationLogs: [
    {
      id: 'log_1',
      workflowId: 'wf_auto_pay_activate',
      workflowName: 'ভেরিফায়েড পেমেন্টে স্বয়ংক্রিয় অর্ডার প্রসেসিং সক্রিয়করণ',
      triggerEvent: 'PAYMENT_VERIFIED',
      targetId: 'ord_1002',
      status: 'success',
      details: 'অর্ডার RDS-2026-1002 পেমেন্ট স্ট্যাটাস ভেরিফায়েড হয়েছে এবং প্রসেসিংয়ে পাঠানো হয়েছে।',
      timestamp: '2026-10-26T09:01:00Z',
    },
  ],
  fraudAlerts: [
    {
      id: 'frd_101',
      severity: 'medium',
      title: 'পুনরাবৃত্ত TrxID চেষ্টা সনাক্ত',
      description: 'বিকাশ TrxID BK9X7281A4 অন্য একটি অ্যাকাউন্টে সাবমিট করার চেষ্টা করা হয়েছিল। স্বয়ংক্রিয়ভাবে প্রত্যাখ্যাত হয়েছে।',
      targetType: 'transaction',
      targetId: 'BK9X7281A4',
      status: 'investigating',
      createdAt: '2026-10-25T17:00:00Z',
    },
  ],
  auditLogs: [
    {
      id: 'aud_1',
      actorId: 'usr_admin_1',
      actorName: 'প্রধান অ্যাডমিন',
      actorRole: 'super_admin',
      action: 'APPROVE_PAYMENT',
      entityType: 'order',
      entityId: 'ord_1001',
      details: 'বিকাশ পেমেন্ট TrxID: BK9X7281A4 ভেরিফাই করে অনুমোদন করা হয়েছে।',
      timestamp: '2026-10-25T15:10:00Z',
    },
    {
      id: 'aud_2',
      actorId: 'usr_admin_1',
      actorName: 'প্রধান অ্যাডমিন',
      actorRole: 'super_admin',
      action: 'UPDATE_SETTINGS',
      entityType: 'settings',
      entityId: 'announcement',
      details: 'হোমপেজ অফার ব্যানার টেক্সট হালনাগাদ করা হয়েছে।',
      timestamp: '2026-10-25T11:00:00Z',
    },
  ],
  banners: [
    {
      id: 'ban_1',
      titleBn: 'সকল অনলাইন সেবায় দ্রুততম ডেলিভারি',
      titleEn: 'Fastest Delivery on All Digital Services',
      subtitleBn: 'এনআইডি, জন্ম নিবন্ধন, ই-টিআইএন এবং পাসপোর্ট অনলাইন আবেদনে বিশেষ ছাড়',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
      buttonTextBn: 'সেবা দেখুন',
      buttonUrl: '#services',
      displayOrder: 1,
      isActive: true,
    },
    {
      id: 'ban_2',
      titleBn: 'বিকাশ ও নগদ পেমেন্টে তাৎক্ষণিক প্রসেসিং',
      titleEn: 'Instant Processing via bKash & Nagad',
      subtitleBn: 'আপনার কাজ জমা দিয়ে নিশ্চিন্তে লাইভ অগ্রগতি পর্যবেক্ষণ করুন',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
      buttonTextBn: 'আবেদন করুন',
      buttonUrl: '#services',
      displayOrder: 2,
      isActive: true,
    },
  ],
  brandingHistory: [
    {
      id: 'br_v1',
      timestamp: new Date().toISOString(),
      savedBy: 'প্রধান অ্যাডমিন',
      label: 'প্রাথমিক প্রোডাকশন ব্র্যান্ডিং v1.0',
      settings: {
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
      },
    },
  ],
  presences: [
    {
      userId: 'usr_customer_demo',
      name: 'মেহেদী হাসান (গ্রাহক)',
      role: 'customer',
      phone: '01912-345678',
      ip: '103.114.98.24',
      device: 'Android Mobile (Chrome)',
      lastSeen: new Date().toISOString(),
      currentRoute: '/dashboard',
      isActive: true,
    },
  ],
  notifications: [
    {
      id: 'notif_1',
      targetRole: 'staff',
      title: 'নতুন অর্ডার দাখিল হয়েছে',
      message: 'গ্রাহক মেহেদী হাসান এনআইডি রি-ইস্যু সেবার জন্য অর্ডার RDS-2026-1001 দাখিল করেছেন।',
      type: 'order',
      read: false,
      link: '/admin',
      createdAt: new Date().toISOString(),
    },
  ],
  backups: [
    {
      id: 'bk_init',
      name: 'সিস্টেম ইনিশিয়াল ডাটাবেজ স্ন্যাপশট',
      size: '42 KB',
      createdAt: new Date().toISOString(),
      createdBy: 'System Auto-Backup',
      data: null,
    },
  ],
  apiIntegrations: [
    {
      id: 'api_nid',
      nameBn: 'বাংলাদেশ নির্বাচন কমিশন অনলাইন এনআইডি পোর্টাল',
      nameEn: 'Bangladesh Election Commission NID Portal',
      category: 'government_portal',
      status: 'configured',
      officialUrl: 'https://services.nidw.gov.bd',
      portalDescriptionBn: 'জাতীয় পরিচয়পত্র রি-ইস্যু, সংশোধন ও অনলাইন সার্ভার কপি যাচাইয়ের অফিসিয়াল সরকারি লিংক।',
      webhookUrl: 'https://services.nidw.gov.bd/nid-pub/services',
      apiKeyConfigured: true,
      lastPingTimestamp: new Date().toISOString(),
      latencyMs: 124,
    },
    {
      id: 'api_etin',
      nameBn: 'জাতীয় রাজস্ব বোর্ড (এনবিআর) ই-টিআইএন সিস্টেম',
      nameEn: 'NBR National Board of Revenue e-TIN Portal',
      category: 'government_portal',
      status: 'configured',
      officialUrl: 'https://secure.incometax.gov.bd/TINHome',
      portalDescriptionBn: '১২ ডিজিটের নতুন করদাতা শনাক্তকরণ নম্বর (e-TIN) নিবন্ধন ও সার্টিফিকেট ডাউনলোড।',
      apiKeyConfigured: true,
      lastPingTimestamp: new Date().toISOString(),
      latencyMs: 180,
    },
    {
      id: 'api_bdris',
      nameBn: 'স্থানীয় সরকার বিভাগ অনলাইন জন্ম ও মৃত্যু নিবন্ধন (BDRIS)',
      nameEn: 'BDRIS Online Birth & Death Registration',
      category: 'government_portal',
      status: 'active',
      officialUrl: 'https://bdris.gov.bd',
      portalDescriptionBn: '১৭ ডিজিটের অনলাইন জন্ম নিবন্ধন যাচাই, ইংরেজি সনদ ও সংশোধনের অফিসিয়াল সরকারি সার্ভার।',
      apiKeyConfigured: true,
      lastPingTimestamp: new Date().toISOString(),
      latencyMs: 95,
    },
    {
      id: 'api_passport',
      nameBn: 'বাংলাদেশ ই-পাসপোর্ট অনলাইন পোর্টাল',
      nameEn: 'Bangladesh Department of Immigration & Passports',
      category: 'government_portal',
      status: 'active',
      officialUrl: 'https://www.epassport.gov.bd',
      portalDescriptionBn: 'নতুন ই-পাসপোর্ট আবেদন, রি-ইস্যু ও বায়োমেট্রিক এপয়েন্টমেন্ট শেডিউল পোর্টাল।',
      apiKeyConfigured: true,
      lastPingTimestamp: new Date().toISOString(),
      latencyMs: 140,
    },
    {
      id: 'api_land',
      nameBn: 'ভূমি মন্ত্রণালয় অনলাইন খতিয়ান ও পর্চা পোর্টাল',
      nameEn: 'Ministry of Land Digital Record System',
      category: 'government_portal',
      status: 'active',
      officialUrl: 'https://land.gov.bd',
      portalDescriptionBn: 'অনলাইনে সিএস, এসএ, আরএস, বিএস ও সিটি জরিপের খতিয়ান ও নামজারি আবেদন।',
      apiKeyConfigured: true,
      lastPingTimestamp: new Date().toISOString(),
      latencyMs: 210,
    },
    {
      id: 'api_bkash',
      nameBn: 'বিকাশ পেমেন্ট গেটওয়ে ও অটোমেটেড ট্রানজেকশন ট্র্যাকার',
      nameEn: 'bKash Merchant Checkout & Webhook API',
      category: 'payment_gateway',
      status: 'active',
      officialUrl: 'https://developer.bka.sh',
      portalDescriptionBn: 'রিয়েলটাইম TrxID ভেরিফিকেশন, স্বয়ংক্রিয় ওয়ালেট ক্রেডিট ও পেমেন্ট রিকনসিলিয়েশন।',
      webhookUrl: '/api/webhooks/bkash',
      apiKeyConfigured: true,
      lastPingTimestamp: new Date().toISOString(),
      latencyMs: 65,
    },
    {
      id: 'api_nagad',
      nameBn: 'নগদ ডিরেক্ট পে এপিআই ও ইনস্ট্যান্ট ভেরিফিকেশন',
      nameEn: 'Nagad Payment Gateway Integration',
      category: 'payment_gateway',
      status: 'active',
      officialUrl: 'https://nagad.com.bd',
      portalDescriptionBn: 'বাংলাদেশ ডাক বিভাগের ডিজিটাল লেনদেন সেবা নগদ মার্চেন্ট ভেরিফিকেশন।',
      webhookUrl: '/api/webhooks/nagad',
      apiKeyConfigured: true,
      lastPingTimestamp: new Date().toISOString(),
      latencyMs: 72,
    },
    {
      id: 'api_sms',
      nameBn: 'গ্রীনওয়েব লোকাল টেলকো এসএমএস গেটওয়ে',
      nameEn: 'Greenweb Bangladesh Telco SMS Gateway',
      category: 'sms_messaging',
      status: 'configured',
      officialUrl: 'https://greenweb.com.bd',
      portalDescriptionBn: 'গ্রাহকদের অর্ডার স্ট্যাটাস, TrxID ও ডেলিভারি লিংকসহ বাংলা এসএমএস পুশ নোটিফিকেশন।',
      apiKeyConfigured: true,
      lastPingTimestamp: new Date().toISOString(),
      latencyMs: 110,
    },
  ],
  plugins: [
    {
      id: 'p_ocr',
      nameBn: 'এআই ডকুমেন্ট ওসিআর ও কোয়ালিটি চেকার',
      nameEn: 'AI Document OCR & Quality Analyzer',
      descriptionBn: 'গ্রাহকের আপলোডকৃত এনআইডি, জন্মসনদ ও টিন সার্টিফিকেটের টেক্সট শনাক্তকরণ ও ব্লার ডিটেকশন।',
      category: 'ai',
      icon: 'FileSearch',
      version: '2.4.0',
      isInstalled: true,
      isEnabled: true,
      author: 'Rongdhonu AI Lab',
    },
    {
      id: 'p_voice',
      nameBn: 'বাংলা ভয়েস কমান্ড অপারেশনস ইঞ্জিন',
      nameEn: 'Bengali Voice Command Engine',
      descriptionBn: 'ওয়েব স্পিচ এপিআই দিয়ে বাংলা ভয়েস নির্দেশে অ্যাডমিন প্যানেলের কাজ নিয়ন্ত্রণ।',
      category: 'ai',
      icon: 'Mic',
      version: '1.8.0',
      isInstalled: true,
      isEnabled: true,
      author: 'Rongdhonu AI Lab',
    },
    {
      id: 'p_pdf',
      nameBn: 'অফিসিয়াল প্রিন্টেবল স্লিপ ও চালান জেনারেটর',
      nameEn: 'Printable Application Slip & Receipt Engine',
      descriptionBn: 'কিউআর কোডসহ পেশাদার মানসম্পন্ন প্রিন্ট রসিদ, চালান ও গ্রাহক কপি তৈরি।',
      category: 'documents',
      icon: 'Printer',
      version: '2.1.0',
      isInstalled: true,
      isEnabled: true,
      author: 'Core Engineering',
    },
    {
      id: 'p_fraud',
      nameBn: 'অটোমেটেড ফ্রড ও ডুপ্লিকেট ট্রানজেকশন ডিটেকশন',
      nameEn: 'Fraud & Duplicate TrxID Detection Engine',
      descriptionBn: 'একই TrxID বারংবার জমা দেওয়া বা অস্বাভাবিক ট্রানজেকশন স্বয়ংক্রিয় ফ্ল্যাগিং।',
      category: 'security',
      icon: 'ShieldAlert',
      version: '1.5.0',
      isInstalled: true,
      isEnabled: true,
      author: 'Security Team',
    },
    {
      id: 'p_sms',
      nameBn: 'বাল্ক এসএমএস নোটিফিকেশন সিস্টেম',
      nameEn: 'Bulk SMS Broadcast & Alert Engine',
      category: 'messaging',
      descriptionBn: 'অর্ডার পরিবর্তন বা ডেলিভারি নিশ্চিত হলে বাংলা এসএমএস সরাসরি গ্রাহকের মোবাইলে প্রেরণ।',
      icon: 'Send',
      version: '3.0.0',
      isInstalled: true,
      isEnabled: true,
      author: 'Core Engineering',
    },
    {
      id: 'p_whatsapp',
      nameBn: 'হোয়াটসঅ্যাপ অটোমেটেড রসিদ ও সাপোর্ট এলার্ট',
      nameEn: 'WhatsApp Cloud Automated Receipts',
      category: 'messaging',
      descriptionBn: 'হোয়াটসঅ্যাপ নম্বরে (01632-042441) অটোমেটেড অর্ডার কনফার্মেশন ও পিডিএফ প্রেরণ।',
      icon: 'MessageSquare',
      version: '2.0.0',
      isInstalled: true,
      isEnabled: true,
      author: 'Core Engineering',
    },
  ],
  communicationLogs: [
    {
      id: 'c_log_1',
      channel: 'sms',
      recipient: '01912345678',
      recipientName: 'মেহেদী হাসান',
      content: 'প্রিয় গ্রাহক, আপনার এনআইডি রি-ইস্যু অর্ডার (RDS-2026-1001) সফলভাবে সম্পন্ন হয়েছে। ফাইলটি ডাউনলোড করুন: rongdhonu.studio/track',
      status: 'delivered',
      retryCount: 0,
      costBDT: 0.35,
      createdAt: '2026-10-26T09:22:00Z',
    },
    {
      id: 'c_log_2',
      channel: 'in_app',
      recipient: 'usr_customer_demo',
      recipientName: 'মেহেদী হাসান',
      subject: 'পেমেন্ট ভেরিফিকেশন সফল',
      content: 'বিকাশ পেমেন্ট ৳৪৫০ সফলভাবে নিশ্চিত করা হয়েছে। আপনার কাজ প্রসেসিং-এ রয়েছে।',
      status: 'delivered',
      retryCount: 0,
      createdAt: '2026-10-25T15:10:00Z',
    },
  ],
  ocrRecords: [
    {
      id: 'ocr_demo_1',
      orderId: 'ord_1001',
      documentType: 'bangladesh_nid',
      detectedFields: {
        nameBn: 'মেহেদী হাসান',
        fatherNameBn: 'আব্দুল করিম',
        motherNameBn: 'ফাতেমা বেগম',
        dob: '1996-04-12',
        nidNumber: '19961234567890123',
        bloodGroup: 'B+',
      },
      qualityScore: 94,
      missingFields: [],
      anomaliesDetected: [],
      analyzedAt: '2026-10-26T09:05:00Z',
      isHumanVerified: true,
      verifiedBy: 'তন্ময় আহমেদ',
    },
  ],
  officialDirectories: [
    {
      id: 'dir_nid',
      serviceTitleBn: 'জাতীয় পরিচয়পত্র (এনআইডি) অনলাইন রি-ইস্যু ও তথ্য সংশোধন',
      departmentBn: 'বাংলাদেশ নির্বাচন কমিশন — এনআইডি উইং',
      officialPortalUrl: 'https://services.nidw.gov.bd',
      officialGovFeeBn: 'সাধারণ: ২৩০ টাকা | জরুরি: ৩৪৫ টাকা',
      requiredDocumentsBn: [
        'অনলাইন জন্ম নিবন্ধন সনদপত্রের রঙিন কপি',
        'এসএসসি/সমমান শিক্ষাগত যোগ্যতার সনদ (যদি থাকে)',
        'পাসপোর্ট বা ড্রাইভিং লাইসেন্স (প্রযোজ্য ক্ষেত্রে)',
        'ইউনিয়ন পরিষদ বা পৌরসভা নাগরিক সনদপত্র',
      ],
      stepByStepGuideBn: [
        'নির্বাচন কমিশন পোর্টালে (services.nidw.gov.bd) অ্যাকাউন্ট রেজিস্টার করুন।',
        'মোবাইল নম্বর ও ফেস ভেরিফিকেশন (NID Wallet App) সম্পন্ন করুন।',
        'প্রয়োজনীয় তথ্য সংশোধন সিলেক্ট করে প্রমাণপত্র আপলোড করুন।',
        'বিকাশ বা নগদের মাধ্যমে সরকারি ফি পরিশোধ করে আবেদনটি সাবমিট করুন।',
      ],
      statusTrackerUrl: 'https://services.nidw.gov.bd/nid-pub/claim-account',
      helpline: '105',
    },
    {
      id: 'dir_tin',
      serviceTitleBn: 'ই-টিআইএন (e-TIN) অনলাইন করদাতা নিবন্ধন ও সনদপত্র গ্রহণ',
      departmentBn: 'জাতীয় রাজস্ব বোর্ড (এনবিআর)',
      officialPortalUrl: 'https://secure.incometax.gov.bd/TINHome',
      officialGovFeeBn: 'বিনামূল্যে (০ টাকা সরকারি ফি)',
      requiredDocumentsBn: [
        'আবেদনকারীর সঠিক জাতীয় পরিচয়পত্র (এনআইডি) নম্বর',
        'চলমান সক্রিয় মোবাইল নম্বর (ওটিপি যাচাইয়ের জন্য)',
        'ব্যবসায়িক নাম ও বর্তমান কর্মক্ষেত্র বা পেশার বিবরণ',
      ],
      stepByStepGuideBn: [
        'এনবিআর পোর্টালে রেজিস্টার অপশনে ক্লিক করুন।',
        'এনআইডি নম্বর ও জন্মতারিখ প্রদান করে স্বয়ংক্রিয় নির্বাচন কমিশন ডাটাবেজ যাচাই করুন।',
        'মোবাইলে আসা ওটিপি ভেরিফাই করে তাৎক্ষণিক ই-টিআইএন সনদপত্র প্রিন্ট করুন।',
      ],
      statusTrackerUrl: 'https://secure.incometax.gov.bd',
      helpline: '16111',
    },
    {
      id: 'dir_bdris',
      serviceTitleBn: 'অনলাইন জন্ম নিবন্ধন আবেদন, সংশোধন ও ইংরেজি সনদ প্রাপ্তি',
      departmentBn: 'রেজিস্ট্রার জেনারেলের কার্যালয়, জন্ম ও মৃত্যু নিবন্ধন',
      officialPortalUrl: 'https://bdris.gov.bd',
      officialGovFeeBn: 'বয়সভেদে ২৫ থেকে ১০০ টাকা',
      requiredDocumentsBn: [
        'ইপিআই টিকাকার্ড বা চিকিৎসা প্রত্যয়নপত্র',
        'পিতা-মাতার অনলাইন জন্ম নিবন্ধন ও এনআইডি কপি',
        'স্থায়ী বা বর্তমান ঠিকানার হোল্ডিং ট্যাক্স বা বিদ্যুৎ বিল',
      ],
      stepByStepGuideBn: [
        'bdris.gov.bd পোর্টালে নতুন আবেদন বা সংশোধন অপশনে যান।',
        'পিতা-মাতার ১৭ ডিজিট জন্ম নিবন্ধন প্রবেশ করান।',
        'নির্দিষ্ট ইউনিয়ন পরিষদ বা পৌরসভা অফিস নির্বাচন করে ফর্ম জমা দিন।',
        'আবেদনের প্রিন্ট কপি নিয়ে সংশ্লিষ্ট অফিসে প্রয়োজনীয় প্রমাণপত্র জমা দিন।',
      ],
      statusTrackerUrl: 'https://bdris.gov.bd/br/application/status',
      helpline: '16122',
    },
    {
      id: 'dir_passport',
      serviceTitleBn: 'ই-পাসপোর্ট অনলাইন আবেদন ও অ্যাপয়েন্টমেন্ট গ্রহণ',
      departmentBn: 'ইমিগ্রেশন ও পাসপোর্ট অধিদপ্তর (DIP)',
      officialPortalUrl: 'https://www.epassport.gov.bd',
      officialGovFeeBn: '৫ বছর (৪৮ পাতা): ৪,০২৫ টাকা | ১০ বছর: ৫,৭৫০ টাকা',
      requiredDocumentsBn: [
        '১৭ ডিজিট ডিজিটাল জন্ম নিবন্ধন সনদ অথবা জাতীয় পরিচয়পত্র',
        'পুরাতন পাসপোর্ট থাকলে তার মূল কপি',
        'ব্যাংক চালান বা অনলাইন পেমেন্ট রসিদ',
      ],
      stepByStepGuideBn: [
        'epassport.gov.bd পোর্টালে অনলাইন ফর্ম সঠিকভাবে পূরণ করুন।',
        'পাসপোর্ট ফি চালান বা মোবাইল ব্যাংকিংয়ের মাধ্যমে পরিশোধ করুন।',
        'বায়োমেট্রিক ও ছবি তোলার জন্য নির্দিষ্ট তারিখ বুক করুন।',
      ],
      statusTrackerUrl: 'https://www.epassport.gov.bd/authorization/application-status',
      helpline: '16445',
    },
  ],
};

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      ensureDirectoryExistence(DB_FILE);
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Automatic non-destructive schema migration for new collections
        if (!parsed.presences) parsed.presences = initialSeedData.presences;
        if (!parsed.banners) parsed.banners = initialSeedData.banners;
        if (!parsed.brandingHistory) parsed.brandingHistory = initialSeedData.brandingHistory;
        if (!parsed.notifications) parsed.notifications = initialSeedData.notifications;
        if (!parsed.backups) parsed.backups = initialSeedData.backups;
        if (!parsed.apiIntegrations) parsed.apiIntegrations = initialSeedData.apiIntegrations;
        if (!parsed.plugins) parsed.plugins = initialSeedData.plugins;
        if (!parsed.communicationLogs) parsed.communicationLogs = initialSeedData.communicationLogs;
        if (!parsed.ocrRecords) parsed.ocrRecords = initialSeedData.ocrRecords;
        if (!parsed.officialDirectories) parsed.officialDirectories = initialSeedData.officialDirectories;
        return parsed;
      }
    } catch (e) {
      console.error('Error reading database file, initializing seed:', e);
    }
    this.saveData(initialSeedData);
    return JSON.parse(JSON.stringify(initialSeedData));
  }

  private saveData(data: DatabaseSchema) {
    try {
      ensureDirectoryExistence(DB_FILE);
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]) {
    this.data[key] = value;
    this.saveData(this.data);
  }

  public updateAll(updater: (db: DatabaseSchema) => void) {
    updater(this.data);
    this.saveData(this.data);
  }

  public getAll(): DatabaseSchema {
    return this.data;
  }
}

export const db = new DatabaseManager();
