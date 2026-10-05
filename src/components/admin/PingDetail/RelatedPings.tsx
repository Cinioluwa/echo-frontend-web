import React from "react";
import { useNavigate } from "react-router-dom";
import type { RelatedPing } from "./types";

interface RelatedPingsProps {
    pings: RelatedPing[];
    detailBasePath: string;
}

const RelatedPings: React.FC<RelatedPingsProps> = ({ pings, detailBasePath }) => {
    const navigate = useNavigate();
    if (pings.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[rgba(244,155,49,0.3)] bg-white p-[21px]">
            <h3 className="font-poppins text-[18px] font-semibold text-black">Related Pings</h3>
            <div className="flex flex-col gap-2">
                {pings.map((ping) => (
                    <button
                        type="button"
                        key={ping.id}
                        onClick={() => navigate(`${detailBasePath}/${ping.id}`)}
                        className="flex h-[55px] cursor-pointer items-center justify-between gap-2 rounded-xl bg-[#fef5ea] p-[7px] transition-colors hover:bg-[#ffe8cf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f49b31]"
                        aria-label={`Open related ping: ${ping.title}`}
                    >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                            <span className="rounded-[20px] bg-[#f49b31] px-2 py-0.5 font-['DM_Sans',sans-serif] text-[11px] font-semibold text-[#fef5ea]">
                                {ping.category}
                            </span>
                            <p className="min-w-0 flex-1 truncate font-poppins text-[11px] font-semibold text-black">
                                {ping.title}
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                            <img src="/assets/images/surge.svg" alt="" className="h-[14px] w-[9px]" />
                            <span className="font-poppins text-[14px] font-semibold text-[#f49b31]">
                                {ping.waveCount}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RelatedPings;
