import { Outlet, useLocation } from "react-router";
import BottomNav from "../components/customer/mobile/BottomNav";
import "../styles/customer-mobile.css";

const MAIN_TABS = [
  "/customer/dashboard",
  "/customer/loans",
  "/customer/notifications",
  "/customer/profile",
];

export default function CustomerMobileLayout() {
  const { pathname } = useLocation();
  const showNav = MAIN_TABS.includes(pathname);

  return (
    <div className="customer-app min-h-screen bg-[#e8ebf2]">
      <div className="relative mx-auto min-h-screen w-full max-w-md bg-[#f5f6fa] lg:max-w-lg lg:shadow-2xl lg:ring-1 lg:ring-gray-200">
        <main className={showNav ? "pb-24" : "pb-6"}>
          <Outlet />
        </main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
