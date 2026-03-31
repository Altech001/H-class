import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";

export function ProtectedRoute() {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect logic: send them to login, but save the intended destination so we can drop them right there after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the child routes (e.g. inside AppLayout)
    return <Outlet />;
}
