import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageHeader from "../../../components/fintech/PageHeader";
import DataTable from "../../../components/fintech/DataTable";
import { formatCurrency, formatDate } from "../../../components/fintech/StatusBadge";
import Button from "../../../components/ui/button/Button";
import {
  downloadDisbursementStatementPdf,
  generateDisbursementStatement,
} from "../../../services/disbursementService";
import { vendorService } from "../../../services/vendorService";
import type { Disbursement, VendorProfile } from "../../../types";
import { DownloadIcon } from "../../../icons";

export default function VendorDisbursements() {
  const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);

  useEffect(() => {
    vendorService.getDisbursements().then(setDisbursements);
    vendorService.getProfile().then(setVendor);
  }, []);

  const handleDownloadAll = () => {
    if (!vendor || disbursements.length === 0) return;
    const content = generateDisbursementStatement(disbursements, vendor);
    downloadDisbursementStatementPdf(
      content,
      `disbursement-statement-${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const handleDownloadSingle = (disbursement: Disbursement) => {
    if (!vendor) return;
    const content = generateDisbursementStatement([disbursement], vendor);
    downloadDisbursementStatementPdf(
      content,
      `disbursement-${disbursement.applicationNo}.pdf`,
    );
  };

  const totalDisbursed = disbursements.reduce((sum, d) => sum + d.loanAmount, 0);

  return (
    <>
      <PageMeta title="Disbursement History | Vendor" description="Disbursement history" />
      <PageHeader
        title="Disbursement History"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadAll}
            disabled={!vendor || disbursements.length === 0}
            startIcon={<DownloadIcon className="size-4" />}
          >
            Download Statement (PDF)
          </Button>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs text-gray-500">Total Disbursements</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{disbursements.length}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs text-gray-500">Total Amount Credited</p>
          <p className="text-2xl font-bold text-brand-600">{formatCurrency(totalDisbursed)}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-xs text-gray-500">Credited To</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90 mt-1">
            {vendor?.bank.bankName || "—"}
          </p>
          <p className="text-xs text-gray-500">{vendor?.bank.accountNumber}</p>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Chronological list of all disbursements received in your registered bank account.
      </p>

      <DataTable
        title="All Disbursements"
        data={disbursements}
        emptyMessage="No disbursements received yet"
        columns={[
          {
            key: "customer",
            header: "Customer",
            render: (r) => (
              <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {r.customerName}
              </span>
            ),
          },
          {
            key: "product",
            header: "Product",
            render: (r) => (
              <span className="text-gray-600 text-theme-sm dark:text-gray-400">{r.productName}</span>
            ),
          },
          {
            key: "amount",
            header: "Loan Amount",
            render: (r) => (
              <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {formatCurrency(r.loanAmount)}
              </span>
            ),
          },
          {
            key: "date",
            header: "Disbursement Date",
            render: (r) => (
              <span className="text-gray-600 text-theme-sm dark:text-gray-400">
                {formatDate(r.disbursedAt)}
              </span>
            ),
          },
          {
            key: "utr",
            header: "UTR / Reference",
            render: (r) => (
              <span className="font-mono text-theme-xs text-gray-700 dark:text-gray-300">{r.utr}</span>
            ),
          },
          {
            key: "download",
            header: "",
            className: "w-12",
            render: (r) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadSingle(r);
                }}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-gray-800"
                title="Download statement (PDF)"
              >
                <DownloadIcon className="size-4" />
              </button>
            ),
          },
        ]}
      />
    </>
  );
}
