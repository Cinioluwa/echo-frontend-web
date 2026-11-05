/**
 * HistorySurgedList
 * Figma ref: 4th frame in S5 (desktop: 4183:17017), 4th frame in S6 (mobile: 4183:17018)
 * Phase: 4
 *
 * Content for the "Surged" tab on the History page.
 * Shows pings/waves the user has surged (upvoted) — uses the same
 * compact card format as the Pings tab.
 */

import { useState, useEffect } from "react";
import type { Ping } from "../../api/types";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";
import UnifiedPingCard from "../UnifiedFeed/UnifiedPingCard";
import { userService } from "../../api/services";

// The API embeds a partial ping object on each surge item
interface SurgeItemFromAPI {
    id: string | number;
    createdAt: string;
    ping?: Ping;
}

interface HistorySurgedListProps {
    isLoading?: boolean;
}

const HistorySurgedList = ({ isLoading: parentIsLoading = false }: HistorySurgedListProps) => {
    const [pings, setPings] = useState<Ping[]>([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        userService
            .getMySurges({ page: 1, limit: 20 })
            .then((res) => {
                const items = res.data as unknown as SurgeItemFromAPI[];
                setPings(items.map((s) => s.ping).filter((p): p is Ping => !!p));
                setHasNextPage(res.pagination.hasNextPage);
            })
            .catch(() => setError("Failed to load your surged pings"))
            .finally(() => setIsLoading(false));
    }, []);

    const loadMore = async () => {
        const nextPage = page + 1;
        try {
            const res = await userService.getMySurges({ page: nextPage, limit: 20 });
            const items = res.data as unknown as SurgeItemFromAPI[];
            setPings((prev) => [...prev, ...items.map((s) => s.ping).filter((p): p is Ping => !!p)]);
            setPage(nextPage);
            setHasNextPage(res.pagination.hasNextPage);
        } catch (err) {
            console.error("Failed to load more surged pings:", err);
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
                title="Nothing surged yet"
                description="Pings and waves you surge will appear here."
            />
        );
    }

    const handleDeletePing = (deletedId: number) => {
        setPings((prev) => prev.filter((p) => p.id !== deletedId));
    };

    return (
        <div className="flex flex-col gap-[15px]">
            {pings.map((ping) => (
                <UnifiedPingCard key={ping.id} ping={ping} onDelete={handleDeletePing} />
            ))}
            {hasNextPage && (
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

export default HistorySurgedList;
