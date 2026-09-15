import type { FigmaBadgeName } from "./FigmaBadge";

export const badgeConfig: Record<FigmaBadgeName, { dot: string; className: string }> = {
  Open: { dot: "ping-open-dot.svg", className: "bg-white text-black" },
  "Top 3": { dot: "ping-top3-dot.svg", className: "bg-white text-black" },
  Acknowledged: { dot: "ping-acknowledged-dot.svg", className: "bg-white text-black" },
  Resolved: { dot: "ping-resolved-dot.svg", className: "bg-white text-black" },
  "Community Pick": { dot: "wave-community-dot.svg", className: "bg-white text-black" },
  Proposed: { dot: "wave-proposed-dot.svg", className: "bg-white text-black" },
  "Under Review": { dot: "wave-review-dot.svg", className: "bg-white text-black" },
  Approved: { dot: "wave-approved-dot.svg", className: "bg-white text-black" },
  "In Progress": { dot: "wave-progress-dot.svg", className: "bg-white text-black" },
  Rejected: { dot: "wave-rejected-dot.svg", className: "bg-white text-black" },
  Implementing: { dot: "wave-implementing-dot.svg", className: "bg-white text-black" },
  Completed: { dot: "wave-completed-dot.svg", className: "bg-[#F49B31] text-white border-[#F49B31]" },
  Alternative: { dot: "wave-approved-dot.svg", className: "bg-white text-black" },
};

export const getPingBadgeName = (progressStatus?: string | null, status?: string | null): FigmaBadgeName => {
  const value = progressStatus || status;
  if (value === "RESOLVED" || value === "COMPLETED") return "Resolved";
  if (value === "ACKNOWLEDGED") return "Acknowledged";
  return "Open";
};

export const getWaveBadgeName = (status: string): FigmaBadgeName => {
  switch (status) {
    case "UNDER_REVIEW": return "Under Review";
    case "APPROVED": return "Approved";
    case "IN_PROGRESS": return "In Progress";
    case "REJECTED": return "Rejected";
    case "COMPLETED": return "Completed";
    case "POSTED": return "Proposed";
    default: return "Implementing";
  }
};
