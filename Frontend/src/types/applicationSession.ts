export interface SharedApplicationSession {
  sessionId: string;
  applicationNo: string;
  productName: string;
  productModel: string;
  loanAmount: number;
  tenure: number;
  emiAmount: number;
  interestRate: number;
  vendorName: string;
  customerProgressStep: number;
  vendorStep: number;
  customerMobile: string;
  customerName: string;
  customerDetails: {
    name: string;
    mobile: string;
    email: string;
    pan: string;
    aadhaar: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  loanId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertApplicationSessionInput {
  sessionId: string;
  applicationNo?: string;
  productName?: string;
  productModel?: string;
  loanAmount?: number;
  tenure?: number;
  emiAmount?: number;
  interestRate?: number;
  vendorName?: string;
  customerProgressStep?: number;
  vendorStep?: number;
  customerMobile: string;
  customerName?: string;
  customerDetails?: SharedApplicationSession["customerDetails"];
  loanId?: string;
}
