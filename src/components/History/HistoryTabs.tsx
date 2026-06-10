/**
 * HistoryTabs
 * Figma ref: 4183:13372 (desktop picker), 4183:13600 (mobile picker)
 * Phase: 4
 *
 * Tab picker below the History banner.
 * 4 tabs: Pings | Waves | Comments | Surged
 * - Active: bg-[#F49B31] filled background, white text
 * - Inactive: bg-[#FFC37B] with border, dark text
 * - Desktop: text-[20px], px-[20px] py-[5px], gap-[15px], p-[5px]
 * - Mobile: text-[9px], px-2.5 py-[5px], gap-[10px]
 * Tab selection updates URL param: /history/pings, /history/waves, etc.
 */

import { useNavigate } from "react-router-dom";

export type HistoryTab = "pings" | "waves" | "comments" | "surged";

interface HistoryTabsProps {
    activeTab: HistoryTab;
}

const TABS: { id: HistoryTab; label: string }[] = [
    { id: "pings", label: "Pings" },
    { id: "waves", label: "Waves" },
    { id: "comments", label: "Comments" },
    { id: "surged", label: "Surged" },
];

const HistoryTabs = ({ activeTab }: HistoryTabsProps) => {
    const navigate = useNavigate();

    const handleTabClick = (tab: HistoryTab) => {
        navigate(`/history/${tab}`);
    };

    return (
        /* Desktop picker */
        <div className="flex items-center gap-[15px] p-[5px]">
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={[
                            "flex items-center justify-center rounded-[18px] cursor-pointer transition-colors",
                            /* Desktop sizing */
                            "px-5 py-[5px]",
                            /* Mobile sizing overrides applied via responsive wrapper in parent */
                            isActive
                                ? "bg-[#F49B31]"
                                : "bg-[#FFC37B] border border-[#7B7B79]",
                        ].join(" ")}
                        aria-current={isActive ? "page" : undefined}
                    >
                        <span
                            className={[
                                "font-['Poppins',sans-serif] font-semibold leading-normal whitespace-nowrap",
                                /* Desktop text size */
                                "text-[20px]",
                                isActive ? "text-white" : "text-[#414141]",
                            ].join(" ")}
                        >
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

/** Mobile variant — compact pills matching Figma 4183:13600 */
export const HistoryTabsMobile = ({ activeTab }: HistoryTabsProps) => {
    const navigate = useNavigate();

    const handleTabClick = (tab: HistoryTab) => {
        navigate(`/history/${tab}`);
    };

    return (
        <div className="flex items-center gap-2">
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={[
                            "flex items-center justify-center rounded-[18px] cursor-pointer transition-colors",
                            "px-2 py-[5px]",
                            isActive
                                ? "bg-[#F49B31]"
                                : "bg-[#FFC37B] border-[0.5px] border-[#7B7B79]",
                        ].join(" ")}
                        aria-current={isActive ? "page" : undefined}
                    >
                        <span
                            className={[
                                "font-['Poppins',sans-serif] font-semibold leading-normal whitespace-nowrap",
                                "text-[9px]",
                                isActive ? "text-white" : "text-[#414141]",
                            ].join(" ")}
                        >
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default HistoryTabs;
