import { useNavigate } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import { useAuth } from "../../../context/AuthContext";

const menuItems = [
  { label: "Personal Details", icon: "👤", action: "details" },
  { label: "Loan Documents", icon: "📄", path: "/customer/documents" },
  { label: "Statements", icon: "📊", path: "/customer/documents" },
  { label: "Help & Support", icon: "💬", action: "help" },
  { label: "Privacy Policy", icon: "🔒", action: "privacy" },
];

export default function CustomerProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/customer/login", { replace: true });
  };

  return (
    <>
      <PageMeta title="Profile | Fintech" description="Your profile" />
      <div className="px-5 pt-6 pb-4">
        <div className="flex flex-col items-center py-6">
          <div className="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white rounded-full bg-gradient-to-br from-brand-500 to-brand-700">
            {user?.name?.charAt(0) || "T"}
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">{user?.name || "Customer"}</h1>
          <p className="text-sm text-gray-500">+91 {user?.mobile}</p>
        </div>
      </div>

      <div className="px-5 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.path ? navigate(item.path) : undefined}
            className="flex items-center gap-4 w-full p-4 bg-white rounded-2xl ring-1 ring-gray-100 text-left active:scale-[0.99] transition-transform"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="flex-1 font-medium text-gray-900">{item.label}</span>
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full p-4 mt-4 text-sm font-semibold text-red-600 bg-red-50 rounded-2xl ring-1 ring-red-100"
        >
          Logout
        </button>
      </div>
    </>
  );
}
