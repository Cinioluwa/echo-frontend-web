import React, { useState } from "react";
import type { Wave } from "../../../api/types/index";
import AdminWaveCard from "./AdminWaveCard";

interface AdminPingWavesProps {
    waves: Wave[];
    onUpdateWaveStatus: (id: number, status: "APPROVED" | "REJECTED" | "UNDER_REVIEW") => Promise<void>;
}

type Tab = "Top" | "Approved" | "Rejected";

const AdminPingWaves: React.FC<AdminPingWavesProps> = ({ waves, onUpdateWaveStatus }) => {
    const [activeTab, setActiveTab] = useState<Tab>("Top");

    const topWaves = [...waves].sort((a, b) => b.surgeCount - a.surgeCount);
    const approvedWaves = waves.filter(w => w.status === "APPROVED");
    const rejectedWaves = waves.filter(w => w.status === "REJECTED");
    let currentWaves: Wave[] = [];
    if (activeTab === "Top") currentWaves = topWaves;
    if (activeTab === "Approved") currentWaves = approvedWaves;
    if (activeTab === "Rejected") currentWaves = rejectedWaves;

    return (
        <div className="flex flex-col gap-4 w-full">
            <h2 className="font-poppins font-bold text-[20px] text-black">
                Waves on this ping
            </h2>

            <div className="flex gap-4 border-b border-[#e0e0e0]">
                <button
                    onClick={() => setActiveTab("Top")}
                    className={`pb-2 font-poppins font-semibold text-[14px] ${activeTab === "Top" ? "border-b-2 border-[#f49b31] text-[#f49b31]" : "text-[#8b8e8d]"}`}
                >
                    Top ({topWaves.length})
                </button>
                <button
                    onClick={() => setActiveTab("Approved")}
                    className={`pb-2 font-poppins font-semibold text-[14px] ${activeTab === "Approved" ? "border-b-2 border-[#f49b31] text-[#f49b31]" : "text-[#8b8e8d]"}`}
                >
                    Approved ({approvedWaves.length})
                </button>
                <button
                    onClick={() => setActiveTab("Rejected")}
                    className={`pb-2 font-poppins font-semibold text-[14px] ${activeTab === "Rejected" ? "border-b-2 border-[#f49b31] text-[#f49b31]" : "text-[#8b8e8d]"}`}
                >
                    Rejected ({rejectedWaves.length})
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {currentWaves.length === 0 ? (
                    <p className="font-poppins text-sm text-gray-500 py-4">No waves found in this category.</p>
                ) : (
                    currentWaves.map(wave => (
                        <AdminWaveCard
                            key={wave.id}
                            wave={wave}
                            onUpdateStatus={onUpdateWaveStatus}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPingWaves;
