type ChipVariant = "active" | "closed" | "overdue" | "upcoming" | "paid" | "pending";

const styles: Record<ChipVariant, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  closed: "bg-blue-50 text-blue-700 ring-blue-200",
  overdue: "bg-red-50 text-red-600 ring-red-200",
  upcoming: "bg-amber-50 text-amber-700 ring-amber-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-gray-100 text-gray-600 ring-gray-200",
};

const labels: Record<ChipVariant, string> = {
  active: "Active",
  closed: "Closed",
  overdue: "Overdue",
  upcoming: "Upcoming",
  paid: "Paid",
  pending: "Pending",
};

export default function StatusChip({ variant, label }: { variant: ChipVariant; label?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ${styles[variant]}`}>
      {label ?? labels[variant]}
    </span>
  );
}
