import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores";
import LoadingFallback from "./LoadingFallback";

interface AdminRouteProps {
    children: React.ReactNode;
    allowRepresentativeManager?: boolean;
    allowActiveRepresentative?: boolean;
}

/**
 * AdminRoute Component
 * Wrapper for routes that require admin privileges
 * Redirects to soundBoard if user is not an admin or not authenticated
 */
const AdminRoute: React.FC<AdminRouteProps> = ({
    children,
    allowRepresentativeManager = false,
    allowActiveRepresentative = false,
}) => {
    const { isAuthenticated, isLoading, user } = useAuthStore();
    const location = useLocation();

    // Show loading state while checking auth
    if (isLoading) {
        return <LoadingFallback />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
        console.warn("AdminRoute: User not authenticated, redirecting to login");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has admin role
    const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
    const isActiveRepresentative =
        user.role === "REPRESENTATIVE" &&
        user.representativeProfile?.isActive === true;
    const isRepresentativeManager =
        allowRepresentativeManager &&
        isActiveRepresentative &&
        user.representativeProfile?.canManageReps === true;
    const isAllowedRepresentative =
        (allowActiveRepresentative && isActiveRepresentative) || isRepresentativeManager;

    if (!isAdmin && !isAllowedRepresentative) {
        console.warn("AdminRoute: User does not have admin privileges, redirecting to soundBoard");
        return <Navigate to="/soundBoard" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
