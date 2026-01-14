// Common types used across API services

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  totalPings?: number;
  totalPages?: number;
  currentPage: number;
  limit: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  page?: number;
  total?: number;
  sort?: string;
  totalSurges?: number;
  totalWaves?: number;
  totalComments?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  level?: number;
  role: "USER" | "ADMIN" | "REPRESENTATIVE";
  organizationId: number;
  status?: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  level?: number;
}

export interface Ping {
  id: number;
  title: string;
  content: string;
  categoryId?: number;
  hashtag?: string;
  isAnonymous?: boolean;
  status: "POSTED" | "UNDER_REVIEW" | "ARCHIVED";
  progressStatus?: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "WONT_FIX";
  progressUpdatedAt?: string;
  resolvedAt?: string;
  surgeCount: number;
  hasSurged?: boolean; // Whether the current user has surged this ping
  authorId: number;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  author?: Author | null;
  category?: Category;
  waves?: Wave[];
  comments?: Comment[];
  officialResponse?: OfficialResponse;
  _count?: {
    waves: number;
    comments: number;
    surges: number;
  };
}

export interface Wave {
  id: number;
  title?: string;
  description?: string;
  solution: string;
  pingId: number;
  isAnonymous?: boolean;
  surgeCount: number;
  hasSurged?: boolean; // Whether the current user has surged this wave
  viewCount: number;
  rank?: number; // Top ranking (1-3 for top waves)
  flaggedForReview?: boolean;
  authorId: number;
  organizationId: number;
  status?: "POSTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt?: string;
  ping?: {
    id: number;
    title: string;
    content?: string;
    categoryId?: number;
    hasSurged?: boolean;
    surgeCount?: number;
    author?: Author | null;
    category?: Category;
    createdAt?: string;
    _count?: {
      waves?: number;
      comments?: number;
      surges?: number;
    };
  };
  author?: Author | null;
  category?: Category;
  comments?: Comment[];
  _count?: {
    comments: number;
    surges: number;
  };
}

export interface Comment {
  id: number;
  content: string;
  authorId: number;
  pingId?: number;
  waveId?: number;
  createdAt: string;
  author?: Author;
}

export interface Surge {
  id: number;
  userId: number;
  pingId?: number;
  waveId?: number;
  createdAt: string;
  ping?: {
    id: number;
    title: string;
    surgeCount: number;
  };
  wave?: {
    id: number;
    solution: string;
    surgeCount: number;
  };
}

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
  categories?: Category[];
}

export interface OfficialResponse {
  id: number;
  content: string;
  authorId: number;
  pingId: number;
  organizationId: number;
  createdAt: string;
  author?: Author;
}

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
  author?: Author | null;
  category?: Category;
  approvedWave?: {
    id: number;
    solution: string;
    surgeCount: number;
    viewCount: number;
    createdAt: string;
    author?: Author | null;
  } | null;
  officialResponse?: {
    id: number;
    content: string;
    createdAt: string;
    author?: Author;
  } | null;
  _count?: {
    waves?: number;
    comments?: number;
    surges?: number;
  };
}
