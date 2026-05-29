import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import PanelSidebar from "./PanelSidebar";
import type { NavItem } from "../config/navigation";
import type { ReactNode } from "react";

interface PanelLayoutProps {
  homePath: string;
  navItems: NavItem[];
  othersItems?: NavItem[];
  sidebarWidget?: ReactNode;
  showSearch?: boolean;
}

function LayoutContent({
  homePath,
  navItems,
  othersItems,
  sidebarWidget,
  showSearch = true,
}: PanelLayoutProps) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <PanelSidebar
          homePath={homePath}
          navItems={navItems}
          othersItems={othersItems}
          widget={sidebarWidget}
        />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader showSearch={showSearch} />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function PanelLayout(props: PanelLayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent {...props} />
    </SidebarProvider>
  );
}
