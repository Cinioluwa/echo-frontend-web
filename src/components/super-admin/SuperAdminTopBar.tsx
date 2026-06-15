import React from "react";
import { useAuthStore } from "../../stores";

interface SuperAdminTopBarProps {
  title: string;
}

const SuperAdminTopBar: React.FC<SuperAdminTopBarProps> = ({ title }) => {
  const user = useAuthStore((state) => state.user);
  
  const displayFullName = user ? `${user.firstName} ${user.lastName}` : "Super Admin";

  return (
    <div className="h-[70px] flex items-center justify-between px-10 border-b border-gray-200 bg-transparent">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">Welcome back!</span>
          <span className="text-sm font-bold text-gray-900">{displayFullName}</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300">
          <img src="/assets/images/user-avatar-placeholder.png" alt="Profile" className="w-full h-full object-cover" onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
          }} />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminTopBar;
