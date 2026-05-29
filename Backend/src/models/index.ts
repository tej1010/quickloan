export interface IUser {
  _id: string;
  role: "admin" | "vendor" | "customer";
  name: string;
  email?: string;
  mobile: string;
  passwordHash?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVendor {
  _id: string;
  userId: string;
  storeName: string;
  ownerName: string;
  gstin: string;
  address: string;
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  kyc: {
    gstCertificate?: string;
    panCard?: string;
    cancelledCheque?: string;
    status: "pending" | "verified" | "rejected";
  };
  isOwner: boolean;
  parentVendorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBranch {
  _id: string;
  vendorId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ILead {
  _id: string;
  vendorId: string;
  customerName: string;
  mobile: string;
  email?: string;
  product: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoanApplication {
  _id: string;
  applicationNo: string;
  vendorId: string;
  branchId?: string;
  customerId: string;
  productId: string;
  loanAmount: number;
  tenure: number;
  emiAmount: number;
  interestRate: number;
  status: string;
  kycDocuments: { name: string; url: string; status: string }[];
  consentLogs: { action: string; timestamp: Date; ip: string }[];
  nachStatus: string;
  disbursementStatus: string;
  disbursementUtr?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoan {
  _id: string;
  loanNo: string;
  applicationId: string;
  customerId: string;
  vendorId: string;
  productName: string;
  loanAmount: number;
  outstandingAmount: number;
  emiAmount: number;
  tenure: number;
  paidEmis: number;
  interestRate: number;
  processingFee: number;
  totalPayable: number;
  status: "active" | "closed" | "foreclosed";
  disbursedAt: Date;
  createdAt: Date;
}

export interface IEmiSchedule {
  _id: string;
  loanId: string;
  emiNumber: number;
  dueDate: Date;
  amount: number;
  principal: number;
  interest: number;
  status: "paid" | "pending" | "overdue" | "upcoming";
  paidDate?: Date;
  lateCharges?: number;
}

export interface IDisbursement {
  _id: string;
  applicationId: string;
  loanId: string;
  amount: number;
  utr: string;
  status: "completed" | "processing" | "failed";
  disbursedAt: Date;
}

export interface IPayment {
  _id: string;
  loanId: string;
  customerId: string;
  amount: number;
  transactionId: string;
  paymentMethod: "upi" | "net_banking" | "debit_card";
  type: "emi" | "foreclosure";
  status: "success" | "failed" | "pending";
  paidAt: Date;
}

export interface INotification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface IOtpSession {
  _id: string;
  mobile: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
}
