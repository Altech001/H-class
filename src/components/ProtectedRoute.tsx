import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  requireVerified?: boolean;
}

export function ProtectedRoute({ allowedRoles, requireVerified = true }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect logic: send them to login, but save the intended destination so we can drop them right there after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle email verification check
  if (requireVerified && user && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Handle role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />; // You can map /unauthorized to NotFound or a specific page
  }

  // If authenticated and authorized, render the child routes (e.g. inside AppLayout)
  return <Outlet />;
}
