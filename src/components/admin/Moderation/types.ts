/**
 * Moderation Types
 */

export type ViolationType =
  | "inappropriate-content"
  | "misinformation"
  | "threats"
  | string;
export type ContentType = "comment" | "wave" | "ping";

export interface Author {
  name: string;
  avatar: string;
  timestamp: string;
}

export interface ModerationItem {
  id: string;
  type: ContentType;
  subject: string; // "The wifi is too slow in library"
  category: string; // "General"
  author: Author;
  content: string; // Full content of comment/wave
  violationType: ViolationType;
  reportCount: number;
  image?: string; // Optional image content
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
}

export type FilterType = "all" | "pending" | "resolved" | "dismissed" | "active-suspensions";
