import { Navigate, Outlet } from "react-router";
import type { UserRole } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  loginPath: string;
}

export default function ProtectedRoute({ allowedRoles, loginPath }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const currentUser = user ?? authService.getUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 rounded-full border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser || !authService.getToken()) {
    return <Navigate to={loginPath} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    const redirect =
      currentUser.role === "vendor"
        ? "/vendor/dashboard"
        : currentUser.role === "customer"
          ? "/customer/dashboard"
          : "/";
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}
