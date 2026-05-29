import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageHeader from "../../../components/fintech/PageHeader";
import Badge from "../../../components/ui/badge/Badge";
import { formatDate } from "../../../components/fintech/StatusBadge";
import { vendorService } from "../../../services/vendorService";
import type { Notification } from "../../../types";

export default function VendorNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    vendorService.getNotifications().then(setNotifications);
  }, []);

  return (
    <>
      <PageMeta title="Notifications | Vendor" description="Vendor notifications" />
      <PageHeader title="Notifications" />
      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl border p-5 dark:border-gray-800 ${
              n.isRead ? "border-gray-200 bg-white dark:bg-white/[0.03]" : "border-brand-200 bg-brand-50 dark:bg-brand-500/10 dark:border-brand-500/30"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-800 dark:text-white/90">{n.title}</h4>
                  {!n.isRead && <Badge size="sm" color="primary">New</Badge>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{n.message}</p>
                <p className="mt-2 text-xs text-gray-400">{formatDate(n.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
