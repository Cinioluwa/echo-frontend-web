/**
 * Admin Ping Detail Types
 */

export interface Author {
  name: string;
  avatar: string;
  timestamp: string;
}

export interface StatusEvent {
  status: string;
  timestamp: string;
  description?: string;
}

export interface PingComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  replies: number;
}

export interface RelatedPing {
  id: string;
  category: string;
  title: string;
  waveCount: number;
}

export interface PingDetailPermissions {
    canRespond: boolean;
    canAcknowledge: boolean;
    canModerateWaves: boolean;
    canUpdateWaveProgress: boolean;
    canUrgeResolve: boolean;
    canAssign?: boolean;
}

export type WaveActionStatus = "APPROVED" | "REJECTED" | "UNDER_REVIEW" | "IN_PROGRESS" | "COMPLETED";
