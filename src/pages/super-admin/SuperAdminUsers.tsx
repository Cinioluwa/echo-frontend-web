import React, { useState, useEffect, useCallback } from "react";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { superAdminService } from "../../api/services/super-admin.service";
import type { SuperAdminUser } from "../../api/types/admin.types";

const SuperAdminUsers: React.FC = () => {
  const [users, setUsers] = useState<SuperAdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.getUsers({
        page,
        limit,
        search: search || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      });
      setUsers(result.users);
      setTotal(result.total);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleBan = async (id: number) => {
    try {
      setActionLoading(id);
      await superAdminService.updateUserStatus(id, "PENDING");
      await fetchUsers();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async (id: number) => {
    try {
      setActionLoading(id);
      await superAdminService.updateUserStatus(id, "ACTIVE");
      await fetchUsers();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (id: number) => {
    const newRole = prompt("Enter new role (USER, REPRESENTATIVE, ADMIN, SUPER_ADMIN):");
    if (!newRole || !["USER", "REPRESENTATIVE", "ADMIN", "SUPER_ADMIN"].includes(newRole)) return;
    try {
      setActionLoading(id);
      await superAdminService.updateUserRole(id, newRole as any);
      await fetchUsers();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update role");
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
            placeholder="Search Users"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#f49b31] transition-colors"
          />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="REPRESENTATIVE">Representative</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
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
              <th className="px-6 py-4 font-semibold">User Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Institution</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold">Join Date</th>
              <th className="px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">Loading...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No users found</td>
              </tr>
            ) : users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    <img src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`} alt={user.firstName} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-semibold text-gray-900">{user.firstName} {user.lastName}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">{user.organization?.name || "—"}</td>
                <td className="px-6 py-4">
                  <span className={`px-4 py-1.5 rounded-full block w-[88px] text-center text-xs font-semibold ${
                    user.role === 'ADMIN' ? 'bg-[#fef5ea] border border-[#f49b31] text-black' :
                    user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-300' :
                    'bg-[#FCDCAE] text-black'
                  }`}>
                    {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {user.status !== 'PENDING' ? (
                      <button
                        onClick={() => handleBan(user.id)}
                        disabled={actionLoading === user.id}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#B91C1C] rounded-[8px] hover:bg-red-800 transition-colors disabled:opacity-50"
                      >
                        Ban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnban(user.id)}
                        disabled={actionLoading === user.id}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-[8px] hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => handleRoleChange(user.id)}
                      disabled={actionLoading === user.id}
                      className="px-4 py-1.5 text-xs font-semibold text-black bg-[#FEF5EA] border border-[#FCA5A5] rounded-[8px] hover:bg-[#FDE8D1] transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      Change Role
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

export default SuperAdminUsers;