/**
 * HistoryPingsList
 * Figma ref: 4183:14830 (desktop pings content), bottom of 4183:13137 (mobile)
 * Phase: 4
 *
 * Content for the "Pings" tab on the History page.
 * Reuses UnifiedPingCard to show the user's own posted pings.
 */

import { useState, useEffect } from "react";
import UnifiedPingCard from "../UnifiedFeed/UnifiedPingCard";
import type { Ping } from "../../api/types";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";
import { pingService } from "../../api/services";

interface HistoryPingsListProps {
    isLoading?: boolean;
}

const HistoryPingsList = ({ isLoading: parentIsLoading = false }: HistoryPingsListProps) => {
    const [pings, setPings] = useState<Ping[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        hasNextPage: false,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        pingService
            .getMyPings({ page: 1, limit: 20 })
            .then((res) => {
                setPings(res.data);
                setPagination({
                    page: res.pagination.currentPage,
                    totalPages: res.pagination.totalPages,
                    hasNextPage: res.pagination.hasNextPage,
                });
            })
            .catch(() => setError("Failed to load your pings"))
            .finally(() => setIsLoading(false));
    }, []);

    const loadMore = async () => {
        const nextPage = pagination.page + 1;
        try {
            const res = await pingService.getMyPings({ page: nextPage, limit: 20 });
            setPings((prev) => [...prev, ...res.data]);
            setPagination({
                page: res.pagination.currentPage,
                totalPages: res.pagination.totalPages,
                hasNextPage: res.pagination.hasNextPage,
            });
        } catch (err) {
            console.error("Failed to load more pings:", err);
        }
    };

    if (parentIsLoading || isLoading || error) {
        return (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        );
    }

    if (pings.length === 0) {
        return (
            <EmptyState
                title="No pings yet"
                description="You haven't posted any pings. Share a problem with your community!"
            />
        );
    }

    const handleDeletePing = (deletedId: number) => {
        setPings((prev) => prev.filter((p) => p.id !== deletedId));
    };

    return (
        <div className="flex flex-col gap-[15px]">
            {pings.map((ping) => (
                <UnifiedPingCard
                    key={ping.id}
                    ping={ping}
                    isHistoryContext
                    onDelete={handleDeletePing}
                />
            ))}
            {pagination.hasNextPage && (
                <button
                    onClick={loadMore}
                    className="mt-2 text-sm text-[#F49B31] font-medium self-center cursor-pointer"
                >
                    Load more
                </button>
            )}
        </div>
    );
};

export default HistoryPingsList;
