import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import PageHeader from "../../../components/fintech/PageHeader";
import DataTable from "../../../components/fintech/DataTable";
import StatusTabs from "../../../components/fintech/StatusTabs";
import Pagination from "../../../components/fintech/Pagination";
import {
  ApplicationTabStatusBadge,
  formatCurrency,
  formatDate,
  formatEmiPlan,
} from "../../../components/fintech/StatusBadge";
import Button from "../../../components/ui/button/Button";
import { vendorService } from "../../../services/vendorService";
import type { ApplicationTabStatus, LoanApplication } from "../../../types";
import {
  APPLICATION_TAB_STATUSES,
  applicationTabDescriptions,
  applicationTabLabels,
} from "../../../utils/applicationStatus";

export default function VendorApplications() {
  const [apps, setApps] = useState<LoanApplication[]>([]);
  const [activeTab, setActiveTab] = useState<ApplicationTabStatus>("draft");
  const [tabCounts, setTabCounts] = useState<Record<ApplicationTabStatus, number>>({
    draft: 0,
    submitted: 0,
    approved: 0,
    rejected: 0,
    disbursed: 0,
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchCounts = useCallback(async () => {
    const counts = await vendorService.getApplicationStatusCounts();
    setTabCounts(counts);
  }, []);

  const fetchApps = useCallback(async () => {
    const result = await vendorService.getApplications({
      page,
      status: activeTab,
    });
    setApps(result.data);
    setTotal(result.total);
    setTotalPages(result.totalPages);
  }, [page, activeTab]);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);
  useEffect(() => { fetchApps(); }, [fetchApps]);

  const tabs = APPLICATION_TAB_STATUSES.map((status) => ({
    value: status,
    label: applicationTabLabels[status],
    count: tabCounts[status],
  }));

  return (
    <>
      <PageMeta title="Loan Applications | Vendor" description="Manage loan applications" />
      <PageHeader
        title="Loan Applications"
        actions={
          <Button size="sm" onClick={() => navigate("/vendor/applications/new")}>
            New Application
          </Button>
        }
      />

      <div className="mb-5 space-y-4">
        <StatusTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(value) => {
            setActiveTab(value as ApplicationTabStatus);
            setPage(1);
          }}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {applicationTabDescriptions[activeTab]}
        </p>
      </div>

      <DataTable
        title={applicationTabLabels[activeTab]}
        data={apps}
        onRowClick={(r) => navigate(`/vendor/applications/${r.id}`)}
        emptyMessage={`No ${applicationTabLabels[activeTab].toLowerCase()} applications found`}
        columns={[
          {
            key: "customer",
            header: "Customer",
            render: (r) => (
              <div>
                <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {r.customerName}
                </p>
                <span className="text-gray-500 text-theme-xs">+91 {r.customerMobile}</span>
              </div>
            ),
          },
          {
            key: "product",
            header: "Product",
            render: (r) => (
              <span className="text-gray-800 text-theme-sm dark:text-white/90">{r.productName}</span>
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
            key: "emi",
            header: "EMI Plan",
            render: (r) => (
              <span className="text-gray-600 text-theme-sm dark:text-gray-400">
                {formatEmiPlan(r.emiAmount, r.tenure)}
              </span>
            ),
          },
          {
            key: "date",
            header: "Application Date",
            render: (r) => (
              <span className="text-gray-600 text-theme-sm dark:text-gray-400">
                {formatDate(r.createdAt)}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => <ApplicationTabStatusBadge status={r.status} />,
          },
        ]}
      />
      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
    </>
  );
}
