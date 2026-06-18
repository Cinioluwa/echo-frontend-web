/**
 * FollowUp types and interfaces
 */

export type FollowUpStatus =
  | "rejected"
  | "completed"
  | "in_progress"
  | "approved"
  | "under_review"
  | "posted"
  | "acknowledged"
  | "resolved";
export type FilterType =
  | "all"
  | "approved-waves"
  | "under-review"
  | "acknowledged-pings"
  | "in-progress";

export interface FollowUpItem {
  id: string;
  title: string;
  category: string;
  categoryIcon?: string;
  author: {
    name: string;
    avatar: string;
    timestamp: string;
  };
  description: string;
  status: FollowUpStatus;
  waveCount: number;
  pingAuthor?: {
    name: string;
    avatar: string;
    timestamp: string;
  };
  surgeCount?: number;
  actions: {
    primary?: {
      label: string;
      onClick: () => void;
      variant?: "orange" | "outline-orange" | "red";
    };
    secondary?: {
      label: string;
      onClick: () => void;
      variant?: "orange" | "outline-orange" | "red";
    };
    tertiary?: {
      label: string;
      onClick: () => void;
      variant?: "orange" | "outline-orange" | "red";
    };
  };
}

export interface FilterTab {
  id: FilterType;
  label: string;
  icon: React.ReactNode;
  count: number;
  isActive: boolean;
}
