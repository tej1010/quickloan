import type {
  CustomerDashboardStats,
  CustomerLoan,
  EmiScheduleItem,
  Notification,
  PaymentMethod,
  PaymentReceipt,
} from "../types";
import {
  mockCustomerLoans,
  mockCustomerNotifications,
  mockCustomerStats,
  mockEmiSchedule,
} from "./mockData";

export const customerService = {
  async getDashboardStats(): Promise<CustomerDashboardStats> {
    await delay(400);
    return mockCustomerStats;
  },

  async getLoans(status?: "active" | "closed"): Promise<CustomerLoan[]> {
    await delay(400);
    if (!status) return mockCustomerLoans;
    return mockCustomerLoans.filter((l) => l.status === status);
  },

  async getLoanById(id: string): Promise<CustomerLoan | undefined> {
    await delay(300);
    return mockCustomerLoans.find((l) => l.id === id);
  },

  async getEmiSchedule(_loanId: string): Promise<EmiScheduleItem[]> {
    await delay(400);
    return mockEmiSchedule;
  },

  async getNotifications(): Promise<Notification[]> {
    await delay(300);
    return mockCustomerNotifications;
  },

  async payEmi(
    _loanId: string,
    amount: number,
    method: PaymentMethod,
  ): Promise<PaymentReceipt> {
    await delay(1200);
    return {
      transactionId: `TXN${Date.now()}`,
      amount,
      paymentDate: new Date().toISOString(),
      paymentMethod: method,
      nextEmiDate: "2026-07-05",
      loanNo: "LN-2026-000892",
    };
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
