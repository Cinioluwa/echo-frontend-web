/**
 * History
 * Figma ref: 4183:13259 (desktop pings tab), 4183:13137 (mobile pings tab),
 *            4183:17017 (desktop section), 4183:17018 (mobile section)
 * Phase: 4
 *
 * Tabbed activity hub — Pings | Waves | Comments | Surged
 * Desktop layout:
 *   Row 1: "← Go back to feed" (left) + "+ Create a Ping" (right)
 *   Row 2: HistoryBanner
 *   Row 3: HistoryTabs (picker)
 *   Row 4: Tab content
 */
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import {
    HistoryBanner,
    HistoryTabs,
    HistoryTabsMobile,
    HistoryPingsList,
    HistoryWavesList,
    HistoryCommentsList,
    HistorySurgedList,
} from "../components/History";
import type { HistoryTab } from "../components/History";
import { FaPlus } from "react-icons/fa6";

const VALID_TABS: HistoryTab[] = ["pings", "waves", "comments", "surged"];

const History = () => {
    const { tab } = useParams<{ tab: string }>();
    const navigate = useNavigate();
    const { setShowPingFormModal } = useOutletContext<{
        showPingFormModal: boolean;
        setShowPingFormModal: (value: boolean) => void;
    }>();

    // Set page title
    usePageTitle();

    const activeTab: HistoryTab =
        tab && VALID_TABS.includes(tab as HistoryTab)
            ? (tab as HistoryTab)
            : "pings";

    return (
        <div className="min-h-screen flex flex-col w-full max-w-full">
            {/* ─── Desktop action buttons row ─────────────────────────────── */}
            <div className="hidden md:flex items-center justify-between mb-[22px]">
                <button
                    onClick={() => navigate("/feed")}
                    className="flex items-center gap-2 bg-[#fefefe] rounded-[18px] px-5 py-[5px] font-['Poppins',sans-serif] font-medium text-[15px] text-black hover:bg-[#FFC37B] transition-colors cursor-pointer"
                >
                    ← Go back to feed
                </button>
                <button
                    onClick={() => setShowPingFormModal(true)}
                    className="flex items-center gap-2 bg-[#F49B31] hover:bg-[#d88429] transition-colors rounded-[18px] px-5 py-[5px] cursor-pointer"
                >
                    <FaPlus className="w-3 h-3 text-white" />
                    <span className="font-['Poppins',sans-serif] font-medium text-[15px] text-white">
                        Create a Ping
                    </span>
                </button>
            </div>

            {/* ─── Banner ────────────────────────────────────────────────── */}
            <HistoryBanner />

            {/* ─── Tab picker ─────────────────────────────────────────────── */}
            <div className="mt-[15px]">
                {/* Desktop tabs */}
                <div className="hidden md:block">
                    <HistoryTabs activeTab={activeTab} />
                </div>
                {/* Mobile tabs */}
                <div className="md:hidden">
                    <HistoryTabsMobile activeTab={activeTab} />
                </div>
            </div>

            {/* ─── Tab content ────────────────────────────────────────────── */}
            <div className="mt-[15px] flex-1 overflow-y-auto">
                {activeTab === "pings" && <HistoryPingsList />}
                {activeTab === "waves" && <HistoryWavesList />}
                {activeTab === "comments" && <HistoryCommentsList />}
                {activeTab === "surged" && <HistorySurgedList />}
            </div>
        </div>
    );
};

export default History;
