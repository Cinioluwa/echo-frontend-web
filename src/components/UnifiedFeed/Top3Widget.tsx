/**
 * Top3Widget
 * Figma ref: embedded in desktop feed right column (S1 — 4167:11816)
 * Phase: 2
 *
 * Right-column widget showing top 3 most-surged pings.
 * "Top 3" header, 3 rows each with: colored dot, user avatar, ping title (truncated), surge count.
 */

import type { Ping } from "../../api/types";

interface Top3WidgetProps {
    pings?: Ping[];
}

// TODO: API — fetch top 3 pings sorted by surgeCount desc, limit 3

const MOCK_TOP3: Ping[] = [
    {
        id: 1,
        title: "The wifi is too slow",
        content: "",
        surgeCount: 128,
        status: "POSTED",
        createdAt: new Date().toISOString(),
        author: { id: 1, email: "", firstName: "Osagumwenro", lastName: "Ugbo", role: "USER", organizationId: null, status: "ACTIVE", createdAt: "" },
        category: { id: 1, name: "General" },
    },
    {
        id: 2,
        title: "Chapel attendance policy needs revision",
        content: "",
        surgeCount: 105,
        status: "POSTED",
        createdAt: new Date().toISOString(),
        author: { id: 2, email: "", firstName: "Isaac", lastName: "Israel", role: "USER", organizationId: null, status: "ACTIVE", createdAt: "" },
        category: { id: 3, name: "Chapel" },
    },
    {
        id: 3,
        title: "Cafeteria food quality has dropped",
        content: "",
        surgeCount: 89,
        status: "POSTED",
        createdAt: new Date().toISOString(),
        author: { id: 3, email: "", firstName: "Felix", lastName: "Oluwapelumi", role: "USER", organizationId: null, status: "ACTIVE", createdAt: "" },
        category: { id: 7, name: "Welfare" },
    },
];

const DOT_COLORS = ["#F49B31", "#FF6B6B", "#FFC37B"];

const Top3Widget = ({ pings = MOCK_TOP3 }: Top3WidgetProps) => {
    const top3 = pings.slice(0, 3);

    return (
        <div className="bg-[#FFC37B] border-2 border-[#FFC37B] rounded-[15px] flex flex-col gap-2.5 items-start px-[15px] py-5 w-[276px]">
            {/* Header */}
            <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-black leading-normal">
                Top 3
            </h3>

            {/* Rows */}
            <div className="flex flex-col gap-2.5 w-full">
                {top3.map((ping, index) => {
                    const authorName =
                        typeof ping.author === "object" && ping.author
                            ? `${ping.author.firstName} ${ping.author.lastName}`
                            : "Anonymous";
                    const initials = authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);

                    return (
                        <div key={ping.id} className="flex items-center gap-2 w-full bg-[#fef0e0] rounded-lg px-3.5 py-2.5">
                            {/* Avatar */}
                            <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: DOT_COLORS[index] }}>
                                <span className="font-['Poppins',sans-serif] font-bold text-[10px] text-white leading-none">
                                    {initials}
                                </span>
                            </div>
                            {/* Title */}
                            <span className="flex-1 font-['Poppins',sans-serif] font-medium text-[13px] text-black truncate leading-normal min-w-0">
                                {ping.title}
                            </span>
                            {/* Surge count */}
                            <div className="flex items-center gap-[3px] shrink-0">
                                <svg width="10" height="13" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M6.5 1L1 9h5l-0.5 6 6-8H7l0.5-6z" fill="#F49B31" />
                                </svg>
                                <span className="font-['Poppins',sans-serif] font-semibold text-[12px] text-[#4A504E] leading-normal">
                                    {ping.surgeCount}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Top3Widget;
