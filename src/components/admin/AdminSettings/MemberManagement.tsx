import { Plus } from "lucide-react";
import React, { useState } from "react";

interface WaitingUser {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
}

interface RosterUser {
    id: string;
    name: string;
    email: string;
    role: "Leader" | "Student" | "Admin";
    avatarUrl: string;
}

const MemberManagement: React.FC = () => {
    const [subTab, setSubTab] = useState<"policy" | "waiting" | "roster">("policy");

    // Policy Tab State
    const [joinPolicy, setJoinPolicy] = useState<"open" | "approval">("open");
    const [domains, setDomains] = useState<string[]>(["@cu.stu.cu.edu.ng"]);
    const [newDomain, setNewDomain] = useState("");
    const [isAddingDomain, setIsAddingDomain] = useState(false);

    // Waiting Room State
    const [waitingList, setWaitingList] = useState<WaitingUser[]>([
        { id: "w1", name: "Gabriel Adeola", email: "adeola.gabriel@cu.edu.ng", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriel" },
        { id: "w2", name: "Esther Alao", email: "esther.alao@cu.edu.ng", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Esther" },
        { id: "w3", name: "Victor Chidi", email: "victor.chidi@cu.edu.ng", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Victor" },
    ]);

    // Active Roster State
    const [roster, setRoster] = useState<RosterUser[]>([
        { id: "r1", name: "Osagumwenro Ugbo", email: "osagumwenro.ugbo@cu.edu.ng", role: "Admin", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Osagumwenro" },
        { id: "r2", name: "Tobi Daniel", email: "tobi.daniel@cu.edu.ng", role: "Leader", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tobi" },
        { id: "r3", name: "Favour Benson", email: "favour.benson@cu.edu.ng", role: "Student", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Favour" },
    ]);
    const [searchQuery, setSearchQuery] = useState("");

    // Action handlers
    const addDomain = () => {
        if (newDomain.trim() && !domains.includes(newDomain.trim())) {
            setDomains([...domains, newDomain.trim()]);
            setNewDomain("");
            setIsAddingDomain(false);
        }
    };

    const handleApprove = (id: string) => {
        const approvedUser = waitingList.find((u) => u.id === id);
        if (approvedUser) {
            setRoster([
                ...roster,
                {
                    id: approvedUser.id,
                    name: approvedUser.name,
                    email: approvedUser.email,
                    role: "Student",
                    avatarUrl: approvedUser.avatarUrl,
                },
            ]);
            setWaitingList(waitingList.filter((u) => u.id !== id));
        }
    };

    const handleDeny = (id: string) => {
        setWaitingList(waitingList.filter((u) => u.id !== id));
    };

    const changeRole = (id: string, newRole: "Leader" | "Student" | "Admin") => {
        setRoster(roster.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    };

    const handleRemoveMember = (id: string) => {
        setRoster(roster.filter((u) => u.id !== id));
    };

    const filteredRoster = roster.filter(
        (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6 w-full animate-fade-in">
            {/* Header info */}
            <div className=" pb-4">
                <h2 className="font-poppins font-semibold text-[18px] text-[#212121]">
                    Access & Members
                </h2>
                <p className="font-poppins text-[12px] text-black mt-1">
                    Handles who gets in and who is already inside
                </p>
            </div>

            {/* Sub-tabs Navigation */}
            <div className="flex gap-2 p-1   rounded-[15px] w-fit">
                <button
                    onClick={() => setSubTab("policy")}
                    className={`px-4 py-2 rounded-[12px] font-poppins font-semibold text-[13px] transition-all ${subTab === "policy"
                        ? "bg-[#f49b31] text-white"
                        : "text-[#414141] bg-[#FFC37B]"
                        }`}
                >
                    Join Policy
                </button>
                <button
                    onClick={() => setSubTab("waiting")}
                    className={`px-4 py-2 rounded-[12px] font-poppins font-semibold text-[13px] transition-all relative ${subTab === "waiting"
                        ? "bg-[#f49b31] text-white"
                        : "text-[#414141] bg-[#FFC37B]"
                        }`}
                >
                    Waiting Room
                </button>
                <button
                    onClick={() => setSubTab("roster")}
                    className={`px-4 py-2 rounded-[12px] font-poppins font-semibold text-[13px] transition-all ${subTab === "roster"
                        ? "bg-[#f49b31] text-white"
                        : "text-[#414141] bg-[#FFC37B]"
                        }`}
                >
                    Active Roster
                </button>
            </div>

            {/* --- View Content --- */}
            {subTab === "policy" && (
                <div className="flex flex-col gap-6 w-full animate-fade-in">
                    {/* Join Policy Options */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-poppins font-semibold text-[15px] text-[#212121]">
                            Join Policy
                        </h3>
                        <div className="flex flex-col gap-2.5">
                            {/* Option 1 */}
                            <label className="flex  gap-1 cursor-pointer ">
                                <input
                                    type="radio"
                                    name="join-policy"
                                    checked={joinPolicy === "open"}
                                    onChange={() => setJoinPolicy("open")}
                                    className="mt-1 accent-[#f49b31] scale-125 shrink-0"
                                />
                                <div className=" ">
                                    <span className="font-poppins font-medium text-[14px] text-[#212121]">
                                        Open - Anyone with matching domain joins automatically
                                    </span>
                                </div>
                            </label>

                            {/* Option 2 */}
                            <label className="flex gap-1 cursor-pointer ">
                                <input
                                    type="radio"
                                    name="join-policy"
                                    checked={joinPolicy === "approval"}
                                    onChange={() => setJoinPolicy("approval")}
                                    className="mt-1 accent-[#f49b31] scale-125 shrink-0"
                                />
                                <div className="">
                                    <span className="font-poppins font-medium text-[14px] text-[#212121]">
                                        Approval Required - All new members need leader approval
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Space Domain Section */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-poppins font-semibold text-[15px] text-[#212121]">
                                Space Domain
                            </h3>
                            <button
                                onClick={() => setIsAddingDomain(true)}
                                className="px-4 py-2.5  flex items-center gap-2 rounded-[12px] bg-[#F49B31] text-white font-poppins font-semibold text-[12px] transition-colors"
                            >
                                <Plus size={20} className="stroke-current" />
                                Add New Domain
                            </button>
                        </div>

                        {isAddingDomain && (
                            <div className="flex gap-2 p-3 bg-white border border-[#f49b31] rounded-[12px]">
                                <input
                                    type="text"
                                    placeholder="@domain.edu"
                                    value={newDomain}
                                    onChange={(e) => setNewDomain(e.target.value)}
                                    className="px-3 py-1.5 border border-[#ffd7a8] rounded-[8px] outline-none text-[13px] font-poppins flex-1 focus:border-[#f49b31]"
                                />
                                <button
                                    onClick={addDomain}
                                    className="px-3 py-1.5 bg-[#f49b31] text-white rounded-[8px] text-[12px] font-semibold hover:bg-[#d88429]"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsAddingDomain(false)}
                                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-[8px] text-[12px] font-semibold hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            {domains.map((dom, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between px-5 py-3 border border-[#ffd7a8]/60 bg-white rounded-[15px]"
                                >
                                    <span className="font-poppins font-medium text-[15px] text-[#212121]">
                                        {dom}
                                    </span>
                                    {domains.length > 1 && (
                                        <button
                                            onClick={() => setDomains(domains.filter((d) => d !== dom))}
                                            className="text-red-500 hover:text-red-700 text-[13px] font-poppins"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {subTab === "waiting" && (
                <div className="flex flex-col gap-4 w-full animate-fade-in">
                    {waitingList.length === 0 ? (
                        <div className="p-8 text-center bg-white border border-[#ffd7a8]/60 rounded-[20px] font-poppins text-[#8b8e8d]">
                            No members in the waiting room
                        </div>
                    ) : (
                        <div className="bg-[#fefaf4] border border-[#ffd7a8] rounded-[20px] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#ffd7a8]/20 border-b border-[#ffd7a8]">
                                            <th className="p-4 font-poppins font-semibold text-[14px] text-[#926b3d]">Name</th>
                                            <th className="p-4 font-poppins font-semibold text-[14px] text-[#926b3d]">Email</th>
                                            <th className="p-4 font-poppins font-semibold text-[14px] text-[#926b3d]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {waitingList.map((user) => (
                                            <tr key={user.id} className="border-b border-[#ffd7a8]/30 last:border-0 hover:bg-[#fff9f1] transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-[#f49b31]" />
                                                        <span className="font-poppins font-medium text-[14px] text-[#212121]">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-poppins text-[14px] text-[#5e5c58]">{user.email}</td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(user.id)}
                                                            className="px-3.5 py-1.5 bg-[#e2f7e2] text-[#2e7d32] border border-[#2e7d32]/30 rounded-[10px] font-poppins font-semibold text-[12px] hover:bg-[#d4f2d4]"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeny(user.id)}
                                                            className="px-3.5 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-[10px] font-poppins font-semibold text-[12px] hover:bg-red-100"
                                                        >
                                                            Deny
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {subTab === "roster" && (
                <div className="flex flex-col gap-4 w-full animate-fade-in">
                    {/* Search bar */}
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-[#ffd7a8] rounded-[15px] font-poppins text-[14px] outline-none focus:border-[#f49b31]"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f49b31]">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-[#fefaf4] border border-[#ffd7a8] rounded-[20px] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#ffd7a8]/20 border-b border-[#ffd7a8]">
                                        <th className="p-4 font-poppins font-semibold text-[14px] text-[#926b3d]">Name</th>
                                        <th className="p-4 font-poppins font-semibold text-[14px] text-[#926b3d]">Email</th>
                                        <th className="p-4 font-poppins font-semibold text-[14px] text-[#926b3d]">Role</th>
                                        <th className="p-4 font-poppins font-semibold text-[14px] text-[#926b3d]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRoster.map((user) => (
                                        <tr key={user.id} className="border-b border-[#ffd7a8]/30 last:border-0 hover:bg-[#fff9f1] transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-[#f49b31]" />
                                                    <span className="font-poppins font-medium text-[14px] text-[#212121]">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-poppins text-[14px] text-[#5e5c58]">{user.email}</td>
                                            <td className="p-4">
                                                <span
                                                    className={`px-2 py-0.5 rounded-[6px] font-poppins font-semibold text-[11px] ${user.role === "Admin"
                                                        ? "bg-[#ffefdb] text-[#f49b31]"
                                                        : user.role === "Leader"
                                                            ? "bg-purple-100 text-purple-700"
                                                            : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {user.role !== "Admin" && (
                                                        <>
                                                            <button
                                                                onClick={() => changeRole(user.id, user.role === "Leader" ? "Student" : "Leader")}
                                                                className="px-3 py-1 bg-white border border-[#ffd7a8] rounded-[10px] text-[#f49b31] font-poppins font-medium text-[12px] hover:bg-[#fef5ea]"
                                                            >
                                                                {user.role === "Leader" ? "Demote" : "Promote"}
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveMember(user.id)}
                                                                className="px-3 py-1 bg-white border border-red-200 rounded-[10px] text-red-600 font-poppins font-medium text-[12px] hover:bg-red-50"
                                                            >
                                                                Remove
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberManagement;
