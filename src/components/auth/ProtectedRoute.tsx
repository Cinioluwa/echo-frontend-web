import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores";
import LoadingFallback from "./LoadingFallback";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

/**
 * ProtectedRoute Component
 * Wrapper for routes that require authentication
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAuth = true
}) => {
    const { isAuthenticated, isLoading, user } = useAuthStore();

    // Show loading state while checking auth
    if (isLoading) {
        return <LoadingFallback />;
    }

    // Redirect to login if authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to login if user data is missing
    if (requireAuth && !user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
