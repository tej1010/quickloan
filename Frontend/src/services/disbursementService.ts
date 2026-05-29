import type { Disbursement, VendorProfile } from "../types";

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatStatementDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateDisbursementStatement(
  disbursements: Disbursement[],
  vendor: Pick<VendorProfile, "storeName" | "bank">,
): string {
  const total = disbursements.reduce((sum, d) => sum + d.loanAmount, 0);
  const lines = disbursements.map(
    (d, i) =>
      `${i + 1}. ${d.customerName}
   Product: ${d.productName}
   Loan Amount: ${formatInr(d.loanAmount)}
   Disbursement Date: ${formatStatementDate(d.disbursedAt)}
   UTR / Reference: ${d.utr}
   Application No: ${d.applicationNo}`,
  );

  return `DISBURSEMENT STATEMENT
${vendor.storeName}

Generated: ${formatStatementDate(new Date().toISOString())}

── CREDITED ACCOUNT ──
Account Holder: ${vendor.bank.accountHolderName}
Bank: ${vendor.bank.bankName}
Account: ${vendor.bank.accountNumber}
IFSC: ${vendor.bank.ifsc}

── DISBURSEMENT HISTORY (Chronological) ──
${lines.join("\n\n")}

── SUMMARY ──
Total Disbursements: ${disbursements.length}
Total Amount Credited: ${formatInr(total)}

This is a system-generated disbursement statement for vendor records.
For queries, contact support@fintechloans.in`;
}

export function downloadDisbursementStatementPdf(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}
