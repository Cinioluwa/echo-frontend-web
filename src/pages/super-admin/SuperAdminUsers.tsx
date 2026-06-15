import React from "react";
import { Search, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";

const MOCK_USERS = [
  { id: 1, name: "Emmanuel Smith", email: "e.smith@covenantuniversity.edu.ng", institution: "Covenant University", role: "STUDENT", verified: true, joinDate: "24/10/2023" },
  { id: 2, name: "Sarah Johnson", email: "s.johnson@babcock.edu.ng", institution: "Babcock University", role: "LEADER", verified: true, joinDate: "25/10/2023" },
  { id: 3, name: "Michael Obi", email: "m.obi@unilag.edu.ng", institution: "University of Lagos", role: "STUDENT", verified: false, joinDate: "26/10/2023" },
  { id: 4, name: "Jessica Adeleke", email: "j.adeleke@oauife.edu.ng", institution: "Obafemi Awolowo", role: "ADMIN", verified: true, joinDate: "20/10/2023" },
  { id: 5, name: "David Ojo", email: "d.ojo@abu.edu.ng", institution: "Ahmadu Bello Univ.", role: "STUDENT", verified: true, joinDate: "21/10/2023" },
  { id: 6, name: "Blessing Okafor", email: "b.okafor@ui.edu.ng", institution: "University of Ibadan", role: "LEADER", verified: true, joinDate: "22/10/2023" },
];

const SuperAdminUsers: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      {/* Header Filters */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Users"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#f49b31] transition-colors"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Role <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Institution <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Status <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-sm font-semibold text-gray-500">
              <th className="px-6 py-4 font-semibold">User Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Institution</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold text-center">Verified Status</th>
              <th className="px-6 py-4 font-semibold">Join Date</th>
              <th className="px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {MOCK_USERS.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-semibold text-gray-900">{user.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">{user.institution}</td>
                <td className="px-6 py-4">
                  <span className={`px-4 py-1.5 rounded-full block w-[88px] text-center text-xs font-semibold ${user.role === 'LEADER' ? 'bg-[#f49b31] text-white' :
                    user.role === 'ADMIN' ? 'bg-[#fef5ea] border border-[#f49b31] text-black' :
                      'bg-[#FCDCAE] text-black'
                    }`}>
                    {user.role === 'STUDENT' ? 'Student' : user.role === 'LEADER' ? 'Leader' : 'Admin'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    {user.verified ? (
                      <span className=" rounded-full flex items-center justify-center ">Yes</span>
                    ) : (
                      <span className=" rounded-full flex items-center justify-center">No</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.joinDate}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="px-4 py-1.5 text-xs font-semibold text-white bg-[#B91C1C] rounded-[8px] hover:bg-red-800 transition-colors">
                      Ban
                    </button>
                    <button className="px-4 py-1.5 text-xs font-semibold text-black bg-[#FEF5EA] border border-[#FCA5A5] rounded-[8px] hover:bg-[#FDE8D1] transition-colors whitespace-nowrap">
                      Change Role
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <select className="border border-gray-200 rounded px-2 py-1 outline-none">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
        <span>Showing 1 to 6 of 1,335 entries</span>
        <div className="flex items-center gap-2">
          <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-600 disabled:opacity-50"><ChevronLeft size={16} /></button>
          <button className="px-3 py-1 border border-[#f49b31] bg-[#f49b31] text-white rounded font-medium">1</button>
          <button className="px-3 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 font-medium">2</button>
          <button className="px-3 py-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 font-medium">3</button>
          <span>...</span>
          <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-600"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminUsers;
