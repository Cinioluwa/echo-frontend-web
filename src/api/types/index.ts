/**
 * API Type Definitions
 * Shared types for the Echo API
 */

// ==================== User Types ====================

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  level?: number; // Student year/level
  role: "USER" | "ADMIN" | "REPRESENTATIVE";
  organizationId: number;
  status?: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  level?: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user?: User;
}

export interface GoogleAuthRequest {
  token: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface OrganizationWaitlistRequest {
  email: string;
  organizationName: string;
  message?: string;
}

// ==================== Category Types ====================

export interface CategoryData {
  id: number;
  name: string;
}

export type Category =
  | "General"
  | "Academics"
  | "Chapel"
  | "Finance"
  | "Hall"
  | "Sport"
  | "Welfare";

// ==================== Ping Types ====================

export interface Ping {
  id: number;
  title: string;
  content: string;
  category?: {
    id: number;
    name: string;
  };
  hashtag?: string;
  author?: User;
  status: "POSTED" | "UNDER_REVIEW" | "ARCHIVED";
  surgeCount: number;
  viewCount?: number;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    waves: number;
    comments: number;
    surges: number;
  };
}

export interface CreatePingRequest {
  title: string;
  content: string;
  categoryId: number;
  hashtag?: string;
}

export interface UpdatePingRequest {
  title?: string;
  description?: string;
  category?: Category;
  hashtags?: string[];
  status?: "active" | "resolved" | "archived";
}

// ==================== Wave Types ====================

export interface Wave {
  id: number; // Backend returns number
  title?: string;
  description?: string;
  solution: string;
  category?: Category;
  ping?: {
    id: number;
    title: string;
    content?: string; // Ping description - to be added by backend
    author?: {
      id: number;
      firstName: string;
      lastName: string;
    };
    createdAt?: string;
  };
  author?: User | string; // Can be populated or just ID
  surgeCount: number;
  commentCount?: number;
  viewCount: number;
  rank?: number; // Top ranking (1-3 for top waves)
  status?: "active" | "approved" | "rejected" | "implemented";
  createdAt: string;
  updatedAt?: string;
  _count?: {
    surges: number;
    comments: number;
  };
}

export interface CreateWaveRequest {
  title: string;
  description: string;
  solution: string;
  category: Category;
  pingId?: string; // If proposing a wave for a specific ping
}

export interface UpdateWaveRequest {
  title?: string;
  description?: string;
  solution?: string;
  category?: Category;
  status?: "active" | "approved" | "rejected" | "implemented";
}

export interface ProposeWaveRequest {
  solution: string;
  category: Category;
  pingId: string;
}

// ==================== Surge (Like) Types ====================

export interface Surge {
  id: string;
  user: User | string;
  targetType: "ping" | "wave";
  targetId: string;
  createdAt: string;
}

export interface CreateSurgeRequest {
  targetType: "ping" | "wave";
  targetId: string;
}

// ==================== Comment Types ====================

export interface Comment {
  id: string;
  content: string;
  author: User | string;
  targetType: "ping" | "wave";
  targetId: string;
  parentComment?: string; // For nested comments/replies
  replyCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
  targetType: "ping" | "wave";
  targetId: string;
  parentCommentId?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

// ==================== Pagination Types ====================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ==================== Filter/Query Types ====================

export interface WaveQueryParams extends PaginationParams {
  category?: Category;
  status?: Wave["status"];
  authorId?: string;
  search?: string;
  minSurges?: number;
  maxSurges?: number;
}

export interface PingQueryParams extends PaginationParams {
  category?: Category;
  status?: Ping["status"];
  authorId?: string;
  search?: string;
  hasWave?: boolean; // Filter pings that have proposed waves
}

// ==================== Error Types ====================

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// ==================== Response Types ====================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ==================== Announcement Types ====================

export interface Announcement {
  id: number;
  title: string;
  content: string;
  authorId: number;
  organizationId: number;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
  };
  categories?: {
    id: number;
    name: string;
  }[];
}

// ==================== Stats & Analytics Types ====================

export interface Stats {
  totalUsers: number;
  totalPings: number;
  totalSurges: number;
  totalWaves: number;
  totalComments: number;
}

export interface AnalyticsData {
  name: string;
  value?: number;
  count?: number;
}

// ==================== Resolution Log Types ====================

export interface ResolutionLog {
  id: number;
  title: string;
  content: string;
  categoryId?: number;
  hashtag?: string;
  isAnonymous?: boolean;
  surgeCount: number;
  hasSurged?: boolean;
  createdAt: string;
  resolvedAt: string;
  msToResolve: number; // Time in milliseconds from creation to resolution
  author?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    level?: number;
  } | null;
  category?: {
    id: number;
    name: string;
  };
  approvedWave?: {
    id: number;
    solution: string;
    surgeCount: number;
    viewCount: number;
    createdAt: string;
    author?: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      level?: number;
    } | null;
  } | null;
  officialResponse?: {
    id: number;
    content: string;
    createdAt: string;
    author?: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      level?: number;
    };
  } | null;
  _count?: {
    waves?: number;
    comments?: number;
    surges?: number;
  };
}
