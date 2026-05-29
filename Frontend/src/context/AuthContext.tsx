import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User, UserRole } from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginVendor: (email: string, password: string) => Promise<void>;
  sendCustomerOtp: (mobile: string) => Promise<void>;
  verifyCustomerOtp: (mobile: string, otp: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(authService.getUser());
    setIsLoading(false);
  }, []);

  const loginVendor = useCallback(async (email: string, password: string) => {
    const loggedIn = await authService.vendorLogin(email, password);
    setUser(loggedIn);
  }, []);

  const sendCustomerOtp = useCallback(async (mobile: string) => {
    await authService.customerSendOtp(mobile);
  }, []);

  const verifyCustomerOtp = useCallback(async (mobile: string, otp: string) => {
    const loggedIn = await authService.customerVerifyOtp(mobile, otp);
    setUser(loggedIn);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: UserRole) => user?.role === role,
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user || authService.isAuthenticated(),
      loginVendor,
      sendCustomerOtp,
      verifyCustomerOtp,
      logout,
      hasRole,
    }),
    [user, isLoading, loginVendor, sendCustomerOtp, verifyCustomerOtp, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
