import React from "react";
import { badgeConfig } from "./figmaBadgeUtils";

type BadgeKind = "ping" | "wave";
export type FigmaBadgeName =
  | "Open"
  | "Top 3"
  | "Acknowledged"
  | "Resolved"
  | "Community Pick"
  | "Proposed"
  | "Under Review"
  | "Approved"
  | "In Progress"
  | "Rejected"
  | "Implementing"
  | "Completed"
  | "Alternative";

interface FigmaBadgeProps {
  label: FigmaBadgeName;
  kind?: BadgeKind;
  className?: string;
}


const FigmaBadge: React.FC<FigmaBadgeProps> = ({ label, className = "" }) => {
  const config = badgeConfig[label];
  return (
    <span className={`inline-flex items-center justify-center gap-1.5 border border-[#626665] rounded-[23px] px-[11px] py-1 text-[9px] font-medium leading-none whitespace-nowrap ${config.className} ${className}`}>
      <img src={`/assets/figma/admin/${config.dot}`} alt="" className="w-[5px] h-[5px] shrink-0" />
      {label}
    </span>
  );
};

export default FigmaBadge;
