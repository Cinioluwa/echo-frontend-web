import React, { useState, useEffect } from "react";
import MetricCard from "../../components/super-admin/MetricCard";
import { AlertTriangle } from "lucide-react";
import { superAdminService } from "../../api/services/super-admin.service";

const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await superAdminService.getStats();
        setStats(data);
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin w-12 h-12 border-4 border-[#f49b31] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<img src="/assets/icon/organization.svg" alt="" />}
          value={stats?.organizations?.total?.toLocaleString() ?? "0"}
          label="Total Organizations"
        />
        <MetricCard
          icon={<img src="/assets/icon/profile.svg" alt="" />}
          value={stats?.users?.total?.toLocaleString() ?? "0"}
          label="Total Users"
        />
        <MetricCard
          icon={<img src="/assets/images/sound board.svg" className="w-[24px] h-[24px]" alt="Sound Board" />}
          value={stats?.content?.pings?.toLocaleString() ?? "0"}
          label="Total Pings"
        />
        <MetricCard
          icon={<img src="/assets/icon/wave.svg" alt="Wave" className="w-[24px] h-[24px]" />}
          value={stats?.content?.waves?.toLocaleString() ?? "0"}
          label="Total Waves"
        />
        <MetricCard
          icon={<img src="/assets/images/surge.svg" />}
          value={stats?.content?.surges?.toLocaleString() ?? "0"}
          label="Total Surges"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#f49b31] rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between h-[129px]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Organization Requests Pending Approval</h3>
            <AlertTriangle size={24} />
          </div>
          <div className="flex items-center gap-3">
            <img src="/assets/icon/organization-white.svg" alt="Organization" width={32} height={32} />
            <span className="text-4xl font-bold">{stats?.queue?.pendingOrgRequests ?? 0}</span>
          </div>
        </div>

        <div className="bg-[#f49b31] rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between h-[129px]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Leader Claim Pending Approval</h3>
            <AlertTriangle size={24} />
          </div>
          <div className="flex items-center gap-3">
            <img src="/assets/icon/student.svg" alt="Student" width={32} height={32} />
            <span className="text-4xl font-bold">{stats?.queue?.pendingClaims ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;