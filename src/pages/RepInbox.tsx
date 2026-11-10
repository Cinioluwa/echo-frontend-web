import { useCallback, useEffect, useMemo, useState } from "react";
import representativeService from "../api/services/representative.service";
import UnifiedPingCard from "../components/UnifiedFeed/UnifiedPingCard";
import type { Ping } from "../api/types";
import { useAuthStore } from "../stores";

interface FilterTab {
  id: string;
  label: string;
  count: number;
}

const RepInbox = () => {
  const user = useAuthStore((state) => state.user);
  const [pings, setPings] = useState<Ping[]>([]);
  const [activeTab, setActiveTab] = useState<string>("ALL");
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

  // Build filter tabs dynamically from known memberships and loaded pings
  const filterTabs = useMemo<FilterTab[]>(() => {
    const bodiesMap = new Map<number, string>();

    // 1. From user's representative profile (if rep)
    if (user?.representativeProfile?.bodyId) {
      bodiesMap.set(
        user.representativeProfile.bodyId,
        user.representativeProfile.body?.name || "My Council",
      );
    }

    // 2. From user's enrolled memberships
    if (Array.isArray(user?.bodyMemberships)) {
      for (const m of user.bodyMemberships) {
        if (m.bodyId && m.body?.name) {
          bodiesMap.set(m.bodyId, m.body.name);
        }
      }
    }

    // 3. From loaded pings (assignedToBody or visibilityBody)
    for (const p of pings) {
      if (p.visibilityBodyId && p.visibilityBody?.name) {
        bodiesMap.set(p.visibilityBodyId, p.visibilityBody.name);
      }
      if (p.assignedToBodyId && p.assignedToBody?.name) {
        bodiesMap.set(p.assignedToBodyId, p.assignedToBody.name);
      }
    }

    const tabs: FilterTab[] = [
      { id: "ALL", label: "All", count: pings.length },
    ];

    bodiesMap.forEach((name, id) => {
      const count = pings.filter(
        (p) => p.visibilityBodyId === id || p.assignedToBodyId === id,
      ).length;
      tabs.push({ id: `BODY_${id}`, label: name, count });
    });

    const directCount = pings.filter(
      (p) =>
        p.assignedToUserId === user?.id &&
        !p.assignedToBodyId &&
        !p.visibilityBodyId,
    ).length;
    if (directCount > 0) {
      tabs.push({ id: "DIRECT", label: "Direct", count: directCount });
    }

    return tabs;
  }, [pings, user]);

  const filteredPings = useMemo(() => {
    if (activeTab === "ALL") return pings;
    if (activeTab === "DIRECT") {
      return pings.filter(
        (p) =>
          p.assignedToUserId === user?.id &&
          !p.assignedToBodyId &&
          !p.visibilityBodyId,
      );
    }
    const bodyId = Number(activeTab.replace("BODY_", ""));
    return pings.filter(
      (p) => p.visibilityBodyId === bodyId || p.assignedToBodyId === bodyId,
    );
  }, [pings, activeTab, user?.id]);

  const activeTabLabel = filterTabs.find((t) => t.id === activeTab)?.label ?? "this group";

  return (
    <div className="flex flex-col gap-[15px] pb-10 w-full max-w-[720px] mx-auto">
      <div>
        <h1 className="font-['Poppins',sans-serif] text-[24px] font-semibold text-black">Inbox</h1>
        <p className="font-poppins text-xs text-[#8b8e8d] mt-0.5">
          Direct updates, polls, and discussions from your representative bodies and assignments.
        </p>
      </div>

      {/* Group Filter Tabs (Echo Pill Styling) */}
      {filterTabs.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-['Poppins',sans-serif] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#F49B31] text-white shadow-sm border border-[#F49B31]"
                    : "bg-[#FEF5EA] text-[#75420B] hover:bg-[#FDEBD2] border border-[#ffd7a8]/60"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold tabular-nums ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-[#F49B31]/15 text-[#75420B]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-white p-5 text-sm text-red-800 font-poppins">
          {error}
        </div>
      )}

      {loading && pings.length === 0 ? (
        <div className="py-16 text-center text-sm text-[#4A504E] font-poppins">Loading…</div>
      ) : !error && pings.length === 0 ? (
        <div className="py-16 text-center text-sm font-poppins text-[#4A504E]">
          <p className="font-semibold text-base text-[#212121]">No pings in your inbox</p>
          <p className="text-xs text-[#8b8e8d] mt-1 max-w-[340px] mx-auto">
            When representative bodies (like TEDxCU or student councils) post private updates, polls, or issues directed to you, they will appear here.
          </p>
        </div>
      ) : filteredPings.length === 0 ? (
        <div className="py-16 text-center text-sm font-poppins text-[#4A504E]">
          <p className="font-semibold text-base text-[#212121]">No pings for {activeTabLabel}</p>
          <p className="text-xs text-[#8b8e8d] mt-1 max-w-[340px] mx-auto">
            There are no updates or discussions for this group in your inbox yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[15px] w-full">
          {filteredPings.map((ping) => (
            <UnifiedPingCard
              key={ping.id}
              ping={ping}
              wavePreviewMode="embedded-only"
              detailBasePath="/inbox"
            />
          ))}
          {hasNextPage && activeTab === "ALL" && (
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
