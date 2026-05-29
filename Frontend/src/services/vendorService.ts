import type {
  ApplicationDetail,
  ApplicationTabStatus,
  Branch,
  Disbursement,
  LoanApplication,
  Notification,
  PaginatedResponse,
  VendorDashboardStats,
  VendorProfile,
} from "../types";
import {
  mockApplicationDetails,
  mockApplications,
  mockDraftResumeData,
  mockBranches,
  mockDisbursements,
  mockVendorNotifications,
  mockVendorProfile,
  mockVendorStats,
} from "./mockData";
import type { DraftResumeData } from "./loanApplicationService";
import { getApplicationTabStatus } from "../utils/applicationStatus";

export const vendorService = {
  async getDashboardStats(): Promise<VendorDashboardStats> {
    await delay(400);
    return mockVendorStats;
  },

  async getApplications(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: ApplicationTabStatus | "";
  }): Promise<PaginatedResponse<LoanApplication>> {
    await delay(400);
    let filtered = [...mockApplications];
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.customerName.toLowerCase().includes(q) ||
          a.applicationNo.toLowerCase().includes(q) ||
          a.customerMobile.includes(q) ||
          a.productName.toLowerCase().includes(q),
      );
    }
    if (params.status) {
      filtered = filtered.filter((a) => getApplicationTabStatus(a.status) === params.status);
    }
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return paginate(filtered, params.page || 1, params.pageSize || 10);
  },

  async getApplicationStatusCounts(): Promise<Record<ApplicationTabStatus, number>> {
    await delay(200);
    const counts: Record<ApplicationTabStatus, number> = {
      draft: 0,
      submitted: 0,
      approved: 0,
      rejected: 0,
      disbursed: 0,
    };
    mockApplications.forEach((app) => {
      counts[getApplicationTabStatus(app.status)] += 1;
    });
    return counts;
  },

  async getApplicationById(id: string): Promise<ApplicationDetail | null> {
    await delay(400);
    return mockApplicationDetails[id] || null;
  },

  async getDraftForResume(id: string): Promise<DraftResumeData | null> {
    await delay(300);
    const detail = mockApplicationDetails[id];
    if (!detail || detail.status !== "draft") return null;
    return mockDraftResumeData[id] || null;
  },

  async getBranches(): Promise<Branch[]> {
    await delay(300);
    return mockBranches;
  },

  async getDisbursements(): Promise<Disbursement[]> {
    await delay(400);
    return [...mockDisbursements].sort(
      (a, b) => new Date(b.disbursedAt).getTime() - new Date(a.disbursedAt).getTime(),
    );
  },

  async getNotifications(): Promise<Notification[]> {
    await delay(300);
    return mockVendorNotifications;
  },

  async getProfile(): Promise<VendorProfile> {
    await delay(300);
    return mockVendorProfile;
  },

  async submitOnboarding(_data: unknown): Promise<void> {
    await delay(1000);
  },
};

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
