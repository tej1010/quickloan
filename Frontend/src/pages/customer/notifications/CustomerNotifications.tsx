import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import { formatDateShort } from "../../../components/customer/mobile/utils";
import { customerService } from "../../../services/customerService";
import type { Notification, NotificationType } from "../../../types";

const iconMap: Record<NotificationType, string> = {
  emi_reminder: "⚠️",
  payment_update: "✅",
  loan_update: "💰",
  noc: "📄",
  emi_alert: "⚠️",
  approval_update: "✅",
  disbursement_update: "💰",
};

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    customerService.getNotifications().then(setNotifications);
  }, []);

  return (
    <>
      <PageMeta title="Notifications | Fintech" description="Alerts" />
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">{notifications.filter((n) => !n.isRead).length} unread</p>
      </div>

      <div className="px-5 pb-8 space-y-3">
        {notifications.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-4xl">🔔</span>
            <p className="mt-3 font-medium text-gray-900">All caught up!</p>
            <p className="text-sm text-gray-500">No notifications right now</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-4 p-4 rounded-2xl ring-1 ${
                n.isRead ? "bg-white ring-gray-100" : "bg-brand-50 ring-brand-100"
              }`}
            >
              <span className="text-2xl shrink-0">{iconMap[n.type] || "📌"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{n.title}</p>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDateShort(n.createdAt)}</p>
                {n.type === "emi_reminder" && (
                  <button className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-brand-600 rounded-xl">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
