/**
 * Admin-specific Type Definitions
 * Extended types for admin dashboard functionality
 */

// ==================== Platform Stats ====================

export interface PlatformStats {
  totalUsers: number;
  totalPings: number;
  totalSurges: number;
  totalWaves: number;
  totalComments: number;
}

// ==================== Admin Ping ====================

export interface AdminPing {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  status:
    | "POSTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "ON_HOLD";
  progressStatus?: "NONE" | "IN_PROGRESS" | "ACKNOWLEDGED" | "RESOLVED";
  isAnonymous: boolean;
  surgeCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
  category: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  comments?: any[];
  surges?: any[];
  _count: {
    waves: number;
    comments?: number;
    surges?: number;
  };
}

// ==================== Admin Wave ====================

export interface AdminWave {
  id: number;
  solution: string;
  status:
    | "POSTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "ON_HOLD";
  surgeCount: number;
  viewCount: number;
  flaggedForReview: boolean;
  createdAt: string;
  author: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  ping: {
    id: number;
    title: string;
    progressStatus: string;
    createdAt: string;
  };
  _count: {
    surges: number;
    comments: number;
  };
}

// ==================== Pagination ====================

export interface PaginationMeta {
  totalPings?: number;
  totalWaves?: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ==================== Analytics ====================

export interface ActiveUsersAnalytics {
  weeks: number;
  offsetWeeks: number;
  start: string;
  end: string;
  activeUsers: number;
}

export interface TrendingCategory {
  categoryId: number;
  categoryName: string;
  currentCount: number;
  previousCount: number;
  delta: number;
  percentChange: number;
  isNew: boolean;
}

export interface TrendingAnalytics {
  window: {
    weeks: number;
    offsetWeeks: number;
    start: string;
    end: string;
  };
  comparisonWindow: {
    start: string;
    end: string;
  };
  data: TrendingCategory[];
}

export interface CategoryStats {
  name: string;
  count: number;
}

// ==================== Announcement ====================

export interface Announcement {
  id: number;
  title: string;
  content: string;
  authorId: number;
  organizationId: number;
  createdAt: string;
  updatedAt?: string;
  author: {
    firstName: string;
    lastName: string;
  };
  categories?: Array<{
    id: number;
    name: string;
  }>;
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
}

// ==================== Request/Response DTOs ====================

export interface UpdateWaveStatusDto {
  status:
    | "POSTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "ON_HOLD";
}

export interface UpdatePingProgressDto {
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "WONT_FIX";
}
