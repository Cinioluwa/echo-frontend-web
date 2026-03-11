/**
 * HistorySurgedList
 * Figma ref: 4th frame in S5 (desktop: 4183:17017), 4th frame in S6 (mobile: 4183:17018)
 * Phase: 4
 *
 * Content for the "Surged" tab on the History page.
 * Shows pings/waves the user has surged (upvoted) — uses the same
 * compact card format as the Pings tab.
 *
 * TODO: API — GET /api/users/me/surges with pagination
 */

import type { Ping } from "../../api/types";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";
import UnifiedPingCard from "../UnifiedFeed/UnifiedPingCard";

// ---------------------------------------------------------------------------
// Mock data — replace with /api/users/me/surges once available
// ---------------------------------------------------------------------------
const MOCK_SURGED: Ping[] = [
    {
        id: 101,
        title: "The roads connecting the cafeteria are in a terrible state",
        content:
            "The potholes have gotten worse after the last rain. People are tripping daily.",
        category: { id: 5, name: "Roads" },
        author: {
            id: 2,
            firstName: "Rachael",
            lastName: "Adeyemi",
            email: "rachael@echo.com",
            role: "USER",
            organizationId: 1,
            status: "ACTIVE",
            createdAt: "2024-01-01T00:00:00.000Z",
        },
        surgeCount: 1203,
        status: "POSTED",
        createdAt: "2024-03-05T11:00:00.000Z",
        updatedAt: "2024-03-05T11:00:00.000Z",
    },
    {
        id: 102,
        title: "Library computers crash during peak hours",

        content:
            "At least 6 workstations reboot without warning between 2–5 pm, causing lost work.",
        category: { id: 6, name: "Library" },
        author: {
            id: 3,
            firstName: "Olumide",
            lastName: "Fashola",
            email: "olumide@echo.com",
            role: "USER",
            organizationId: 1,
            status: "ACTIVE",
            createdAt: "2024-01-01T00:00:00.000Z",
        },
        surgeCount: 748,
        status: "POSTED",
        createdAt: "2024-03-08T15:30:00.000Z",
        updatedAt: "2024-03-08T15:30:00.000Z",
    },
];
// ---------------------------------------------------------------------------

interface HistorySurgedListProps {
    isLoading?: boolean;
}

const HistorySurgedList = ({ isLoading = false }: HistorySurgedListProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        );
    }

    if (MOCK_SURGED.length === 0) {
        return (
            <EmptyState
                title="Nothing surged yet"
                description="Pings and waves you surge will appear here."
            />
        );
    }

    return (
        <div className="flex flex-col gap-[15px]">
            {MOCK_SURGED.map((ping) => (
                <UnifiedPingCard key={ping.id} ping={ping} />
            ))}
            {/* TODO: API — pagination when /api/users/me/surges is integrated */}
        </div>
    );
};

export default HistorySurgedList;
