import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores";

const RepresentativeRoute = () => {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== "REPRESENTATIVE") return <Navigate to="/feed" replace />;
  return <Outlet />;
};

export default RepresentativeRoute;
