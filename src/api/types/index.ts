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
  profilePicture?: string;
  level?: number; // Student year/level
  role: "USER" | "ADMIN" | "REPRESENTATIVE" | "LEADER" | "SUPER_ADMIN";
  organizationId: number | null;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt?: string;
  lastNameChangeAt?: string; // Timestamp of last name change
  pendingRequests?: Array<{
    id: number;
    organizationId: number;
    organizationName: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
  }>;
  organization?: {
    id: number;
    name: string;
    logoUrl?: string;
  };
  userPreference?: UserPreference;
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
  organizationId?: number; // Optional - for manual organization selection
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
  organizationName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  metadata?: {
    website?: string;
    role?: string;
    additionalNotes?: string;
  };
}

// ==================== Organization Types ====================

export interface Organization {
  id: number;
  name: string;
  domain: string;
  logoUrl?: string;
  joinPolicy: "OPEN" | "REQUIRES_APPROVAL";
  createdAt?: string;
  updatedAt?: string;
}

// ==================== Category Types ====================

export interface CategoryData {
  id: number;
  name: string;
}

// ==================== Ping Types ====================

export interface Ping {
  id: number;
  title: string;
  content: string;
  category?: {
    id: number;
    name: string;
  };
  categoryId?: number; // Backend sends this for category lookup (name fetched separately)
  hashtag?: string;
  author?: User;
  authorId?: number; // For consistency with Wave type
  status:
    | "POSTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "ON_HOLD";
  progressStatus?: "NONE" | "IN_PROGRESS" | "ACKNOWLEDGED" | "RESOLVED";
  surgeCount: number;
  viewCount?: number;
  hasSurged?: boolean; // Whether the current user has surged this ping
  resolvedAt?: string; // Timestamp when ping was marked as resolved
  createdAt: string;
  updatedAt?: string;
  waves?: Wave[];
  _count?: {
    waves: number;
    comments: number;
    surges: number;
  };
  media?: Media[];
}

export interface CreatePingRequest {
  title: string;
  content: string;
  categoryId: number;
  hashtag?: string;
  isAnonymous?: boolean;
  mediaIds?: number[];
}

export interface UpdatePingRequest {
  title?: string;
  description?: string;
  category?: CategoryData;
  hashtags?: string[];
  status?: "active" | "resolved" | "archived";
}

// ==================== Wave Types ====================

export interface Wave {
  id: number; // Backend returns number
  title?: string;
  description?: string;
  solution: string;
  category?: CategoryData;
  ping?: {
    id: number;
    title: string;
    content?: string;
    categoryId?: number;
    hasSurged?: boolean;
    surgeCount?: number;
    author?: {
      id: number;
      firstName: string;
      lastName: string;
    } | null;
    category?: {
      id: number;
      name: string;
    };
    createdAt?: string;
    _count?: {
      waves?: number;
      comments?: number;
      surges?: number;
    };
  };
  author?: User | string; // Backend should send full author object like Ping does
  surgeCount: number;
  commentCount?: number;
  viewCount: number;
  hasSurged?: boolean; // Whether the current user has surged this wave
  rank?: number; // Top ranking (1-3 for top waves)
  status:
    | "POSTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "ON_HOLD";
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
  category: CategoryData;
  pingId?: string; // If proposing a wave for a specific ping
}

export interface UpdateWaveRequest {
  title?: string;
  description?: string;
  solution?: string;
  category?: CategoryData;
  status?: "POSTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
}

export interface ProposeWaveRequest {
  solution: string;
  pingId: string;
  /**
   * Optional media IDs for attached files/photos (for wave photo upload)
   */
  mediaIds?: number[];
  // Note: category is inherited from the parent ping on backend
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
  id: string | number;
  content: string;
  author: User | string;
  authorId?: number;
  organizationId?: number;
  pingId?: number;
  waveId?: number | null;
  targetType?: "ping" | "wave";
  targetId?: string;
  parentComment?: string; // For nested comments/replies
  replyCount?: number;
  createdAt: string;
  updatedAt?: string;
  surgeCount?: number;
  isAnonymous?: boolean;
  hasSurged?: boolean; // Whether the current user has surged this comment
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
  category?: CategoryData;
  status?: Wave["status"];
  authorId?: string;
  search?: string;
  minSurges?: number;
  maxSurges?: number;
}

export interface PingQueryParams extends PaginationParams {
  category?: CategoryData;
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

export interface Media {
  id: number;
  url: string;
  mimeType: string;
  filename?: string;
  createdAt?: string;
  width?: number;
  height?: number;
}

export interface UserPreference {
  id?: number;
  userId?: number;
  commentAnonymously?: boolean;
  pingAnonymously?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
