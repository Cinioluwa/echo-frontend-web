import { useCallback, useEffect, useState } from "react";
import representativeService from "../api/services/representative.service";
import UnifiedPingCard from "../components/UnifiedFeed/UnifiedPingCard";
import type { Ping } from "../api/types";

const RepInbox = () => {
  const [pings, setPings] = useState<Ping[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (nextPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await representativeService.getAssignedPings({ page: nextPage, limit: 20 });
      setPings((cur) => (nextPage === 1 ? res.data : [...cur, ...res.data]));
      setPage(nextPage);
      setHasNextPage(res.pagination.hasNextPage);
    } catch (err) {
      console.error("Failed to load inbox:", err);
      setError("We couldn't load your inbox. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(1);
  }, [load]);

  return (
    <div className="flex flex-col gap-[15px] pb-10 w-full max-w-[720px] mx-auto">
      <h1 className="font-['Poppins',sans-serif] text-[24px] font-semibold text-black">Inbox</h1>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-white p-5 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading && pings.length === 0 ? (
        <div className="py-16 text-center text-sm text-[#4A504E]">Loading…</div>
      ) : !error && pings.length === 0 ? (
        <div className="py-16 text-center text-sm text-[#4A504E]">
          No pings have been assigned to you yet.
        </div>
      ) : (
        <div className="flex flex-col gap-[15px] w-full">
          {pings.map((ping) => (
            <UnifiedPingCard
              key={ping.id}
              ping={ping}
              wavePreviewMode="embedded-only"
              detailBasePath="/inbox"
            />
          ))}
          {hasNextPage && (
            <button
              onClick={() => void load(page + 1)}
              disabled={loading}
              className="mx-auto mt-2 px-6 py-2 bg-[#FEF5EA] border border-[#F49B31] rounded-[15px] text-[#F49B31] font-semibold text-[14px] hover:bg-[#FAE9D4] transition-colors disabled:opacity-50"
            >
              {loading ? "Loading…" : "Load more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RepInbox;
