import NavBar from "./NavBar";
import BackButton from "./shared/BackButton";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";

const ProfileLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <div>
      <NavBar />

      <div className="mt-3">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10 py-0">
          <div className="flex items-center">
            {/* Same BackButton as Ping Detail, desktop-sized / mobile-scaled */}
            <div className="hidden md:flex items-center">
              <BackButton
                onClick={() => navigate(isAdmin ? "/admin/soundboard" : "/feed")}
                className="md:py-2 md:px-4 text-sm font-semibold"
              />
            </div>
            <div className="md:hidden flex items-center">
              <BackButton
                onClick={() => navigate(isAdmin ? "/admin/soundboard" : "/feed")}
                className="p-2 text-[13px] gap-[7px] [&_svg]:w-[18px] [&_svg]:h-[18px] [&_span]:text-[13px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
