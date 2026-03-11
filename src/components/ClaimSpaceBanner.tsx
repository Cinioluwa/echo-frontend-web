/**
 * ClaimSpaceBanner
 * Figma ref: 4162:11232 (desktop), 4175:12497 (mobile)
 * Phase: 2
 *
 * Dismissible banner shown at top of feed when institution has no leader.
 * Desktop: inline row with text + two CTA buttons.
 * Mobile: full-width with X dismiss button.
 */

import { useState } from "react";

interface ClaimSpaceBannerProps {
    onClaimSpace: () => void;
    onInviteLeader: () => void;
}

// TODO: API — check if institution has a leader (GET /api/organization/:id/leader)
// TODO: API — only show banner if no leader exists

const ClaimSpaceBanner = ({ onClaimSpace, onInviteLeader }: ClaimSpaceBannerProps) => {
    const [dismissed, setDismissed] = useState(() => {
        try {
            return localStorage.getItem("claimSpaceBannerDismissed") === "true";
        } catch {
            return false;
        }
    });

    const handleDismiss = () => {
        try {
            localStorage.setItem("claimSpaceBannerDismissed", "true");
        } catch {
            // ignore
        }
        setDismissed(true);
    };

    if (dismissed) return null;

    return (
        <div className="bg-[#FEF5EA] rounded-[13px] w-full relative">
            {/* ── Mobile layout (column: text → buttons row) ── */}
            {/* Figma ref: 4175:12497 — 367×92px, text at top, two buttons side-by-side, X at top-right */}
            <div className="flex md:hidden flex-col px-5 py-[15px] gap-[13px]">
                {/* X dismiss — absolute top-right */}
                <button
                    onClick={handleDismiss}
                    aria-label="Dismiss banner"
                    className="absolute top-[17px] right-5 text-black/40 hover:text-black/70 transition-colors text-[14px] leading-none cursor-pointer"
                >
                    ✕
                </button>

                {/* Text */}
                <p className="font-['Poppins',sans-serif] font-medium text-[14px] leading-[18px] text-black opacity-[0.69] pr-6">
                    This space is waiting for a{" "}
                    <span className="text-[#F49B31] not-italic">Leader</span>.
                </p>

                {/* Two CTA buttons — side by side (each ~158.5px, 34px tall) */}
                <div className="flex items-center gap-[8.5px]">
                    <button
                        onClick={onClaimSpace}
                        className="flex-1 bg-[#F49B31] text-white font-['Poppins',sans-serif] font-medium text-[11px] h-[34px] rounded-[15px] cursor-pointer hover:bg-[#d88429] transition-colors flex items-center justify-center"
                    >
                        That's me — Claim this space
                    </button>
                    <button
                        onClick={onInviteLeader}
                        className="flex-1 bg-[#F49B31] text-white font-['Poppins',sans-serif] font-medium text-[11px] h-[34px] rounded-[15px] cursor-pointer hover:bg-[#d88429] transition-colors flex items-center justify-center"
                    >
                        Know someone? Invite them
                    </button>
                </div>
            </div>

            {/* ── Desktop layout (row: text + buttons + X dismiss) ── */}
            {/* Figma ref: 4162:11232 — 762×80px inline row */}
            <div className="hidden md:flex items-center justify-between px-5 py-[15px] gap-2.5">
                {/* Text */}
                <p className="font-['Poppins',sans-serif] font-medium text-[20px] leading-[25px] text-black opacity-[0.69]">
                    This space is waiting for a{" "}
                    <span className="text-[#F49B31]">Leader</span>.
                </p>

                {/* CTA buttons + X dismiss */}
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={onClaimSpace}
                        className="bg-[#F49B31] text-white font-['Poppins',sans-serif] font-medium text-[14px] px-[15px] py-[15px] rounded-[15px] whitespace-nowrap cursor-pointer hover:bg-[#d88429] transition-colors flex items-center justify-center"
                    >
                        That's me — Claim this space
                    </button>
                    <button
                        onClick={onInviteLeader}
                        className="bg-[#F49B31] text-white font-['Poppins',sans-serif] font-medium text-[14px] px-[15px] py-[15px] rounded-[15px] whitespace-nowrap cursor-pointer hover:bg-[#d88429] transition-colors flex items-center justify-center"
                    >
                        Know someone? Invite them
                    </button>
                    <button
                        onClick={handleDismiss}
                        aria-label="Dismiss banner"
                        className="text-black/40 hover:text-black/70 transition-colors ml-1 text-[18px] leading-none shrink-0 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClaimSpaceBanner;
