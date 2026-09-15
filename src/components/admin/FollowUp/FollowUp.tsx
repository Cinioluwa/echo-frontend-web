import React, { useState, useEffect, useCallback } from "react";
import FollowUpFilterTabs from "./FollowUpFilterTabs";
import FollowUpList from "./FollowUpList";
import AdminHeader from "../AdminHeader";
import AdminMobileMenu from "../AdminMobileMenu";
import type { FollowUpItem as FollowUpItemType, FilterType } from "./types";
import { adminService } from "../../../api/services/admin.service";
import type { AdminWave, UpdateWaveStatusDto } from "../../../api/types/admin.types";

type FollowUpProps = Record<string, never>;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const response = (error as { response?: { data?: { error?: string } } }).response;
    if (response?.data?.error) return response.data.error;
  }
  return fallback;
};

const FollowUp: React.FC<FollowUpProps> = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [allWaves, setAllWaves] = useState<AdminWave[]>([]);
  const [, setActionLoading] = useState<string | null>(null);

  const fetchWaves = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await adminService.getWaves({ limit: 100 });
      setAllWaves(result.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load follow-ups"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWaves();
  }, [fetchWaves]);

  const filterWaves = useCallback((waves: AdminWave[], filter: FilterType): AdminWave[] => {
    switch (filter) {
      case "approved-waves":
        return waves.filter((w) => w.status === "APPROVED");
      case "under-review":
        return waves.filter((w) => w.status === "UNDER_REVIEW");
      case "in-progress":
        return waves.filter((w) => w.status === "IN_PROGRESS");
      case "acknowledged-pings":
        return waves.filter((w) => w.ping.progressStatus === "ACKNOWLEDGED");
      default:
        return waves;
    }
  }, []);

  const computeCounts = useCallback((waves: AdminWave[]) => {
    const approved = waves.filter((w) => w.status === "APPROVED").length;
    const underReview = waves.filter((w) => w.status === "UNDER_REVIEW").length;
    const inProgress = waves.filter((w) => w.status === "IN_PROGRESS").length;
    const acknowledgedPings = waves.filter((w) => w.ping.progressStatus === "ACKNOWLEDGED").length;
    return {
      all: approved + underReview + inProgress + acknowledgedPings,
      "approved-waves": approved,
      "under-review": underReview,
      "in-progress": inProgress,
      "acknowledged-pings": acknowledgedPings,
    };
  }, []);

  const mapWaveToItem = (wave: AdminWave, filter: FilterType): FollowUpItemType => {
    const isAcknowledged = filter === "acknowledged-pings" && wave.ping.progressStatus === "ACKNOWLEDGED";
    const waveStatus = wave.status;
    const isApproved = waveStatus === "APPROVED";
    const isUnderReview = waveStatus === "UNDER_REVIEW";
    const isInProgress = waveStatus === "IN_PROGRESS";

    return {
      id: wave.id.toString(),
      pingId: wave.ping.id,
      title: wave.ping?.title || wave.solution,
      category: wave.ping?.category?.name || "",
      author: {
        name: wave.author ? `${wave.author.firstName} ${wave.author.lastName}` : "Anonymous",
        avatar: `https://ui-avatars.com/api/?name=${wave.author?.firstName || "A"}+${wave.author?.lastName || "U"}&background=random`,
        timestamp: new Date(wave.createdAt).toLocaleDateString(),
      },
      description: wave.solution,
      status: isAcknowledged ? "acknowledged" : isApproved ? "approved" : isUnderReview ? "under_review" : isInProgress ? "in_progress" : "posted",
      waveCount: wave._count?.surges || 0,
      ...(isAcknowledged ? {
        pingAuthor: {
          name: `${wave.author?.firstName || "A"} ${wave.author?.lastName || "U"}`,
          avatar: `https://ui-avatars.com/api/?name=${wave.author?.firstName || "A"}+${wave.author?.lastName || "U"}&background=random`,
          timestamp: new Date(wave.ping.createdAt).toLocaleDateString(),
        },
        surgeCount: wave.surgeCount,
      } : {}),
      actions: {
        ...(isApproved ? {
          primary: {
            label: "Mark as Completed",
            onClick: () => handleUpdateWaveStatus(wave.id, "COMPLETED"),
            variant: "orange" as const,
          },
          secondary: {
            label: "Mark as Implementing",
            onClick: () => handleUpdateWaveStatus(wave.id, "IN_PROGRESS"),
            variant: "outline-orange" as const,
          },
        } : {}),
        ...(isUnderReview ? {
          primary: {
            label: "Approve",
            onClick: () => handleUpdateWaveStatus(wave.id, "APPROVED"),
            variant: "orange" as const,
          },
          secondary: {
            label: "Reject",
            onClick: () => handleUpdateWaveStatus(wave.id, "REJECTED"),
            variant: "red" as const,
          },
        } : {}),
        ...(isInProgress ? {
          primary: {
            label: "Mark as Completed",
            onClick: () => handleUpdateWaveStatus(wave.id, "COMPLETED"),
            variant: "orange" as const,
          },
        } : {}),
        ...(isAcknowledged ? {
          primary: {
            label: "Mark Resolved",
            onClick: () => handleResolvePing(wave.ping.id),
            variant: "orange" as const,
          },
        } : {}),
      },
    };
  };

  const filteredWaves = filterWaves(allWaves, activeFilter);
  const items: FollowUpItemType[] = filteredWaves.map((w) => mapWaveToItem(w, activeFilter));
  const filterCounts = computeCounts(allWaves);

  const handleUpdateWaveStatus = async (id: number, status: UpdateWaveStatusDto["status"]) => {
    try {
      setActionLoading(id.toString());
      await adminService.updateWaveStatus(id, { status });
      await fetchWaves();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update wave status"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolvePing = async (pingId: number) => {
    try {
      setActionLoading(pingId.toString());
      await adminService.resolvePing(pingId);
      await fetchWaves();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to resolve ping"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  return (
    <>
      <div className="flex-1 min-w-0 flex flex-col gap-4 sm:gap-6 items-start px-3 sm:px-8 py-6 sm:py-8 relative w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-1 sm:gap-2 items-start relative w-full">
          <h1 className="hidden md:block font-poppins font-bold text-[24px] sm:text-[32px] leading-normal text-black">
            Follow Up
          </h1>
          <AdminHeader title="Follow Up" setOpenMenu={setOpenMenu} openMenu={openMenu} />
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
      <AdminMobileMenu setMenu={setOpenMenu} menu={openMenu} />
    </>
  );
};

export default FollowUp;
