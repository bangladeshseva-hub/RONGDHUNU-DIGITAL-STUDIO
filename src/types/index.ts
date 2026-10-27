export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'operations_admin' | 'service_manager' | 'accounts_manager' | 'support_agent' | 'analyst' | 'customer';
  walletBalance: number;
  avatarUrl?: string;
  createdAt?: string;
  status?: 'active' | 'suspended';
}

export interface ServiceField {
  id: string;
  labelBn: string;
  labelEn: string;
  type: 'text' | 'number' | 'date' | 'select' | 'file' | 'textarea';
  required: boolean;
  placeholderBn?: string;
  placeholderEn?: string;
  options?: string[];
  helpTextBn?: string;
}

export interface Service {
  id: string;
  slug?: string;
  nameBn: string;
  nameEn: string;
  categoryId: string;
  categoryNameBn: string;
  category?: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  estimatedTimeBn: string;
  estimatedTimeEn: string;
  estimatedProcessingTimeBn?: string;
  iconName: string;
  descriptionBn: string;
  descriptionEn: string;
  instructionsBn: string;
  termsBn: string;
  fields: ServiceField[];
  formFields?: ServiceField[];
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

export interface Order {
  id: string;
  orderNumber: string;
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

export interface WalletTransaction {
  id: string;
  customerId: string;
  customerName: string;
  type: 'credit' | 'debit';
  amount: number;
  previousBalance: number;
  newBalance: number;
  reason: string;
  referenceId?: string;
  status: 'completed' | 'pending' | 'rejected' | 'approved';
  paymentMethod?: string;
  trxId?: string;
  senderPhone?: string;
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
  reason?: string;
  customerName?: string;
  customerPhone?: string;
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
  userName?: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  targetEntity?: string;
  details: string;
  timestamp: string;
}

export interface SocialMediaLink {
  id: string;
  platform: 'facebook' | 'whatsapp' | 'youtube' | 'instagram' | 'tiktok' | 'telegram' | 'twitter' | 'other';
  title: string;
  url: string;
  iconName?: string;
  displayOrder: number;
  isActive: boolean;
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
  socialMediaLinks?: SocialMediaLink[];
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
