import PageMeta from "../../../components/common/PageMeta";
import MobileHeader from "../../../components/customer/mobile/MobileHeader";

const documents = [
  { name: "Loan Agreement", type: "PDF", icon: "📋", size: "2.4 MB" },
  { name: "Key Fact Statement (KFS)", type: "PDF", icon: "📑", size: "1.1 MB" },
  { name: "EMI Receipt - May 2026", type: "PDF", icon: "🧾", size: "340 KB" },
  { name: "Account Statement", type: "PDF", icon: "📊", size: "890 KB" },
  { name: "No Objection Certificate", type: "PDF", icon: "✅", size: "520 KB" },
];

export default function CustomerDocuments() {
  return (
    <>
      <PageMeta title="Documents | Fintech" description="Loan documents" />
      <MobileHeader title="Documents" showBack />

      <div className="px-5 pt-2 pb-8 space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.name}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl ring-1 ring-gray-100"
          >
            <div className="flex items-center justify-center w-12 h-12 text-2xl bg-gray-50 rounded-xl">
              {doc.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{doc.name}</p>
              <p className="text-xs text-gray-400">{doc.type} · {doc.size}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 text-xs font-semibold text-brand-600 bg-brand-50 rounded-lg">
                View
              </button>
              <button className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg">
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
