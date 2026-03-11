/**
 * History
 * Figma ref: 4183:13259 (desktop pings tab), 4183:13137 (mobile pings tab)
 * Phase: 4 (placeholder created in Phase 1 for routing)
 *
 * TODO: Phase 4 — Full implementation with:
 * - Tabbed activity hub (Pings / Waves / Comments / Surged)
 * - History banner
 * - Tab content for each tab
 */
import { useParams } from "react-router-dom";

const History = () => {
    const { tab } = useParams<{ tab: string }>();

    return (
        <div>
            <h1 className="text-[22px] font-semibold mb-4">History</h1>
            {tab && (
                <p className="text-sm text-[#F49B31] mb-2">
                    Active tab: {tab}
                </p>
            )}
            <p className="text-gray-500 text-sm">
                Tabbed history page coming in Phase 4.
            </p>
            {/* TODO: Phase 4 — History banner, tab picker, tab content */}
        </div>
    );
};

export default History;
