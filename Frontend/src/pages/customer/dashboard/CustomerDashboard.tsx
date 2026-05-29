import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import ProgressRing from "../../../components/customer/mobile/ProgressRing";
import { HomeSkeleton } from "../../../components/customer/mobile/Skeleton";
import { formatINR, formatDateShort, dueCountdownText } from "../../../components/customer/mobile/utils";
import { useAuth } from "../../../context/AuthContext";
import { customerService } from "../../../services/customerService";
import { mockCustomerLoans } from "../../../services/mockData";
import type { CustomerDashboardStats } from "../../../types";

const quickActions = [
  { label: "EMI Schedule", icon: "📅", path: "/customer/loans/1/schedule" },
  { label: "Documents", icon: "📄", path: "/customer/documents" },
  { label: "Statements", icon: "📊", path: "/customer/documents" },
  { label: "Help", icon: "💬", path: "/customer/profile" },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CustomerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loan = mockCustomerLoans[0];

  useEffect(() => {
    customerService.getDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <>
        <PageMeta title="Home | Fintech" description="Customer home" />
        <HomeSkeleton />
      </>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <>
      <PageMeta title="Home | Fintech" description="Customer home" />
      <div className="px-5 pt-6 pb-4">
        <p className="text-sm text-gray-500">Good {new Date().getHours() < 12 ? "morning" : "evening"}</p>
        <h1 className="text-2xl font-bold text-gray-900">Hello {firstName} 👋</h1>
      </div>

      <div className="px-5">
        <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 text-white shadow-xl shadow-gray-900/20">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
          <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Active Loan</p>
          <div className="flex items-start gap-4 mt-3">
            {loan.device?.image && (
              <img src={loan.device.image} alt="" className="w-14 h-14 object-cover rounded-xl ring-2 ring-white/20" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lg truncate">{loan.productName}</p>
              <p className="text-sm text-white/60">{loan.device?.model}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <p className="text-xs text-white/50">Outstanding</p>
              <p className="text-xl font-bold">{formatINR(stats?.outstandingAmount ?? 0)}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Current EMI</p>
              <p className="text-xl font-bold">{formatINR(stats?.nextEmiAmount ?? 0)}</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-white/70">
            Next due: <span className="text-white font-medium">{formatDateShort(stats?.nextEmiDate ?? "")}</span>
          </p>
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => navigate("/customer/pay-emi")}
              className="flex-1 py-3 text-sm font-semibold text-gray-900 bg-white rounded-xl active:scale-[0.98]"
            >
              Pay EMI
            </button>
            <button
              onClick={() => navigate(`/customer/loans/${loan.id}`)}
              className="flex-1 py-3 text-sm font-semibold text-white rounded-xl ring-1 ring-white/30 active:scale-[0.98]"
            >
              View Loan
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6">
        <div className="flex items-center justify-between p-5 bg-white rounded-3xl shadow-sm ring-1 ring-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-900">EMI Progress</p>
            <p className="text-xs text-gray-500 mt-0.5">{loan.paidEmis} of {loan.tenure} EMIs paid</p>
          </div>
          <ProgressRing value={loan.paidEmis} max={loan.tenure} size={88} stroke={8} />
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="p-5 bg-white rounded-3xl shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-600 uppercase">{dueCountdownText(stats?.nextEmiDate ?? "")}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatINR(stats?.nextEmiAmount ?? 0)}</p>
              <p className="text-sm text-gray-500">Due {formatDateShort(stats?.nextEmiDate ?? "")}</p>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
          {(loan.lateCharges ?? 0) > 0 && (
            <p className="mt-2 text-xs text-red-500">Includes {formatINR(loan.lateCharges!)} late charges</p>
          )}
          <button
            onClick={() => navigate("/customer/pay-emi")}
            className="w-full py-3.5 mt-4 text-sm font-semibold text-white rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500"
          >
            Pay Now
          </button>
        </div>
      </div>

      <div className="px-5 mt-6 mb-4">
        <p className="mb-3 text-sm font-semibold text-gray-900">Quick Actions</p>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 active:scale-95 transition-transform"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
