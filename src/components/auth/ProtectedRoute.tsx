import { Navigate, useLocation } from "react-router-dom";
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
    const location = useLocation();

    // Show loading state while checking auth
    if (isLoading) {
        return <LoadingFallback />;
    }

    // Redirect to login if authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
        if (location.pathname.startsWith("/feed/")) {
            return <Navigate to={`/guest${location.pathname}`} replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to login if user data is missing
    if (requireAuth && !user) {
        if (location.pathname.startsWith("/feed/")) {
            return <Navigate to={`/guest${location.pathname}`} replace />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAuth && user) {
        const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

        if (!isAdmin) {
            const isWaitingApproval =
                user.pendingJoinRequest?.status === "PENDING" ||
                (user.pendingRequests?.some((request) => request.status === "PENDING") ??
                    false);

            if (isWaitingApproval) {
                return <Navigate to="/waiting-room" replace />;
            }

            if (!user.organizationId) {
                return <Navigate to="/find-institution" replace />;
            }

            if (user.status !== "ACTIVE") {
                return <Navigate to="/verification" replace />;
            }
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
