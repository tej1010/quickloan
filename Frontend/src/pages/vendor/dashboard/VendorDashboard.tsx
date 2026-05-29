import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageHeader from "../../../components/fintech/PageHeader";
import MetricCard from "../../../components/fintech/MetricCard";
import DataTable from "../../../components/fintech/DataTable";
import { ApplicationStatusBadge, formatCurrency, formatDate } from "../../../components/fintech/StatusBadge";
import Button from "../../../components/ui/button/Button";
import { vendorService } from "../../../services/vendorService";
import type { LoanApplication, VendorDashboardStats } from "../../../types";
import {
  ArrowUpIcon,
  BoxIconLine,
  DollarLineIcon,
  GroupIcon,
  CheckCircleIcon,
  CloseLineIcon,
  TimeIcon,
} from "../../../icons";
import Badge from "../../../components/ui/badge/Badge";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useNavigate } from "react-router";

export default function VendorDashboard() {
  const [stats, setStats] = useState<VendorDashboardStats | null>(null);
  const [recentApps, setRecentApps] = useState<LoanApplication[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    vendorService.getDashboardStats().then(setStats);
    vendorService.getApplications({ pageSize: 5 }).then((r) => setRecentApps(r.data));
  }, []);

  const chartOptions: ApexOptions = {
    colors: ["#465fff", "#12b76a", "#f79009"],
    chart: { fontFamily: "Outfit, sans-serif", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    legend: { position: "top" },
    dataLabels: { enabled: false },
  };

  return (
    <>
      <PageMeta title="Vendor Dashboard | Quick Loan" description="Vendor dashboard overview" />
      <PageHeader
        title="Dashboard"
        actions={
          <Button size="sm" onClick={() => navigate("/vendor/applications/new")}>
            New Application
          </Button>
        }
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            <MetricCard label="Total Applications" value={stats?.totalApplications ?? "—"} icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />} badge={<Badge color="success"><ArrowUpIcon />12%</Badge>} />
            <MetricCard label="Approved" value={stats?.approvedApplications ?? "—"} icon={<CheckCircleIcon className="text-gray-800 size-6 dark:text-white/90" />} />
            <MetricCard label="Rejected" value={stats?.rejectedApplications ?? "—"} icon={<CloseLineIcon className="text-gray-800 size-6 dark:text-white/90" />} />
            <MetricCard label="Pending" value={stats?.pendingApplications ?? "—"} icon={<TimeIcon className="text-gray-800 size-6 dark:text-white/90" />} />
            <MetricCard label="Total Disbursed" value={stats ? formatCurrency(stats.totalDisbursedAmount) : "—"} icon={<DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />} />
            <MetricCard label="Total Customers" value={stats?.totalCustomers ?? "—"} icon={<BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />} />
          </div>
        </div>

        <div className="col-span-12 xl:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Applications</h3>
            <Chart type="bar" height={280} options={{ ...chartOptions, chart: { ...chartOptions.chart, type: "bar" } }} series={[{ name: "Applications", data: [120, 145, 132, 168, 190, 210] }]} />
          </div>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Approval & Disbursement Trend</h3>
            <Chart type="line" height={280} options={chartOptions} series={[
              { name: "Approved", data: [80, 95, 88, 110, 125, 140] },
              { name: "Disbursed", data: [65, 78, 72, 95, 108, 125] },
            ]} />
          </div>
        </div>

        <div className="col-span-12">
          <DataTable
            title="Recent Applications"
            data={recentApps}
            onRowClick={(row) => navigate(`/vendor/applications/${row.id}`)}
            columns={[
              { key: "appNo", header: "Application No", render: (r) => <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{r.applicationNo}</span> },
              { key: "customer", header: "Customer", render: (r) => <span className="text-gray-500 text-theme-sm dark:text-gray-400">{r.customerName}</span> },
              { key: "amount", header: "Amount", render: (r) => formatCurrency(r.loanAmount) },
              { key: "status", header: "Status", render: (r) => <ApplicationStatusBadge status={r.status} /> },
              { key: "date", header: "Date", render: (r) => formatDate(r.createdAt) },
            ]}
          />
        </div>
      </div>
    </>
  );
}
