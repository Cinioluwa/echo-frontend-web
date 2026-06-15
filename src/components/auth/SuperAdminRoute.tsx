import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores";
import LoadingFallback from "./LoadingFallback";

interface SuperAdminRouteProps {
    children: React.ReactNode;
}

/**
 * SuperAdminRoute Component
 * Wrapper for routes that require SUPER_ADMIN privileges
 * Redirects to feed if user is not a super admin or not authenticated
 */
const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useAuthStore();
    const location = useLocation();

    // Show loading state while checking auth
    if (isLoading) {
        return <LoadingFallback />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
        console.warn("SuperAdminRoute: User not authenticated, redirecting to login");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has super admin role
    const isSuperAdmin = user.role === "ADMIN";

    if (!isSuperAdmin) {
        console.warn("SuperAdminRoute: User does not have super admin privileges, redirecting to feed");
        return <Navigate to="/feed" replace />;
    }

    return <>{children}</>;
};

export default SuperAdminRoute;
