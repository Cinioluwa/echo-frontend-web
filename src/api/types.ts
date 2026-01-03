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
  status: "POSTED" | "UNDER_REVIEW" | "ARCHIVED";
  progressStatus: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "WONT_FIX";
  surgeCount: number;
  authorId: number;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  author?: Author;
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
  solution: string;
  pingId: number;
  surgeCount: number;
  viewCount: number;
  flaggedForReview?: boolean;
  organizationId: number;
  createdAt: string;
  ping?: {
    id: number;
    title: string;
    author?: Author;
  };
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
