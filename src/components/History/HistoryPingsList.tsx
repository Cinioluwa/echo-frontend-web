/**
 * HistoryPingsList
 * Figma ref: 4183:14830 (desktop pings content), bottom of 4183:13137 (mobile)
 * Phase: 4
 *
 * Content for the "Pings" tab on the History page.
 * Reuses UnifiedPingCard to show the user's own posted pings.
 *
 * TODO: API — GET /api/users/me/pings with pagination
 */

import UnifiedPingCard from "../UnifiedFeed/UnifiedPingCard";
import type { Ping, Wave } from "../../api/types";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";

// ---------------------------------------------------------------------------
// Mock data — replace with API call once /api/users/me/pings is available
// ---------------------------------------------------------------------------
const MOCK_PINGS: (Ping & { waves?: Wave[] })[] = [
    {
        id: 1,
        title: "The water is not stable in the halls",
        content:
            "The water supply in the halls has been inconsistent for the past few weeks. We need this fixed urgently.",
        category: { id: 4, name: "Hall" },
        status: "POSTED",
        surgeCount: 674,
        createdAt: "2024-02-29T21:30:00.000Z",
        _count: { waves: 71, comments: 319, surges: 674 },
        author: {
            id: 1,
            firstName: "Felix",
            lastName: "Oluwapelumi",
            email: "felix@echo.com",
            role: "USER",
            organizationId: 1,
            status: "ACTIVE",
            createdAt: "2024-01-01T00:00:00.000Z",
        },
        waves: [
            {
                id: 101,
                solution: "Upgrade the pumping machines",
                surgeCount: 25,
                viewCount: 0,
                createdAt: "2024-05-30T11:00:00.000Z",
                author: {
                    id: 2,
                    firstName: "Isaac",
                    lastName: "Israel",
                    email: "isaac@echo.com",
                    role: "USER",
                    organizationId: 1,
                    status: "ACTIVE",
                    createdAt: "2024-01-01T00:00:00.000Z",
                },
            },
            {
                id: 102,
                solution: "Get a bigger water tank",
                surgeCount: 58,
                viewCount: 0,
                createdAt: "2024-05-30T11:00:00.000Z",
                author: {
                    id: 3,
                    firstName: "Emmanuel",
                    lastName: "Okonkwo",
                    email: "emmanuel@echo.com",
                    role: "USER",
                    organizationId: 1,
                    status: "ACTIVE",
                    createdAt: "2024-01-01T00:00:00.000Z",
                },
            },
        ],
    },
    {
        id: 2,
        title: "The chapel PA system needs urgent repair",
        content:
            "During last Sunday's service, the speakers were crackling badly. Several worship sessions have been affected.",
        category: { id: 3, name: "Chapel" },
        status: "POSTED",
        surgeCount: 312,
        createdAt: "2024-03-10T09:00:00.000Z",
        _count: { waves: 18, comments: 45, surges: 312 },
        author: {
            id: 1,
            firstName: "Felix",
            lastName: "Oluwapelumi",
            email: "felix@echo.com",
            role: "USER",
            organizationId: 1,
            status: "ACTIVE",
            createdAt: "2024-01-01T00:00:00.000Z",
        },
        waves: [],
    },
];
// ---------------------------------------------------------------------------

interface HistoryPingsListProps {
    isLoading?: boolean;
}

const HistoryPingsList = ({ isLoading = false }: HistoryPingsListProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        );
    }

    if (MOCK_PINGS.length === 0) {
        return (
            <EmptyState
                title="No pings yet"
                description="You haven't posted any pings. Share a problem with your community!"
            />
        );
    }

    return (
        <div className="flex flex-col gap-[15px]">
            {MOCK_PINGS.map((ping) => (
                <UnifiedPingCard
                    key={ping.id}
                    ping={ping}
                    waves={ping.waves}
                />
            ))}
            {/* TODO: API — load more / pagination when /api/users/me/pings is integrated */}
        </div>
    );
};

export default HistoryPingsList;
