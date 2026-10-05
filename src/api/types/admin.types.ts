/**
 * Admin-specific Type Definitions
 * Extended types for admin dashboard functionality
 */

import type { Ping } from ".";

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
  officialResponse?: OfficialResponse;
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
    surgeCount?: number;
    createdAt: string;
    isAnonymous?: boolean;
    anonymousAlias?: string | null;
    author?: { id: number; firstName: string; lastName: string; profilePicture?: string | null } | null;
    category?: { id: number; name: string } | null;
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
  reason?: string;
}

export interface UpdatePingProgressDto {
  progressStatus:
    | "UNACKNOWLEDGED"
    | "ACKNOWLEDGED"
    | "IN_PROGRESS"
    | "RESOLVED";
}

// ==================== Report Types ====================

export interface ReportItem {
  id: number;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  reason: string | null;
  reporterId: number;
  pingId: number | null;
  waveId: number | null;
  commentId: number | null;
  createdAt: string;
  reporter: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string | null;
    profilePicture: string | null;
  };
  ping: {
    id: number;
    title: string;
    content: string;
    category: { id: number; name: string };
  } | null;
  wave: {
    id: number;
    solution: string;
    ping: { id: number; title: string; category: { id: number; name: string } };
  } | null;
  comment: {
    id: number;
    content: string;
    pingId: number;
    waveId: number;
  } | null;
  reportCount: number;
}

export interface ReportActionDto {
  action:
    | "DISMISS"
    | "WARN"
    | "REMOVE_POST"
    | "SUSPEND"
    | "BAN"
    | "REQUEST_IDENTITY_DISCLOSURE";
  note?: string;
  suspendPreset?: "1_DAY" | "1_WEEK" | "1_MONTH";
}

export interface ReportStatusDto {
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
}

// ==================== Overview Dashboard Types ====================

export interface OverviewResponse {
  period: {
    month: string;
    year: number;
    start: string;
    end: string;
  };
  summaryCards: {
    waves: { value: number; deltaPercent: number };
    pingsSubmitted: { value: number; deltaPercent: number };
    resolutionRate: { value: number; deltaPercentagePoints: number };
    avgResolveTimeDays: { value: number; deltaDays: number };
    activeUsers: { value: number; deltaPercent: number };
    underReview: { value: number; deltaPercent: number };
    unresolvedOlderThanDays: {
      thresholdDays: number;
      value: number;
      deltaAbsolute: number;
    };
  };
  communityActivity: {
    months: number;
    series: Array<{
      month: string;
      waves: number;
      pings: number;
      resolved: number;
    }>;
  };
  categoryHealth: Array<{
    categoryId: number;
    categoryName: string;
    resolutionRate: number;
    unresolvedCount: number;
    totalPings: number;
  }>;
  topPings: {
    windowDays: number;
    items: Array<{
      rank: number;
      pingId: number;
      title: string;
      author: { id: number; name: string } | null;
      engagementCount: number;
      engagementType: "surges";
    }>;
  };
  oldestUnresolved: {
    total: number;
    items: Array<{
      pingId: number;
      title: string;
      category: { id: number; name: string } | null;
      createdAt: string;
      ageDays: number;
    }>;
  };
  surgeVelocity: Array<{ pingId: number; velocity: number }>;
  stalledWavesCount: number;
  stalledAcknowledgedPingsCount: number;
  wavesAwaitingApproval: number;
  categoriesStats: Array<{
    categoryId: number;
    categoryName: string;
    totalPings: number;
    openCount: number;
    resolvedCount: number;
    openPercentage: number;
    resolutionPercentage: number;
  }>;
}

export interface SurgingIssue {
  pingId: number;
  title: string;
  category: { id: number; name: string } | null;
  currentRatePerHour: number;
  previousRatePerHour: number;
  rateDelta: number;
  currentSurges: number;
  previousSurges: number;
}

export interface TopContributor {
  rank: number;
  userId: number;
  name: string;
  pingsSubmitted: number;
  wavesCast: number;
  badge: string | null;
}

export interface CommunityMood {
  window: { days: number; start: string; end: string };
  totals: {
    comments: number;
    positive: number;
    neutral: number;
    negative: number;
  };
  percentages: { positive: number; neutral: number; negative: number };
  trend: Array<{
    date: string;
    positivePercent: number;
    neutralPercent: number;
    negativePercent: number;
    sampleSize: number;
  }>;
}

// ==================== Organization Settings Types ====================

export interface OrgSettings {
  organization: {
    id: number;
    name: string;
    domain: string | null;
    status: string;
    joinPolicy: "OPEN" | "REQUIRES_APPROVAL";
    isDomainLocked: boolean;
    effectiveJoinPolicy: string;
    joinPolicyLocked: boolean;
  };
}

export interface JoinRequest {
  id: number;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason?: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    status: string;
  };
  reviewedBy?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface JoinPolicyDto {
  joinPolicy: "OPEN" | "REQUIRES_APPROVAL";
}

// ==================== Org Settings Update ====================

export interface UpdateOrgSettingsDto {
  name?: string;
  description?: string;
  logoUrl?: string;
}

// ==================== Org Rules ====================

export interface OrgRules {
  allowMediaAttachments: boolean;
  sameTopicCooldownHours: number;
  autoFlagReportThreshold: number;
  hideFlaggedContentPending: boolean;
  minSurgesForWave: number;
}

export interface UpdateOrgRulesDto {
  allowMediaAttachments?: boolean;
  sameTopicCooldownHours?: number;
  autoFlagReportThreshold?: number;
  hideFlaggedContentPending?: boolean;
  minSurgesForWave?: number;
}

// ==================== Reports Analytics ====================

export interface ReportsAnalytics {
  pendingReview: number;
  resolvedThisWeek: number;
  activeSuspensions: number;
}

// ==================== Follow-Up Queue ====================

export interface FollowUpQueue {
  approvedWavesNotImplementing: number;
  wavesAwaitingApproval: number;
  acknowledgedPingsStalling: number;
  total: number;
}

// ==================== Issues by Category ====================

export interface IssueByCategory {
  categoryId: number;
  categoryName: string;
  openCount: number;
  resolvedCount: number;
  resolutionRate: number;
  topPings: Array<{
    id: number;
    title: string;
    surgeCount: number;
    createdAt: string;
  }>;
}

// ==================== Member Management ====================

export interface SuspendUserDto {
  duration: "1_DAY" | "1_WEEK" | "1_MONTH" | "PERMANENT";
  reason?: string;
}

export interface CategoryUpdateDto {
  name?: string;
  isActive?: boolean;
}

// ==================== Official Response Types ====================

export interface OfficialResponse {
  id: number;
  content: string;
  pingId: number;
  authorId: number;
  organizationId: number;
  isResolved: boolean;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateOfficialResponseDto {
  content: string;
  isResolved?: boolean;
}

export interface UpdateOfficialResponseDto {
  content?: string;
  isResolved?: boolean;
}

// ==================== Super Admin Types ====================

export interface SuperAdminStats {
  organizations: { total: number; active: number; pending: number };
  users: { total: number; active: number; pending: number };
  content: { pings: number; waves: number; surges: number };
  queue: { pendingOrgRequests: number; pendingClaims: number };
}

export interface SuperAdminOrganization {
  id: number;
  name: string;
  domain: string | null;
  status: string;
  isClaimVerified: boolean;
  categoryCustomizationLocked: boolean;
  joinPolicy: string;
  isDomainLocked: boolean;
  createdAt: string;
  userCount: number;
  pingCount: number;
}

export interface SuperAdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
  organization: { id: number; name: string; domain: string | null };
}

export interface StallingPing extends Ping {
  daysStalled: number;
}

export interface PriorityPing extends Ping {
  priorityScore: number;
}
