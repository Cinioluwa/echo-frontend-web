import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { authService, userService, notificationService } from "../../api/services";
import { useSurgeStore } from "../interactions/useSurgeStore";
import { connectSocket, disconnectSocket } from "../../api/socket";
import type {
  User,
  LoginRequest,
  SignupRequest,
  ResendVerificationRequest,
} from "../../api/types/index";

const getInstitutionConfirmationKey = (user: User): string => {
  return `echo:institution-confirmed:${user.id}:${user.organizationId}`;
};

const hasLocalInstitutionConfirmation = (user: User | null): boolean => {
  if (!user?.organizationId) return false;
  return localStorage.getItem(getInstitutionConfirmationKey(user)) === "1";
};

const getOnboardingCompletionKey = (user: User): string => {
  return `echo:onboarding-completed:${user.id}`;
};

const hasLocalOnboardingCompletion = (user: User | null): boolean => {
  if (!user) return false;
  return localStorage.getItem(getOnboardingCompletionKey(user)) === "1";
};

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
  resendVerification: (payload: ResendVerificationRequest) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  fetchUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  markInstitutionConfirmationComplete: () => void;
  markOnboardingComplete: () => Promise<void>;

  // Computed getters
  needsOrganization: () => boolean;
  isWaitingApproval: () => boolean;
  canAccessFeed: () => boolean;
  hasCompletedInstitutionConfirmation: (userOverride?: User | null) => boolean;
  hasCompletedOnboarding: (userOverride?: User | null) => boolean;
  shouldAutoShowOnboarding: (userOverride?: User | null) => boolean;
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

            // Connect WebSocket (Phase 11)
            connectSocket(response.token);

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

        resendVerification: async (payload: ResendVerificationRequest) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            await authService.resendVerification(payload);
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
          // Unsubscribe from push notifications (fire and forget to not block logout)
          try {
            if ("serviceWorker" in navigator) {
              navigator.serviceWorker.ready.then((reg) => {
                reg.pushManager.getSubscription().then((sub) => {
                  if (sub) {
                    notificationService.unsubscribePush(sub.endpoint).catch(console.error);
                    sub.unsubscribe().catch(console.error);
                  }
                }).catch(console.error);
              }).catch(console.error);
            }
          } catch (e) {
            console.error("Failed to unsubscribe from push notifications", e);
          }

          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
          });
          authService.logout();
          disconnectSocket();
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

        markInstitutionConfirmationComplete: () => {
          const user = get().user;
          if (!user?.organizationId) return;

          localStorage.setItem(getInstitutionConfirmationKey(user), "1");
        },

        markOnboardingComplete: async () => {
          const user = get().user;

          if (!user?.organizationId) return;

          if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
            return;
          }

          const completedAt = new Date().toISOString();

          localStorage.setItem(getOnboardingCompletionKey(user), "1");

          set((state) => {
            if (!state.user) return;

            state.user.userPreference = {
              ...(state.user.userPreference || {}),
              hasCompletedOnboarding: true,
              onboardingCompletedAt:
                state.user.userPreference?.onboardingCompletedAt || completedAt,
            };
          });

          try {
            const updatedPreference = await userService.updateMyPreferences({
              hasCompletedOnboarding: true,
              onboardingCompletedAt: completedAt,
            });

            set((state) => {
              if (state.user) {
                // Ensure we don't lose the flag if the backend doesn't return it
                state.user.userPreference = {
                  ...updatedPreference,
                  hasCompletedOnboarding: true,
                };
              }
            });
          } catch (error) {
            // Keep local completion so onboarding does not repeatedly block users.
            console.error("Failed to sync onboarding completion:", error);
          }
        },

        // Computed getters
        needsOrganization: () => {
          const user = get().user;
          return !user?.organizationId;
        },

        isWaitingApproval: () => {
          const user = get().user;
          const pendingJoinRequest = user?.pendingJoinRequest;
          if (pendingJoinRequest?.status === "PENDING") {
            return true;
          }

          return (
            user?.pendingRequests?.some((request) => request.status === "PENDING") ??
            false
          );
        },

        canAccessFeed: () => {
          const user = get().user;
          if (!user) return false;

          if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
            return true;
          }

          return user.status === "ACTIVE" && !!user.organizationId;
        },

        hasCompletedInstitutionConfirmation: (userOverride?: User | null) => {
          const user = userOverride ?? get().user;

          if (!user) return false;

          if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
            return true;
          }

          return hasLocalInstitutionConfirmation(user);
        },

        hasCompletedOnboarding: (userOverride?: User | null) => {
          const user = userOverride ?? get().user;

          if (!user) return false;

          if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
            return true;
          }

          return (
            user.userPreference?.hasCompletedOnboarding === true ||
            Boolean(user.userPreference?.onboardingCompletedAt) ||
            hasLocalOnboardingCompletion(user)
          );
        },

        shouldAutoShowOnboarding: (userOverride?: User | null) => {
          const user = userOverride ?? get().user;

          if (!user) return false;

          if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
            return false;
          }

          if (user.status !== "ACTIVE") {
            return false;
          }

          if (!user.organizationId) {
            return false;
          }

          return !get().hasCompletedOnboarding(user);
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
