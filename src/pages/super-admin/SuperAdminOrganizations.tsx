import React from "react";
import { Search, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";

// Mock data for Organizations
const MOCK_ORGANIZATIONS = [
  { id: 1, name: "Covenant University", domain: "@covenantuniversity.edu.ng", status: "ACTIVE", joinPolicy: "Claimed", memberCount: 150, pingCount: 450, date: "24/10/2023" },
  { id: 2, name: "Babcock University", domain: "@babcock.edu.ng", status: "ACTIVE", joinPolicy: "Claimed", memberCount: 120, pingCount: 320, date: "25/10/2023" },
  { id: 3, name: "University of Lagos", domain: "@unilag.edu.ng", status: "PENDING", joinPolicy: "Unclaimed", memberCount: 0, pingCount: 0, date: "26/10/2023" },
  { id: 4, name: "Obafemi Awolowo", domain: "@oauife.edu.ng", status: "ACTIVE", joinPolicy: "Claimed", memberCount: 300, pingCount: 1200, date: "20/10/2023" },
  { id: 5, name: "Ahmadu Bello Univ.", domain: "@abu.edu.ng", status: "ACTIVE", joinPolicy: "Unclaimed", memberCount: 80, pingCount: 150, date: "21/10/2023" },
  { id: 6, name: "University of Ibadan", domain: "@ui.edu.ng", status: "ACTIVE", joinPolicy: "Claimed", memberCount: 200, pingCount: 800, date: "22/10/2023" },
  { id: 7, name: "University of Benin", domain: "@uniben.edu", status: "ACTIVE", joinPolicy: "Claimed", memberCount: 180, pingCount: 650, date: "23/10/2023" },
  { id: 8, name: "Nnamdi Azikiwe", domain: "@unizik.edu.ng", status: "PENDING", joinPolicy: "Unclaimed", memberCount: 0, pingCount: 0, date: "27/10/2023" },
];

const SuperAdminOrganizations: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      {/* Header Filters */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#f49b31] transition-colors"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Status <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Domain <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Join Policy <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
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
            {MOCK_ORGANIZATIONS.map((org) => (
              <tr key={org.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    <img src={`https://ui-avatars.com/api/?name=${org.name}&background=random`} alt={org.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-semibold text-gray-900">{org.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{org.domain}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-xs text-xs font-bold w-[80px] text-white block ${org.status === 'ACTIVE' ? 'bg-[#01B909] ' :
                    'bg-[#CAC13C]'
                    }`}>
                    {org.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{org.joinPolicy}</td>
                <td className="px-6 py-4 text-gray-600">{org.memberCount}</td>
                <td className="px-6 py-4 text-gray-600">{org.pingCount}</td>
                <td className="px-6 py-4 text-gray-600">{org.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="px-4 py-1.5 text-xs font-semibold text-white bg-[#B91C1C] rounded-[8px] hover:bg-red-800 transition-colors">
                      Deactivate
                    </button>
                    <button className="px-4 py-1.5 text-xs font-semibold text-black bg-[#FEF5EA] border border-[#FCA5A5] rounded-[8px] hover:bg-[#FDE8D1] transition-colors">
                      Edit
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
        <span>Showing 1 to 8 of 400 entries</span>
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

export default SuperAdminOrganizations;
