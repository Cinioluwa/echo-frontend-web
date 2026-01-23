import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { userService } from "../../api/services";
import type { User } from "../../api/types";

interface AuthState {
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  fetchUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        // Actions
        fetchUser: async () => {
          // Prevent duplicate fetches
          if (get().isLoading) return;

          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const userData = await userService.getMe();
            set((state) => {
              state.user = userData;
              state.isAuthenticated = true;
              state.isLoading = false;
            });
          } catch (err: any) {
            console.error("Error fetching user:", err);
            const errorMessage =
              err.response?.data?.error || "Failed to load user data";

            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;

              // Handle 401 - clear auth
              if (err.response?.status === 401) {
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem("token");
              }
            });
          }
        },

        refreshUser: async () => {
          await get().fetchUser();
        },

        login: async (token: string) => {
          localStorage.setItem("token", token);
          await get().fetchUser();
        },

        logout: () => {
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
          });
          localStorage.removeItem("token");
        },

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },

        updateUser: (userData: Partial<User>) => {
          set((state) => {
            if (state.user) {
              state.user = { ...state.user, ...userData };
            }
          });
        },
      })),
      {
        name: "auth-storage",
        // Only persist user and isAuthenticated, not loading/error states
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: "AuthStore" },
  ),
);

// Selectors (for optimized access)
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) =>
  state.isAuthenticated;
export const selectAuthLoading = (state: AuthState) => state.isLoading;
export const selectAuthError = (state: AuthState) => state.error;
