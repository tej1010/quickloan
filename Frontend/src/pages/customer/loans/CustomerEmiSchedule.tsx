import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import MobileHeader from "../../../components/customer/mobile/MobileHeader";
import StatusChip from "../../../components/customer/mobile/StatusChip";
import { formatINR, formatDateShort } from "../../../components/customer/mobile/utils";
import { customerService } from "../../../services/customerService";
import type { EmiScheduleItem, EmiStatus } from "../../../types";

function getChip(status: EmiStatus) {
  if (status === "paid") return "paid" as const;
  if (status === "overdue") return "overdue" as const;
  if (status === "upcoming") return "upcoming" as const;
  return "pending" as const;
}

function TimelineIcon({ status }: { status: EmiStatus }) {
  if (status === "paid") {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    );
  }
  if (status === "overdue") {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-bold">
        !
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 text-xs font-bold">
      {status === "upcoming" ? "→" : "○"}
    </div>
  );
}

export default function CustomerEmiSchedule() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState<EmiScheduleItem[]>([]);

  useEffect(() => {
    if (id) customerService.getEmiSchedule(id).then(setSchedule);
  }, [id]);

  return (
    <>
      <PageMeta title="EMI Schedule | Fintech" description="EMI timeline" />
      <MobileHeader title="EMI Schedule" showBack />

      <div className="px-5 pt-2 pb-8">
        <p className="mb-4 text-sm text-gray-500">{schedule.filter((e) => e.status === "paid").length} of {schedule.length} EMIs completed</p>

        <div className="relative space-y-0">
          {schedule.map((emi, index) => (
            <div key={emi.id} className="relative flex gap-4">
              {index < schedule.length - 1 && (
                <div className="absolute left-4 top-10 w-0.5 h-[calc(100%-8px)] bg-gray-200" />
              )}
              <div className="relative z-10 shrink-0 pt-1">
                <TimelineIcon status={emi.status} />
              </div>
              <div className={`flex-1 mb-4 p-4 rounded-2xl ring-1 ${
                emi.status === "upcoming"
                  ? "bg-brand-50 ring-brand-200"
                  : emi.status === "overdue"
                    ? "bg-red-50 ring-red-200"
                    : "bg-white ring-gray-100"
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-400">EMI #{emi.emiNumber}</p>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">{formatINR(emi.amount)}</p>
                    <p className="text-sm text-gray-500">Due {formatDateShort(emi.dueDate)}</p>
                  </div>
                  <StatusChip variant={getChip(emi.status)} />
                </div>
                {emi.paidDate && (
                  <p className="mt-2 text-xs text-emerald-600">Paid on {formatDateShort(emi.paidDate)}</p>
                )}
                {emi.lateCharges && (
                  <p className="mt-1 text-xs text-red-500">Late fee: {formatINR(emi.lateCharges)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
