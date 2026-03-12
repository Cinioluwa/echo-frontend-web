import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { authService, userService } from "../../api/services";
import { useSurgeStore } from "../interactions/useSurgeStore";
import type { User, LoginRequest, SignupRequest } from "../../api/types/index";

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  fetchUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;

  // Computed getters
  needsOrganization: () => boolean;
  isWaitingApproval: () => boolean;
  canAccessFeed: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        user: null,
        token: null,
        isLoading: false,
        isInitializing: false,
        error: null,
        isAuthenticated: false,

        // Actions
        login: async (credentials: LoginRequest) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.login(credentials);
            console.log(
              "Login successful, token received:",
              response.token ? "✓" : "✗",
            );

            set((state) => {
              state.token = response.token;
              state.isAuthenticated = true;
            });

            // Fetch user profile after login to populate user data
            // Use getCurrentUser directly instead of fetchUserProfile to avoid isLoading guard
            try {
              console.log("Fetching user profile...");
              const userData = await authService.getCurrentUser();
              console.log(
                "User profile loaded:",
                userData.email,
                "Role:",
                userData.role,
              );

              set((state) => {
                state.user = userData;
                state.isLoading = false;
              });

              // Seed surge state so ping/wave cards show correct "surged" status
              try {
                const surgesRes = await userService.getMySurges({ limit: 100 });
                const surgedPingIds: string[] = [];
                const surgedWaveIds: string[] = [];

                for (const surge of surgesRes.data) {
                  // API returns pingId/waveId fields on each surge item
                  const raw = surge as unknown as Record<string, unknown>;
                  if (raw.pingId) surgedPingIds.push(String(raw.pingId));
                  if (raw.waveId) surgedWaveIds.push(String(raw.waveId));
                }

                if (surgedPingIds.length > 0) {
                  useSurgeStore.getState().syncFromAPI("ping", surgedPingIds);
                }
                if (surgedWaveIds.length > 0) {
                  useSurgeStore.getState().syncFromAPI("wave", surgedWaveIds);
                }
              } catch (surgeErr) {
                // Non-critical — surge state will be corrected on first interaction
                console.error("Failed to seed surge state:", surgeErr);
              }
            } catch (profileErr: any) {
              console.error("Error fetching user profile:", profileErr);
              console.error(
                "Profile fetch error details:",
                profileErr.response?.data,
              );
              // Even if profile fetch fails, keep the authenticated state
              set((state) => {
                state.isLoading = false;
              });
            }
          } catch (err: any) {
            console.error("Login error:", err);
            const errorMessage =
              err.response?.data?.message ||
              err.response?.data?.error ||
              "Login failed";
            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;
            });
            throw err;
          }
        },

        register: async (data: SignupRequest) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.signup(data);
            // Note: Token might not be included if email verification is required
            set((state) => {
              state.isLoading = false;
              if (response.token) {
                state.token = response.token;
                state.user = response.user || null;
                state.isAuthenticated = true;
              }
            });
          } catch (err: any) {
            console.error("Registration error:", err);
            const errorMessage =
              err.response?.data?.message ||
              err.response?.data?.error ||
              "Registration failed";
            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;
            });
            throw err;
          }
        },

        verifyEmail: async (token: string) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            await authService.verifyEmail(token);
            // Fetch user profile after verification
            await get().fetchUserProfile();
            set((state) => {
              state.isLoading = false;
            });
          } catch (err: any) {
            console.error("Email verification error:", err);
            const errorMessage =
              err.response?.data?.message ||
              err.response?.data?.error ||
              "Verification failed";
            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;
            });
            throw err;
          }
        },

        resendVerification: async (email: string) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            await authService.resendVerification(email);
            set((state) => {
              state.isLoading = false;
            });
          } catch (err: any) {
            console.error("Resend verification error:", err);
            const errorMessage =
              err.response?.data?.message ||
              err.response?.data?.error ||
              "Failed to resend verification";
            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;
            });
            throw err;
          }
        },

        fetchUserProfile: async () => {
          if (get().isLoading) return;

          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const userData = await authService.getCurrentUser();
            set((state) => {
              state.user = userData;
              state.isAuthenticated = true;
              state.isLoading = false;
            });
          } catch (err: any) {
            console.error("Error fetching user profile:", err);
            const errorMessage =
              err.response?.data?.error || "Failed to load user data";

            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;

              // Handle 401 - clear auth
              if (err.response?.status === 401) {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem("authToken");
              }
            });
            throw err;
          }
        },

        fetchUser: async () => {
          await get().fetchUserProfile();
        },

        refreshUser: async () => {
          await get().fetchUserProfile();
        },

        logout: () => {
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
          });
          authService.logout();
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

        // Computed getters
        needsOrganization: () => {
          const user = get().user;
          return !user?.organizationId;
        },

        isWaitingApproval: () => {
          const user = get().user;
          return (user?.pendingRequests?.length ?? 0) > 0;
        },

        canAccessFeed: () => {
          const user = get().user;
          return user?.status === "ACTIVE" && !!user?.organizationId;
        },
      })),
      {
        name: "auth-storage",
        // Only persist user, token and isAuthenticated, not loading/error states
        partialize: (state) => ({
          user: state.user,
          token: state.token,
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
