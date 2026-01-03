/**
 * API Type Definitions
 * Shared types for the Echo API
 */

// ==================== User Types ====================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  matricNumber?: string;
  role: "student" | "admin" | "moderator";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
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
  matricNumber?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ==================== Category Types ====================

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
  id: string;
  title: string;
  description: string;
  category: Category;
  hashtags: string[];
  author: User | string; // Can be populated or just ID
  isAnonymous: boolean;
  surgeCount: number;
  commentCount: number;
  viewCount: number;
  status: "active" | "resolved" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface CreatePingRequest {
  title: string;
  description: string;
  category: Category;
  hashtags?: string[];
  isAnonymous?: boolean;
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
  id: string;
  title: string;
  description: string;
  solution: string;
  category: Category;
  ping?: Ping | string; // Referenced ping (if wave was proposed from a ping)
  author: User | string; // Can be populated or just ID
  surgeCount: number;
  commentCount: number;
  viewCount: number;
  rank?: number; // Top ranking (1-3 for top waves)
  status: "active" | "approved" | "rejected" | "implemented";
  createdAt: string;
  updatedAt: string;
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
