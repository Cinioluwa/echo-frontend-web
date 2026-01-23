import { useAuth } from "../contexts/AuthContext";
import { User } from 'lucide-react';

const UserInfo = () => {
  const { user, loading, error } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="inline-flex mr-2.5 ml-2.5 md:ml-[55px] items-center gap-2.5 md:mr-[35px]">
        <div className="animate-pulse flex items-center gap-2.5">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="w-[50px] h-[50px] bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Error or no user state
  if (error || !user) {
    return (
      <div className="inline-flex mr-2.5 ml-2.5 md:ml-[55px] items-center gap-2.5 md:mr-[35px]">
        <div className="text-end">
          <p className="text-[#926B3D] text-[7px] md:text-[12px]">Guest</p>
        </div>
        <span className="w-[50px] inline-flex items-center justify-center h-[50px] cursor-pointer rounded-full bg-gray-200">
          <User className="w-6 h-6 text-gray-500" />
        </span>
      </div>
    );
  }

  // Display user info
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="inline-flex mr-2.5 ml-2.5 md:ml-[55px] items-center gap-2.5 md:mr-[35px]">
      <div className="text-end">
        <p className="text-[#926B3D] text-[7px] md:text-[12px]">Welcome back!</p>
        <p className="text-[10px] md:text-[14px]">{fullName}</p>
      </div>

      <span className="w-[50px] inline-flex items-center justify-center h-[50px] cursor-pointer rounded-full bg-gray-200">
        <User className="w-6 h-6 text-gray-500" />
      </span>
    </div>
  );
};

export default UserInfo;
