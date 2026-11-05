import React, { useState, useEffect, useCallback } from "react";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { superAdminService } from "../../api/services/super-admin.service";
import type { SuperAdminOrganization } from "../../api/types/admin.types";

const SuperAdminOrganizations: React.FC = () => {
  const [orgs, setOrgs] = useState<SuperAdminOrganization[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchOrgs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.getOrganizations({
        page,
        limit,
        status: statusFilter as any || undefined,
      });
      setOrgs(result.organizations);
      setTotal(result.total);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter]);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const handleStatusToggle = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "PENDING" : "ACTIVE";
    try {
      setActionLoading(id);
      await superAdminService.updateOrganizationStatus(id, newStatus as any);
      await fetchOrgs();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update organization status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = async (org: SuperAdminOrganization) => {
    const name = prompt("Organization name:", org.name);
    if (!name) return;
    try {
      setActionLoading(org.id);
      await superAdminService.updateOrganization(org.id, { name });
      await fetchOrgs();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update organization");
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search organizations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#f49b31] transition-colors"
          />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 mx-6 mt-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-sm font-semibold text-gray-500">
              <th className="px-6 py-4 font-semibold">Institution Name</th>
              <th className="px-6 py-4 font-semibold">Domain</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Join Policy</th>
              <th className="px-6 py-4 font-semibold">Member Count</th>
              <th className="px-6 py-4 font-semibold">Ping Count</th>
              <th className="px-6 py-4 font-semibold">Created Date</th>
              <th className="px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">Loading...</td>
              </tr>
            ) : orgs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">No organizations found</td>
              </tr>
            ) : orgs.map((org) => (
              <tr key={org.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    <img src={`https://ui-avatars.com/api/?name=${org.name}&background=random`} alt={org.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-semibold text-gray-900">{org.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{org.domain || "—"}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-xs text-xs font-bold text-white ${
                    org.status === 'ACTIVE' ? 'bg-[#01B909]' : 'bg-[#CAC13C]'
                  }`}>
                    {org.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {org.joinPolicy === 'OPEN' ? 'Open' : 'Approval Required'}
                </td>
                <td className="px-6 py-4 text-gray-600">{org.userCount}</td>
                <td className="px-6 py-4 text-gray-600">{org.pingCount}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(org.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleStatusToggle(org.id, org.status)}
                      disabled={actionLoading === org.id}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#B91C1C] rounded-[8px] hover:bg-red-800 transition-colors disabled:opacity-50"
                    >
                      {org.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(org)}
                      disabled={actionLoading === org.id}
                      className="px-4 py-1.5 text-xs font-semibold text-black bg-[#FEF5EA] border border-[#FCA5A5] rounded-[8px] hover:bg-[#FDE8D1] transition-colors disabled:opacity-50"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            className="border border-gray-200 rounded px-2 py-1 outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <span>Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} entries</span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded font-medium ${
                page === i + 1
                  ? "border-[#f49b31] bg-[#f49b31] text-white"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          {totalPages > 5 && <span>...</span>}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminOrganizations;