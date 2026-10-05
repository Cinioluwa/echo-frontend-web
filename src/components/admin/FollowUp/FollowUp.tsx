import React, { useState, useEffect, useCallback } from "react";
import FollowUpFilterTabs from "./FollowUpFilterTabs";
import FollowUpList from "./FollowUpList";
import AdminHeader from "../AdminHeader";
import { ToastContainer, type ToastItem } from "../../shared/Toast";
import type { FollowUpItem as FollowUpItemType, FilterType } from "./types";
import { adminService } from "../../../api/services/admin.service";
import type { AdminWave } from "../../../api/types/admin.types";
import { useUIStore, useAuthStore } from "../../../stores";
import representativeService from "../../../api/services/representative.service";
import formatTimeAgo from "../../../utils/formatTimeAgo";

interface FollowUpProps {
  mode?: "admin" | "rep";
}

const FollowUp: React.FC<FollowUpProps> = ({ mode = "admin" }) => {
  const isRep = mode === "rep";
  const repProfile = useAuthStore((s) => s.user?.representativeProfile);
  const canModerate = !isRep || !!repProfile?.canModerateWaves;
  const canProgress = !isRep || !!repProfile?.canUpdateWaveProgress;
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allWaves, setAllWaves] = useState<AdminWave[]>([]);
  const [, setActionLoading] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { isSidebarCollapsed } = useUIStore();
  
  const [rejectModalWaveId, setRejectModalWaveId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const pushToast = (variant: ToastItem["variant"]) => {
    const id = `${Date.now()}`;
    setToasts((prev) => [...prev, { id, variant }]);
  };

  const fetchWaves = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      setError(null);
      if (isRep) {
        setAllWaves((await representativeService.getAssignedWaves({ limit: 100 })) as AdminWave[]);
      } else {
        const result = await adminService.getWaves({ limit: 100 });
        setAllWaves(result.data);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to load follow-ups");
    } finally {
      setLoading(false);
    }
  }, [isRep]);

  useEffect(() => {
    fetchWaves();
  }, [fetchWaves]);

  const avatarFor = (first?: string, last?: string) =>
    `https://ui-avatars.com/api/?name=${first || "A"}+${last || "U"}&background=random`;

  const buildItems = (waves: AdminWave[]) => {
    const waveItems: FollowUpItemType[] = [];
    const ackItems: FollowUpItemType[] = [];
    const ackPings = new Map<number, AdminWave[]>();

    waves.forEach((w) => {
      if (w.ping?.progressStatus === "ACKNOWLEDGED") {
        ackPings.set(w.ping.id, [...(ackPings.get(w.ping.id) || []), w]);
      }
      if (w.status === "APPROVED" || w.status === "UNDER_REVIEW" || w.status === "IN_PROGRESS") {
        waveItems.push(mapWaveToItem(w));
      }
    });

    ackPings.forEach((pingWaves) => {
      const pick = pingWaves
        .filter((w) => w.status === "POSTED" || w.status === "UNDER_REVIEW")
        .sort((a, b) => (b._count?.surges ?? b.surgeCount) - (a._count?.surges ?? a.surgeCount))[0];
      if (pick) ackItems.push(mapAcknowledgedToItem(pick));
    });

    return { waveItems, ackItems };
  };

  const waveBase = (wave: AdminWave) => ({
    pingId: wave.ping?.id,
    href: wave.ping?.id ? (isRep ? `/inbox/${wave.ping.id}` : `/admin/soundboard/${wave.ping.id}`) : undefined,
    title: wave.ping?.title || wave.solution,
    category: wave.ping?.category?.name || "",
    author: {
      name: wave.author ? `${wave.author.firstName} ${wave.author.lastName}` : "Anonymous",
      avatar: avatarFor(wave.author?.firstName, wave.author?.lastName),
      timestamp: formatTimeAgo(wave.createdAt),
    },
    description: wave.solution,
    waveCount: wave._count?.surges || 0,
  });

  const mapAcknowledgedToItem = (wave: AdminWave): FollowUpItemType => {
    const ping = wave.ping;
    const pingAuthorName = ping.isAnonymous
      ? ping.anonymousAlias || "Anonymous"
      : ping.author
        ? `${ping.author.firstName} ${ping.author.lastName}`
        : "Anonymous";
    return {
      ...waveBase(wave),
      id: `ping-${ping.id}`,
      status: "acknowledged",
      pingAuthor: {
        name: pingAuthorName,
        avatar: avatarFor(ping.author?.firstName, ping.author?.lastName),
        timestamp: formatTimeAgo(ping.createdAt),
      },
      surgeCount: ping.surgeCount ?? 0,
      actions: canModerate
        ? {
            primary: { label: "Approve", onClick: () => handleUpdateWaveStatus(wave.id, "APPROVED"), variant: "orange" },
            secondary: {
              label: "Reject",
              onClick: () => {
                setRejectModalWaveId(wave.id);
                setRejectReason("");
              },
              variant: "red",
            },
            ...(wave.status !== "UNDER_REVIEW"
              ? { tertiary: { label: "Review", onClick: () => handleUpdateWaveStatus(wave.id, "UNDER_REVIEW"), variant: "outline-orange" as const } }
              : {}),
          }
        : {},
    };
  };

  const mapWaveToItem = (wave: AdminWave): FollowUpItemType => {
    const isApproved = wave.status === "APPROVED";
    const isUnderReview = wave.status === "UNDER_REVIEW";
    const isInProgress = wave.status === "IN_PROGRESS";

    return {
      ...waveBase(wave),
      id: wave.id.toString(),
      status: isApproved ? "approved" : isUnderReview ? "under_review" : "in_progress",
      actions: {
        ...(isApproved && canProgress ? {
          primary: { label: "Mark as Completed", onClick: () => handleUpdateWaveStatus(wave.id, "COMPLETED"), variant: "orange" as const },
          secondary: { label: "Mark as Implementing", onClick: () => handleUpdateWaveStatus(wave.id, "IN_PROGRESS"), variant: "outline-orange" as const },
        } : {}),
        ...(isUnderReview && canModerate ? {
          primary: { label: "Approve", onClick: () => handleUpdateWaveStatus(wave.id, "APPROVED"), variant: "orange" as const },
          secondary: {
            label: "Reject",
            onClick: () => {
              setRejectModalWaveId(wave.id);
              setRejectReason("");
            },
            variant: "red" as const,
          },
        } : {}),
        ...(isInProgress && canProgress ? {
          primary: { label: "Mark as Completed", onClick: () => handleUpdateWaveStatus(wave.id, "COMPLETED"), variant: "orange" as const },
        } : {}),
      },
    };
  };

  const { waveItems, ackItems } = buildItems(allWaves);
  const byStatus = (s: string) => waveItems.filter((i) => i.status === s);
  const filterCounts = {
    all: ackItems.length + waveItems.length,
    "approved-waves": byStatus("approved").length,
    "under-review": byStatus("under_review").length,
    "acknowledged-pings": ackItems.length,
    "in-progress": byStatus("in_progress").length,
  };
  const items: FollowUpItemType[] =
    activeFilter === "approved-waves" ? byStatus("approved")
    : activeFilter === "under-review" ? byStatus("under_review")
    : activeFilter === "in-progress" ? byStatus("in_progress")
    : activeFilter === "acknowledged-pings" ? ackItems
    : [...ackItems, ...waveItems];
  const handleUpdateWaveStatus = async (id: number, status: string, reason?: string) => {
    try {
      setActionLoading(id.toString());
      await adminService.updateWaveStatus(id, { 
        status: status as any,
        ...(reason ? { reason } : {})
      });
      
      if (status === "APPROVED" || status === "COMPLETED") pushToast("wave");
      if (status === "REJECTED") pushToast("deleted");
      
      await fetchWaves(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || "Failed to update wave status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  return (
    <>
      <div className={`m-0 min-w-0 ${isRep ? "" : isSidebarCollapsed ? "min-[1131px]:ms-[102px]" : "min-[1131px]:ms-[230px]"} flex flex-col gap-4 sm:gap-6 items-start px-3 sm:px-6 py-6 sm:py-8 relative transition-all duration-300`}>
        <div className="flex flex-col gap-1 sm:gap-2 items-start relative w-full">
          <h1 className={`${isRep ? "block" : "hidden min-[1131px]:block"} font-poppins font-bold text-[24px] sm:text-[32px] leading-normal text-black`}>
            Follow Up
          </h1>
          {!isRep && <AdminHeader title="Follow Up" />}
          <p className="font-poppins font-medium text-[13px] sm:text-[16px] leading-normal text-[#8b8e8d]">
            Tasks that need your attention to keep the community moving forward
          </p>
        </div>

        {error && (
          <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[13px] font-poppins">
            {error}
          </div>
        )}

        <div className="w-full">
          <FollowUpFilterTabs
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            counts={filterCounts}
          />
        </div>

        <div className="w-full">
          <FollowUpList items={items} isLoading={loading} />
        </div>
      </div>
      {/* Reject Modal */}
      {rejectModalWaveId !== null && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 flex flex-col gap-4 shadow-xl">
            <h2 className="text-xl font-bold font-poppins text-black">Reject Wave</h2>
            <p className="text-sm font-inter text-gray-600">Please provide a reason for rejecting this wave. The author will be notified.</p>
            <textarea
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none outline-none focus:border-[#f49b31]"
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                className="px-4 py-2 font-poppins font-medium text-gray-600 hover:text-black"
                onClick={() => setRejectModalWaveId(null)}
                disabled={rejecting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 font-poppins font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                disabled={!rejectReason.trim() || rejecting}
                onClick={async () => {
                  setRejecting(true);
                  await handleUpdateWaveStatus(rejectModalWaveId, "REJECTED", rejectReason);
                  setRejecting(false);
                  setRejectModalWaveId(null);
                }}
              >
                {rejecting ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
        <ToastContainer
          toasts={toasts}
          onDismiss={(id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        />
      </div>
    </>
  );
};

export default FollowUp;
