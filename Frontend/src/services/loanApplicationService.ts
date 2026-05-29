export type FieldSource = "aadhaar" | "pan" | "address_proof" | "mobile_verified" | "customer_record" | "manual";

export interface ExtractedField {
  value: string;
  source: FieldSource | null;
  editable: boolean;
}

export interface CustomerApplicationDetails {
  name: ExtractedField;
  mobile: ExtractedField;
  email: ExtractedField;
  address: ExtractedField;
  city: ExtractedField;
  state: ExtractedField;
  pincode: ExtractedField;
  pan: ExtractedField;
  aadhaar: ExtractedField;
  dob: ExtractedField;
}

export interface KycDocumentUpload {
  type: "aadhaar" | "pan" | "address_proof";
  fileName: string;
  uploaded: boolean;
}

export interface CibilReport {
  score: number;
  riskCategory: "Low" | "Medium" | "High";
  eligibleAmount: number;
  generatedAt: string;
  reportId: string;
}

export interface DeviceDetails {
  brand: string;
  model: string;
  imei1: string;
  imei2: string;
  colourVariant: string;
  storageRam: string;
  invoiceAmount: string;
}

export type EmploymentType = "salaried" | "self_employed" | "business_owner";

export interface EmploymentDetails {
  employmentType: EmploymentType | "";
  profession: string;
  monthlyIncome: string;
}

export const emptyEmploymentDetails = (): EmploymentDetails => ({
  employmentType: "",
  profession: "",
  monthlyIncome: "",
});

export function validateEmploymentDetails(employment: EmploymentDetails): string | null {
  if (!employment.employmentType) return "Please select employment type";
  if (!employment.profession.trim()) return "Profession is required";
  if (!employment.monthlyIncome.trim()) return "Monthly income is required";
  const income = Number(employment.monthlyIncome);
  if (isNaN(income) || income <= 0) return "Enter a valid monthly income";
  return null;
}

export const employmentTypeOptions = [
  { value: "salaried", label: "Salaried" },
  { value: "self_employed", label: "Self-employed" },
  { value: "business_owner", label: "Business owner" },
];

export const emptyDeviceDetails = (): DeviceDetails => ({
  brand: "",
  model: "",
  imei1: "",
  imei2: "",
  colourVariant: "",
  storageRam: "",
  invoiceAmount: "",
});

export const emptyCustomerDetails = (mobile = ""): CustomerApplicationDetails => ({
  name: { value: "", source: null, editable: true },
  mobile: { value: mobile, source: mobile ? "mobile_verified" : null, editable: true },
  email: { value: "", source: null, editable: true },
  address: { value: "", source: null, editable: true },
  city: { value: "", source: null, editable: true },
  state: { value: "", source: null, editable: true },
  pincode: { value: "", source: null, editable: true },
  pan: { value: "", source: null, editable: true },
  aadhaar: { value: "", source: null, editable: true },
  dob: { value: "", source: null, editable: true },
});

function field(value: string, source: FieldSource | null): ExtractedField {
  return { value, source, editable: true };
}

export function mergeCustomerDetails(
  base: CustomerApplicationDetails,
  extracted: Partial<CustomerApplicationDetails>,
  preserveMobile = true,
): CustomerApplicationDetails {
  const merged = { ...base };
  (Object.keys(extracted) as (keyof CustomerApplicationDetails)[]).forEach((key) => {
    if (preserveMobile && key === "mobile") return;
    const incoming = extracted[key];
    if (!incoming) return;
    if (incoming.value && (!merged[key].value || merged[key].source === null)) {
      merged[key] = { ...incoming, editable: true };
    } else if (incoming.value && merged[key].value !== incoming.value) {
      merged[key] = { ...incoming, editable: true };
    }
  });
  if (preserveMobile && base.mobile.value) {
    merged.mobile = { ...base.mobile, source: "mobile_verified", editable: true };
  }
  return merged;
}

const mockCustomerByMobile: Record<string, Partial<CustomerApplicationDetails>> = {
  "9876543210": {
    name: field("Tejpal Singh Rathore", "customer_record"),
    email: field("tejpal@email.com", "customer_record"),
    address: field("42 Park Street", "customer_record"),
    city: field("Jaipur", "customer_record"),
    state: field("Rajasthan", "customer_record"),
    pincode: field("302001", "customer_record"),
  },
};

export async function fetchCustomerByMobile(mobile: string): Promise<Partial<CustomerApplicationDetails> | null> {
  await delay(500);
  return mockCustomerByMobile[mobile] || null;
}

export async function extractKycFromDocuments(
  docs: KycDocumentUpload[],
  mobile: string,
): Promise<Partial<CustomerApplicationDetails>> {
  await delay(1200);
  const extracted: Partial<CustomerApplicationDetails> = {
    mobile: field(mobile, "mobile_verified"),
  };

  if (docs.find((d) => d.type === "aadhaar" && d.uploaded)) {
    extracted.name = field("Tejpal Singh Rathore", "aadhaar");
    extracted.aadhaar = field("XXXX-XXXX-7891", "aadhaar");
    extracted.dob = field("15/08/1995", "aadhaar");
    extracted.address = field("42 Park Street, C-Scheme", "aadhaar");
    extracted.city = field("Jaipur", "aadhaar");
    extracted.state = field("Rajasthan", "aadhaar");
    extracted.pincode = field("302001", "aadhaar");
  }

  if (docs.find((d) => d.type === "pan" && d.uploaded)) {
    extracted.pan = field("ABCTE1234F", "pan");
    if (!extracted.name?.value) {
      extracted.name = field("Tejpal Singh Rathore", "pan");
    }
  }

  if (docs.find((d) => d.type === "address_proof" && d.uploaded)) {
    if (!extracted.address?.value) {
      extracted.address = field("42 Park Street, C-Scheme, Jaipur", "address_proof");
      extracted.city = field("Jaipur", "address_proof");
      extracted.state = field("Rajasthan", "address_proof");
      extracted.pincode = field("302001", "address_proof");
    }
  }

  return extracted;
}

export async function verifyKycDocuments(docs: KycDocumentUpload[]): Promise<{ verified: boolean; message: string }> {
  await delay(800);
  const allUploaded = docs.every((d) => d.uploaded);
  if (!allUploaded) {
    return { verified: false, message: "Please upload all required KYC documents" };
  }
  return { verified: true, message: "All KYC documents verified successfully" };
}

export async function generateCibilReport(_details: CustomerApplicationDetails): Promise<CibilReport> {
  await delay(1500);
  return {
    score: 742,
    riskCategory: "Low",
    eligibleAmount: 65000,
    generatedAt: new Date().toISOString(),
    reportId: `CIBIL-${Date.now()}`,
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface LoanChargeItem {
  label: string;
  amount: number;
}

export interface LoanSummary {
  loanId: string;
  productName: string;
  productModel: string;
  productPrice: number;
  charges: LoanChargeItem[];
  monthlyEmi: number;
  tenureMonths: number;
  annualInterestRate: number;
  effectiveApr: number;
  totalInterest: number;
  totalFees: number;
  totalPayable: number;
  latePaymentChargePerDay: number;
  latePaymentChargePerMonth: number;
  firstEmiDueDate: string;
}

export interface ConsentAuditLog {
  loanId: string;
  customerName: string;
  mobile: string;
  otpHash: string;
  timestamp: string;
  timezone: string;
  ipAddress: string;
  userAgent: string;
  browser: string;
  os: string;
}

export interface DraftResumeData {
  applicationId: string;
  applicationNo: string;
  step: number;
  employment: EmploymentDetails;
  mobile: string;
  otpVerified: boolean;
  kycDocs: KycDocumentUpload[];
  customerDetails: CustomerApplicationDetails;
  device: DeviceDetails;
  tenure: string;
}

const ANNUAL_INTEREST_RATE = 18;
const LATE_CHARGE_PER_DAY = 50;
const LATE_CHARGE_PER_MONTH_PERCENT = 2;

export function generateLoanId(): string {
  return `LN-${Date.now().toString(36).toUpperCase()}`;
}

export function generateApplicationSessionId(): string {
  return `APP-SESS-${Date.now().toString(36).toUpperCase()}`;
}

export function buildCustomerApplicationLink(sessionId: string, mobile: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const cleanMobile = mobile.replace(/\D/g, "");
  return `${origin}/customer/login?apply=${sessionId}&mobile=${cleanMobile}`;
}

function calculateEmi(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 12 / 100;
  if (r === 0) return Math.round(principal / months);
  const factor = Math.pow(1 + r, months);
  return Math.round((principal * r * factor) / (factor - 1));
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function calculateLoanSummary(
  device: DeviceDetails,
  tenureMonths: number,
  loanId: string,
): LoanSummary {
  const productPrice = Number(device.invoiceAmount) || 0;
  const processingFee = Math.max(500, Math.round(productPrice * 0.02));
  const paymentGatewayFee = 49;
  const documentationFee = 150;
  const insuranceFee = 299;

  const charges: LoanChargeItem[] = [
    { label: "Processing Fee", amount: processingFee },
    { label: "Payment Gateway / Convenience Charges", amount: paymentGatewayFee },
    { label: "Documentation Fee", amount: documentationFee },
    { label: "Device Insurance Premium", amount: insuranceFee },
  ];

  const totalFees = charges.reduce((sum, c) => sum + c.amount, 0);
  const monthlyEmi = calculateEmi(productPrice, ANNUAL_INTEREST_RATE, tenureMonths);
  const totalInterest = monthlyEmi * tenureMonths - productPrice;
  const totalPayable = monthlyEmi * tenureMonths + totalFees;
  const effectiveApr =
    Math.round(((totalPayable - productPrice) / productPrice) * (12 / tenureMonths) * 10000) / 100;

  const firstEmi = addMonths(new Date(), 1);

  return {
    loanId,
    productName: device.brand,
    productModel: device.model,
    productPrice,
    charges,
    monthlyEmi,
    tenureMonths,
    annualInterestRate: ANNUAL_INTEREST_RATE,
    effectiveApr,
    totalInterest,
    totalFees,
    totalPayable,
    latePaymentChargePerDay: LATE_CHARGE_PER_DAY,
    latePaymentChargePerMonth: Math.round((monthlyEmi * LATE_CHARGE_PER_MONTH_PERCENT) / 100),
    firstEmiDueDate: firstEmi.toISOString().split("T")[0],
  };
}

export function generateKfsDocument(
  summary: LoanSummary,
  customer: CustomerApplicationDetails,
): string {
  const chargeLines = summary.charges.map((c) => `  ${c.label}: ₹${c.amount.toLocaleString("en-IN")}`).join("\n");

  return `KEY FACT STATEMENT (KFS)
As per RBI Master Direction — Digital Lending

Loan ID: ${summary.loanId}
Date: ${new Date().toLocaleDateString("en-IN")}

── BORROWER DETAILS ──
Name: ${customer.name.value}
Mobile: +91 ${customer.mobile.value}
PAN: ${customer.pan.value}
Address: ${customer.address.value}, ${customer.city.value}, ${customer.state.value} - ${customer.pincode.value}

── LOAN DETAILS ──
Product: ${summary.productName} ${summary.productModel}
Product Price (MRP): ₹${summary.productPrice.toLocaleString("en-IN")}
Loan Amount (Principal): ₹${summary.productPrice.toLocaleString("en-IN")}
Tenure: ${summary.tenureMonths} months
Annual Interest Rate: ${summary.annualInterestRate}% p.a.
Effective APR: ${summary.effectiveApr}%

── CHARGES ──
${chargeLines}
Total Fees & Charges: ₹${summary.totalFees.toLocaleString("en-IN")}

── REPAYMENT ──
Monthly EMI: ₹${summary.monthlyEmi.toLocaleString("en-IN")}
Total Interest: ₹${summary.totalInterest.toLocaleString("en-IN")}
Total Amount Payable: ₹${summary.totalPayable.toLocaleString("en-IN")}
First EMI Due Date: ${new Date(summary.firstEmiDueDate).toLocaleDateString("en-IN")}

── LATE PAYMENT CHARGES ──
Per Day: ₹${summary.latePaymentChargePerDay}
Per Month: ₹${summary.latePaymentChargePerMonth} (or ${LATE_CHARGE_PER_MONTH_PERCENT}% of EMI, whichever is higher)

── DISCLAIMERS ──
1. This KFS is issued in compliance with RBI guidelines on Key Fact Statements.
2. The borrower has the right to cancel the loan within the cooling-off period as per policy.
3. Prepayment charges, if any, will be as per the loan agreement.
4. Grievance redressal: grievance@fintechloans.in | 1800-XXX-XXXX

── ACKNOWLEDGEMENT ──
By proceeding, the borrower confirms receipt and understanding of this Key Fact Statement.

[End of Key Fact Statement]`;
}

export const LOAN_TERMS_AND_CONDITIONS = `LOAN AGREEMENT — TERMS AND CONDITIONS

1. DEFINITIONS
"Borrower" refers to the customer availing the device loan. "Lender" refers to the NBFC/partner providing the loan facility.

2. LOAN SANCTION AND DISBURSEMENT
The loan is sanctioned subject to successful KYC verification, CIBIL assessment, and customer consent. Disbursement is made directly to the vendor for the specified device purchase.

3. INTEREST AND CHARGES
Interest is calculated on reducing balance basis at the rate specified in the KFS. All fees including processing fee, convenience charges, and other applicable charges as listed in the KFS are payable by the Borrower.

4. REPAYMENT
The Borrower agrees to repay the loan through equated monthly instalments (EMI) via NACH auto-debit mandate on the due dates specified in the EMI schedule.

5. DEFAULT AND LATE PAYMENT
Failure to pay EMI on due date will attract late payment charges as specified in the KFS. Persistent default may result in loan recall and reporting to credit bureaus.

6. PREPAYMENT AND FORECLOSURE
The Borrower may prepay the outstanding loan amount subject to applicable prepayment charges as per policy.

7. DATA PRIVACY
The Borrower consents to collection, processing, and storage of personal data for loan processing, credit assessment, and regulatory compliance in accordance with applicable laws.

8. DIGITAL CONSENT
The Borrower acknowledges that digital consent provided via OTP verification constitutes legally binding acceptance of these terms and the KFS.

9. GRIEVANCE REDRESSAL
Complaints may be lodged at grievance@fintechloans.in. Unresolved complaints may be escalated to the RBI Ombudsman.

10. GOVERNING LAW
This agreement is governed by the laws of India. Courts in Jaipur, Rajasthan shall have exclusive jurisdiction.`;

export async function sendConsentOtp(mobile: string): Promise<{ sent: boolean; message: string }> {
  await delay(800);
  if (!/^\d{10}$/.test(mobile.replace(/\D/g, ""))) {
    return { sent: false, message: "Invalid mobile number" };
  }
  return { sent: true, message: `OTP sent to +91 ${mobile.replace(/\D/g, "")}` };
}

export async function verifyConsentOtp(otp: string): Promise<boolean> {
  await delay(600);
  return otp === "123456";
}

export function hashOtp(otp: string): string {
  let hash = 0;
  for (let i = 0; i < otp.length; i++) {
    hash = (hash << 5) - hash + otp.charCodeAt(i);
    hash |= 0;
  }
  return `sha256:${Math.abs(hash).toString(16).padStart(8, "0")}...`;
}

export function getClientDeviceInfo(): Pick<ConsentAuditLog, "ipAddress" | "userAgent" | "browser" | "os"> {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let os = "Unknown";

  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";

  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  return {
    ipAddress: "Captured at submission",
    userAgent: ua,
    browser,
    os,
  };
}

export async function createConsentAuditLog(
  loanId: string,
  customerName: string,
  mobile: string,
  otp: string,
): Promise<ConsentAuditLog> {
  await delay(400);
  const device = getClientDeviceInfo();
  const now = new Date();

  return {
    loanId,
    customerName,
    mobile: mobile.replace(/\D/g, ""),
    otpHash: hashOtp(otp),
    timestamp: now.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...device,
  };
}

export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
