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
        <div className="bg-[#FEF5EA] rounded-[13px] flex items-center justify-between px-5 py-[15px] w-full">
            {/* Text */}
            <p
                className="font-['Poppins',sans-serif] font-medium text-[20px] leading-[25px] opacity-[0.69]"
                style={{ color: "black" }}
            >
                This space is waiting for a{" "}
                <span className="text-[#F49B31]">Leader</span>.
            </p>

            {/* Desktop CTA buttons + mobile dismiss */}
            <div className="flex items-center gap-2.5">
                <button
                    onClick={onClaimSpace}
                    className="bg-[#F49B31] text-white font-['Poppins',sans-serif] font-medium text-[14px] leading-3.5 px-[15px] py-[15px] rounded-[15px] whitespace-nowrap cursor-pointer hover:bg-[#d88429] transition-colors hidden md:flex items-center justify-center"
                >
                    That's me — Claim this space
                </button>
                <button
                    onClick={onInviteLeader}
                    className="bg-[#F49B31] text-white font-['Poppins',sans-serif] font-medium text-[14px] leading-3.5 px-[15px] py-[15px] rounded-[15px] whitespace-nowrap cursor-pointer hover:bg-[#d88429] transition-colors hidden md:flex items-center justify-center"
                >
                    Know someone? Invite them
                </button>

                {/* Mobile: single stacked CTAs + dismiss */}
                <div className="flex md:hidden flex-col gap-2">
                    <button
                        onClick={onClaimSpace}
                        className="bg-[#F49B31] text-white font-['Poppins',sans-serif] font-medium text-[12px] px-2.5 py-2 rounded-xl cursor-pointer hover:bg-[#d88429] transition-colors"
                    >
                        Claim this space
                    </button>
                    <button
                        onClick={onInviteLeader}
                        className="bg-[#F49B31] text-white font-['Poppins',sans-serif] font-medium text-[12px] px-2.5 py-2 rounded-xl cursor-pointer hover:bg-[#d88429] transition-colors"
                    >
                        Invite someone
                    </button>
                </div>

                {/* X dismiss — visible on all sizes */}
                <button
                    onClick={handleDismiss}
                    aria-label="Dismiss banner"
                    className="text-black/40 hover:text-black/70 transition-colors ml-1 text-[18px] leading-none shrink-0 cursor-pointer"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default ClaimSpaceBanner;
