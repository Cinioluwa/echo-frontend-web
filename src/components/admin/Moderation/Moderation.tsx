import React, { useState, useEffect, useCallback } from "react";
import ModerationCard from "./ModerationCard";
import ModerationList from "./ModerationList";
import AdminHeader from "../AdminHeader";
import { ToastContainer, type ToastItem } from "../../shared/Toast";
import type { ModerationItem as ModerationItemType, FilterType, ModerationActionPayload } from "./types";
import { useUIStore } from "../../../stores";
import { adminService } from "../../../api/services/admin.service";
import type { ReportItem } from "../../../api/types/admin.types";

const Moderation: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { isSidebarCollapsed } = useUIStore();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<{ pendingReview: number; resolvedThisWeek: number; activeSuspensions: number } | null>(null);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchReports = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      setError(null);
      const status = activeFilter === "pending" ? "PENDING"
        : activeFilter === "resolved" ? "RESOLVED"
        : activeFilter === "dismissed" ? "DISMISSED"
          : undefined;
      const [result, analyticsData] = await Promise.all([
        adminService.getReports({ status }),
        adminService.getReportsAnalytics().catch(() => null),
      ]);
      setReports(result.data);
      if (analyticsData) {
        setAnalytics({ pendingReview: analyticsData.pendingReview, resolvedThisWeek: analyticsData.resolvedThisWeek, activeSuspensions: analyticsData.activeSuspensions });
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const mapReportToModerationItem = (report: ReportItem): ModerationItemType => {
    const targetType = report.ping ? "ping" : report.wave ? "wave" : "comment";
    const targetContent = report.ping?.content || report.wave?.solution || report.comment?.content || "";
    const targetTitle = report.ping?.title || report.wave?.ping?.title || "";
    const categoryName = report.ping?.category?.name || report.wave?.ping?.category?.name || " ";
    return {
      id: report.id.toString(),
      type: targetType as "comment" | "wave" | "ping",
      subject: targetTitle || "Flagged content",
      category: categoryName,
      author: {
        name: `${report.reporter.firstName} ${report.reporter.lastName}`,
        avatar: report.reporter.profilePicture || `https://ui-avatars.com/api/?name=${report.reporter.firstName}+${report.reporter.lastName}&background=random`,
        timestamp: new Date(report.createdAt).toLocaleDateString(),
      },
      content: targetContent,
      violationType: report.reason || "inappropriate-content",
      reportCount: report.reportCount,
      status: report.status,
    };
  };

  const moderationItems: ModerationItemType[] = reports.map(mapReportToModerationItem);

  const handleTakeAction = async (id: string, actionPayload: ModerationActionPayload) => {
    try {
      setActionLoading(parseInt(id));
      const report = reports.find((r) => r.id.toString() === id);
      if (!report) return;

      const { deletePost, ...actionDto } = actionPayload;

      await adminService.applyReportAction(parseInt(id), actionDto);

      if (deletePost) {
        // Assume calling another endpoint or it's handled by the backend if we augment the API
        // But for now, we just pass the action payload.
        console.log("Delete post requested for report ID:", id);
      }

      await fetchReports(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to take action");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      setActionLoading(parseInt(id));
      await adminService.updateReportStatus(parseInt(id), { status: "DISMISSED" });
      await fetchReports(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to dismiss");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FCFCFC] relative" data-node-id="moderation-page">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
      <div className={`m-0 min-w-0 ${isSidebarCollapsed ? "md:ms-[80px]" : "md:ms-[230px]"} flex flex-col gap-4 sm:gap-6 items-start px-3 sm:px-6 py-6 sm:py-8 relative transition-all duration-300`}>
        <div className="flex flex-col gap-1 sm:gap-2 items-start relative w-full">
          <h1 className="hidden md:block font-poppins font-bold text-[24px] sm:text-[32px] leading-normal text-black">
            Moderation
          </h1>
          <AdminHeader title="Moderation" />
          <p className="font-poppins font-medium text-[13px] sm:text-[16px] leading-normal text-[#8b8e8d]">
            Flagged posts from your community awaiting your review
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full">
          <ModerationCard
            label="Pending Review"
            count={analytics?.pendingReview ?? reports.filter((r) => r.status === "PENDING").length}
            subtitle="Needs your attention"
          />
          <ModerationCard
            label="Resolved this week"
            count={analytics?.resolvedThisWeek ?? reports.filter((r) => r.status === "RESOLVED" || r.status === "DISMISSED").length}
            subtitle="Dismissed or actioned"
          />
          <ModerationCard
            label="Active Suspensions"
            count={analytics?.activeSuspensions ?? 0}
            subtitle="Aliases suspended"
          />
        </div>

        <div className="flex w-full max-w-full items-center justify-end gap-2 self-end overflow-x-auto">
          {(["all", "pending", "resolved", "dismissed"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-lg font-poppins font-semibold text-[12px] transition-colors ${activeFilter === f
                ? "bg-[#f49b31] text-white"
                : "bg-white border border-[#f49b31] text-[#f49b31] hover:bg-[#fef5ea]"
                }`}
            >
              {f === "all" ? "All" : f === "pending" ? "Pending" : f === "resolved" ? "Resolved" : "Dismissed"}
            </button>
          ))}
        </div>

        {error && (
          <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[13px] font-poppins">
            {error}
          </div>
        )}

        <div className="w-full">
          <ModerationList
            items={moderationItems}
            isLoading={loading}
            onTakeAction={handleTakeAction}
            onDismiss={handleDismiss}
            actionLoading={actionLoading !== null}
          />
        </div>
      </div>
    </div>
  );
};

export default Moderation;