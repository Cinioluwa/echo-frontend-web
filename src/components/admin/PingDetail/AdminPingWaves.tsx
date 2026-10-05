import React from "react";
import type { Wave } from "../../../api/types/index";
import AdminWaveCard from "./AdminWaveCard";
import type { PingDetailPermissions, WaveActionStatus } from "./types";

interface AdminPingWavesProps {
    waves: Wave[];
    permissions: PingDetailPermissions;
    onUpdateWaveStatus: (id: number, status: WaveActionStatus, reason?: string) => Promise<void>;
}

/** Ping Detail only surfaces the two most surged waves. */
const AdminPingWaves: React.FC<AdminPingWavesProps> = ({ waves, permissions, onUpdateWaveStatus }) => {
    const topWaves = [...waves].sort((a, b) => b.surgeCount - a.surgeCount).slice(0, 2);

    return (
        <div className="flex w-full flex-col gap-5">
            <h2 className="font-poppins text-[30px] font-bold text-[#171717]">Waves</h2>
            {topWaves.length === 0 ? (
                <p className="rounded-[10px] bg-[#fefefe] px-6 py-8 text-center font-poppins text-[14px] font-medium text-[#8b8e8d]">
                    No waves have been proposed for this ping yet.
                </p>
            ) : (
                topWaves.map((wave, index) => (
                    <AdminWaveCard
                        key={wave.id}
                        wave={wave}
                        rank={index === 0 ? 0 : 1}
                        permissions={permissions}
                        onUpdateStatus={onUpdateWaveStatus}
                    />
                ))
            )}
        </div>
    );
};

export default AdminPingWaves;
