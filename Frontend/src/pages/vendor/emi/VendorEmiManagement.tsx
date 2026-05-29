import PageMeta from "../../../components/common/PageMeta";
import PageHeader from "../../../components/fintech/PageHeader";
import MetricCard from "../../../components/fintech/MetricCard";
import DataTable from "../../../components/fintech/DataTable";
import { EmiStatusBadge, formatCurrency, formatDate } from "../../../components/fintech/StatusBadge";
import { DollarLineIcon, TimeIcon, CheckCircleIcon, AlertIcon } from "../../../icons";
import { mockEmiSchedule } from "../../../services/mockData";

export default function VendorEmiManagement() {
  const paid = mockEmiSchedule.filter((e) => e.status === "paid").length;
  const pending = mockEmiSchedule.filter((e) => e.status === "pending" || e.status === "upcoming").length;
  const overdue = mockEmiSchedule.filter((e) => e.status === "overdue").length;
  const outstanding = mockEmiSchedule.filter((e) => e.status !== "paid").reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <PageMeta title="EMI Management | Vendor" description="Manage customer EMIs" />
      <PageHeader title="EMI Management" />
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <MetricCard label="Total EMIs" value={mockEmiSchedule.length} icon={<DollarLineIcon className="size-6 text-gray-800 dark:text-white/90" />} />
        <MetricCard label="Paid EMIs" value={paid} icon={<CheckCircleIcon className="size-6 text-gray-800 dark:text-white/90" />} />
        <MetricCard label="Pending EMIs" value={pending} icon={<TimeIcon className="size-6 text-gray-800 dark:text-white/90" />} />
        <MetricCard label="Overdue EMIs" value={overdue} icon={<AlertIcon className="size-6 text-gray-800 dark:text-white/90" />} />
      </div>
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500">Outstanding Amount</p>
        <p className="text-title-sm font-bold text-gray-800 dark:text-white/90">{formatCurrency(outstanding)}</p>
      </div>
      <DataTable
        title="EMI Schedule"
        data={mockEmiSchedule}
        columns={[
          { key: "no", header: "EMI #", render: (r) => r.emiNumber },
          { key: "due", header: "Due Date", render: (r) => formatDate(r.dueDate) },
          { key: "amount", header: "Amount", render: (r) => formatCurrency(r.amount) },
          { key: "status", header: "Status", render: (r) => <EmiStatusBadge status={r.status} /> },
          { key: "paid", header: "Paid Date", render: (r) => r.paidDate ? formatDate(r.paidDate) : "—" },
          { key: "late", header: "Late Charges", render: (r) => r.lateCharges ? formatCurrency(r.lateCharges) : "—" },
        ]}
      />
    </>
  );
}
