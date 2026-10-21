import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores";

interface RepresentativeRouteProps {
  permission?: "canModerateWaves" | "canManageReps";
}

const RepresentativeRoute = ({ permission }: RepresentativeRouteProps) => {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== "REPRESENTATIVE") return <Navigate to="/feed" replace />;
  if (permission) {
    const profile = user.representativeProfile;
    if (!profile?.isActive || profile[permission] !== true) {
      return <Navigate to="/inbox" replace />;
    }
  }
  return <Outlet />;
};

export default RepresentativeRoute;
