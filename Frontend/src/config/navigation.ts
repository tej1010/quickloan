import type { ReactNode } from "react";

export type NavItem = {
  name: string;
  icon: ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

export const vendorNavItems: NavItem[] = [
  {
    icon: null,
    name: "Dashboard",
    path: "/vendor/dashboard",
  },
  {
    icon: null,
    name: "Applications",
    subItems: [
      { name: "Loan Applications", path: "/vendor/applications" },
      { name: "New Application", path: "/vendor/applications/new" },
    ],
  },
  {
    icon: null,
    name: "EMI Management",
    path: "/vendor/emi",
  },
  {
    icon: null,
    name: "Disbursements",
    path: "/vendor/disbursements",
  },
  {
    icon: null,
    name: "Branches",
    path: "/vendor/branches",
  },
];

export const vendorOthersItems: NavItem[] = [
  {
    icon: null,
    name: "Notifications",
    path: "/vendor/notifications",
  },
  {
    icon: null,
    name: "Profile",
    path: "/vendor/profile",
  },
];

export const customerNavItems: NavItem[] = [
  {
    icon: null,
    name: "Dashboard",
    path: "/customer/dashboard",
  },
  {
    icon: null,
    name: "My Loans",
    path: "/customer/loans",
  },
  {
    icon: null,
    name: "Pay EMI",
    path: "/customer/pay-emi",
  },
  {
    icon: null,
    name: "Documents",
    path: "/customer/documents",
  },
];

export const customerOthersItems: NavItem[] = [
  {
    icon: null,
    name: "Notifications",
    path: "/customer/notifications",
  },
  {
    icon: null,
    name: "Profile",
    path: "/customer/profile",
  },
];
