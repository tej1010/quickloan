import type {
  ApplicationStatus,
  EmiStatus,
  LeadStatus,
  LoanStatus,
  NotificationType,
  PaymentMethod,
  UserRole,
} from "./enums";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email?: string;
  mobile: string;
  avatar?: string;
  isOwner?: boolean;
}

export interface VendorBusiness {
  storeName: string;
  ownerName: string;
  gstin: string;
  mobile: string;
  email: string;
  address: string;
}

export interface VendorBank {
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
}

export interface VendorKyc {
  gstCertificate?: string;
  panCard?: string;
  cancelledCheque?: string;
  status: "pending" | "verified" | "rejected";
}

export interface VendorProfile extends VendorBusiness {
  id: string;
  bank: VendorBank;
  kyc: VendorKyc;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isActive: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  customerName: string;
  mobile: string;
  email?: string;
  product: string;
  amount: number;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoanApplication {
  id: string;
  applicationNo: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  productName: string;
  loanAmount: number;
  tenure: number;
  emiAmount: number;
  interestRate: number;
  status: ApplicationStatus;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDetail extends LoanApplication {
  customer: {
    name: string;
    mobile: string;
    email: string;
    pan: string;
    aadhaar: string;
    address: string;
  };
  product: {
    name: string;
    category: string;
    processingFee: number;
  };
  kycDocuments: { name: string; url: string; status: string }[];
  consentLogs: { action: string; timestamp: string; ip: string }[];
  nachStatus: "pending" | "active" | "failed";
  disbursementStatus: "pending" | "processing" | "completed" | "failed";
  disbursementUtr?: string;
  draftProgress?: {
    step: number;
  };
}

export interface EmiScheduleItem {
  id: string;
  emiNumber: number;
  dueDate: string;
  amount: number;
  principal: number;
  interest: number;
  status: EmiStatus;
  paidDate?: string;
  lateCharges?: number;
}

export interface Disbursement {
  id: string;
  applicationNo: string;
  customerName: string;
  productName: string;
  loanAmount: number;
  utr: string;
  disbursedAt: string;
  status: "completed" | "processing" | "failed";
}

export interface LoanChargeItem {
  label: string;
  amount: number;
}

export interface CustomerLoan {
  id: string;
  loanNo: string;
  productName: string;
  productModel: string;
  loanAmount: number;
  outstandingAmount: number;
  emiAmount: number;
  nextEmiDate: string;
  tenure: number;
  paidEmis: number;
  interestRate: number;
  processingFee: number;
  otherCharges: LoanChargeItem[];
  effectiveApr: number;
  totalPayable: number;
  latePaymentChargePerDay: number;
  latePaymentChargePerMonth: number;
  firstEmiDate: string;
  finalEmiDate: string;
  status: LoanStatus;
  disbursedAt: string;
  device?: {
    brand: string;
    model: string;
    imei: string;
    image?: string;
  };
  paidAmount?: number;
  lateCharges?: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaymentReceipt {
  transactionId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  nextEmiDate?: string;
  loanNo: string;
}

export interface VendorDashboardStats {
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  totalDisbursedAmount: number;
  totalCustomers: number;
}

export interface CustomerDashboardStats {
  activeLoans: number;
  outstandingAmount: number;
  nextEmiAmount: number;
  nextEmiDate: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
