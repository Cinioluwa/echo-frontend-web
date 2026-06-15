import React from "react";
import MetricCard from "../../components/super-admin/MetricCard";
import { AlertTriangle } from "lucide-react";

const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={<img src="/assets/icon/organization.svg" alt="" />} value="400" label="Total Organizations" />
        <MetricCard icon={<img src="/assets/icon/profile.svg" alt="" />} value="1,335" label="Total Users" />
        <MetricCard icon={<img src="/assets/images/sound board.svg" className="w-[24px] h-[24px]" alt="Sound Board" />} value="1,335" label="Total Pings" />
        <MetricCard icon={<img src="/assets/icon/wave.svg" alt="Wave" className="w-[24px] h-[24px]" />} value="1,125" label="Total Waves" />
        <MetricCard icon={<img src="/assets/images/surge.svg" />} value="1,139" label="Total Surges" />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#f49b31] rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between h-[129px]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Organization Requests Pending Approval</h3>
            <AlertTriangle size={24} />
          </div>
          <div className="flex items-center gap-3">
            <img src="/assets/icon/organization-white.svg" alt="Organization" width={32} height={32} />
            <span className="text-4xl font-bold">15</span>
          </div>
        </div>

        <div className="bg-[#f49b31] rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between h-[129px]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Leader Claim Pending Approval</h3>
            <AlertTriangle size={24} />
          </div>
          <div className="flex items-center gap-3">
            <img src="/assets/icon/student.svg" alt="Student" width={32} height={32} />
            <span className="text-4xl font-bold">8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
