// Shared types across stores
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  pageSize: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  staleTime: number; // Time before data is considered stale
}

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  staleTime: 2 * 60 * 1000, // 2 minutes
};
