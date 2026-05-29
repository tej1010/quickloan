import type { User, UserRole } from "../types";

const TOKEN_KEY = "fintech_token";
const USER_KEY = "fintech_user";

const mockUsers: Record<string, User & { password?: string }> = {
  "vendor@mobileworld.com": {
    id: "v1",
    role: "vendor",
    name: "Rajesh Kumar",
    email: "vendor@mobileworld.com",
    mobile: "9876500000",
    isOwner: true,
    password: "password123",
  },
  "9876543210": {
    id: "c1",
    role: "customer",
    name: "Tejpal",
    mobile: "9876543210",
  },
};

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async vendorLogin(email: string, password: string): Promise<User> {
    await delay(800);
    const user = mockUsers[email];
    if (!user || user.password !== password) {
      throw new Error("Invalid email or password");
    }
    const { password: _, ...safeUser } = user;
    const token = `mock_token_${user.id}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  async customerSendOtp(mobile: string): Promise<void> {
    await delay(600);
    if (!/^\d{10}$/.test(mobile)) throw new Error("Enter a valid 10-digit mobile number");
  },

  async customerVerifyOtp(mobile: string, otp: string): Promise<User> {
    await delay(800);
    if (otp !== "123456") throw new Error("Invalid OTP. Use 123456 for demo.");
    const user = mockUsers[mobile] || {
      id: `c_${mobile}`,
      role: "customer" as UserRole,
      name: "Customer",
      mobile,
    };
    const token = `mock_token_${user.id}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  async forgotPassword(_email: string): Promise<void> {
    await delay(600);
  },

  async resetPassword(_token: string, _password: string): Promise<void> {
    await delay(600);
  },

  async changePassword(_current: string, _newPassword: string): Promise<void> {
    await delay(600);
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
