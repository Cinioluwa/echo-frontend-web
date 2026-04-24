import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores";
import LoadingFallback from "./LoadingFallback";

/**
 * ProfileRedirect Component
 * Conditional redirect for profile route
 * - Admins are redirected to /admin/profile
 * - Regular users are redirected to /user/profile
 */
const ProfileRedirect: React.FC = () => {
    const { isAuthenticated, isLoading, user } = useAuthStore();
    const location = useLocation();

    // Show loading state while checking auth
    if (isLoading) {
        return <LoadingFallback />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has admin role
    const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

    // Redirect admins to admin profile, others to user profile
    return <Navigate to={isAdmin ? "/admin/profile" : "/user/profile"} replace />;
};

export default ProfileRedirect;
