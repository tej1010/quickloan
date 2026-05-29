import type { CustomerApplicationDetails, DeviceDetails, LoanSummary } from "./loanApplicationService";
import type { UpsertApplicationSessionInput } from "../types/applicationSession";

export function customerDetailsToSessionDetails(details: CustomerApplicationDetails) {
  return {
    name: details.name.value,
    mobile: details.mobile.value.replace(/\D/g, ""),
    email: details.email.value,
    pan: details.pan.value,
    aadhaar: details.aadhaar.value,
    address: details.address.value,
    city: details.city.value,
    state: details.state.value,
    pincode: details.pincode.value,
  };
}

export function buildVendorSessionPayload(input: {
  sessionId: string;
  mobile: string;
  vendorName: string;
  vendorStep: number;
  applicationNo?: string;
  customerDetails: CustomerApplicationDetails;
  device: DeviceDetails;
  tenure: string;
  loanSummary: LoanSummary | null;
  loanId?: string;
}): UpsertApplicationSessionInput {
  const cleanMobile = input.mobile.replace(/\D/g, "");
  return {
    sessionId: input.sessionId,
    applicationNo: input.applicationNo,
    customerMobile: cleanMobile,
    customerName: input.customerDetails.name.value || "Customer",
    customerDetails: customerDetailsToSessionDetails(input.customerDetails),
    vendorName: input.vendorName,
    vendorStep: input.vendorStep,
    customerProgressStep: 0,
    productName: input.device.brand,
    productModel: input.device.model,
    loanAmount: Number(input.device.invoiceAmount) || 0,
    tenure: Number(input.tenure) || 12,
    emiAmount: input.loanSummary?.monthlyEmi ?? 0,
    interestRate: 18,
    loanId: input.loanId,
  };
}
