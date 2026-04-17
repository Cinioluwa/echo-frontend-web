/**
 * Routes
 * Phase: 1 — Updated routing structure
 *
 * Changes:
 * - Removed /soundBoard, /stream, /waveHistory routes
 * - Added /feed, /feed/:pingId, /history, /history/:tab
 * - App pages now nested under Layout (Outlet-based wrapper)
 * - Added redirects from old paths for backward compatibility
 * - Auth and admin routes unchanged
 */
import { lazy, Suspense, type ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoadingFallback from "./auth/LoadingFallback";
import AdminRoute from "./auth/AdminRoute";
import ProtectedRoute from "./auth/ProtectedRoute";
import ProfileRedirect from "./auth/ProfileRedirect";
import Layout from "./Layout";

const CHUNK_RELOAD_KEY = "echo:chunk-reload-attempted";
const CHUNK_LOAD_ERROR_PATTERN =
  /ChunkLoadError|Failed to fetch dynamically imported module|Loading chunk [\d]+ failed|text\/html is not a valid JavaScript MIME type|Importing a module script failed/i;

const isChunkLoadError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);
  return CHUNK_LOAD_ERROR_PATTERN.test(message);
};

const forceRefreshForChunkError = () => {
  if (typeof window === "undefined") return;

  const alreadyRetried = sessionStorage.getItem(CHUNK_RELOAD_KEY) === "1";
  if (alreadyRetried) return;

  sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
  const locationWithLegacyReload = window.location as Location & {
    reload: (forcedReload?: boolean) => void;
  };
  locationWithLegacyReload.reload(true);
};

const lazyWithRetry = <T extends ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
) =>
  lazy(async () => {
    try {
      const module = await importer();
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(CHUNK_RELOAD_KEY);
      }
      return module;
    } catch (error) {
      if (isChunkLoadError(error)) {
        forceRefreshForChunkError();
        return new Promise<never>(() => { });
      }
      throw error;
    }
  });

// Eager load critical auth pages for immediate user experience
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

// Lazy load auth flow pages - Phase 10 Performance Optimization
const Verification = lazyWithRetry(() => import("../pages/auth/Verification"));
const SignUpError = lazyWithRetry(() => import("../pages/auth/SignUpError"));
const FindInstitution = lazyWithRetry(() => import("../pages/auth/FindInstitution"));
const FindInstitutionError = lazyWithRetry(() => import("../pages/auth/FindInstitutionError"));
const InstitutionFound = lazyWithRetry(() => import("../pages/auth/InstitutionFound"));
const MakeRequest = lazyWithRetry(() => import("../pages/auth/MakeRequest"));
const RequestSubmitted = lazyWithRetry(() => import("../pages/auth/RequestSubmitted"));
const AllVerified = lazyWithRetry(() => import("../pages/auth/AllVerified"));
const WaitingRoom = lazyWithRetry(() => import("../pages/auth/WaitingRoom"));
const ResetPassword = lazyWithRetry(() => import("../pages/auth/ResetPassword"));

// Lazy load main app pages (new unified architecture)
const UnifiedFeed = lazyWithRetry(() => import("../pages/UnifiedFeed"));
const PingDetail = lazyWithRetry(() => import("../pages/PingDetail"));
const History = lazyWithRetry(() => import("../pages/History"));

// Lazy load admin pages
const Feed = lazyWithRetry(() => import("../pages/admin/AdminFeed"));
const FollowUp = lazyWithRetry(() => import("../pages/admin/FollowUp"));
const Overview = lazyWithRetry(() => import("../pages/admin/Overview"));

// Lazy load admin components
const PostDetails = lazyWithRetry(() => import("./admin/PostDetails"));

// Lazy load user pages
const UserProfile = lazyWithRetry(() => import("../pages/UserProfile"));
const UserPrivacy = lazyWithRetry(() => import("../pages/UserPrivacy"));
const UserAccount = lazyWithRetry(() => import("../pages/UserAccount"));
const UserNotification = lazyWithRetry(() => import("../pages/UserNotification"));

// Lazy load admin profile pages
const AdminProfile = lazyWithRetry(() => import("../pages/admin/AdminProfile"));
const AdminAccount = lazyWithRetry(() => import("../pages/admin/AdminAccount"));
const AdminNotification = lazyWithRetry(() => import("../pages/admin/AdminNotification"));

// Lazy load error page
const ErrorPage = lazyWithRetry(() => import("../pages/ErrorPage"));

// Lazy load legal pages
const TermsOfUse = lazyWithRetry(() => import("../pages/TermsOfUse"));
const PrivacyPolicy = lazyWithRetry(() => import("../pages/PrivacyPolicy"));

// Helper to wrap lazy-loaded components with Suspense
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  // Auth flow routes with lazy loading
  {
    path: "/signup-error",
    element: withSuspense(SignUpError),
  },
  {
    path: "/verification",
    element: withSuspense(Verification),
  },
  {
    path: "/find-institution",
    element: withSuspense(FindInstitution),
  },
  {
    path: "/find-institution-error",
    element: withSuspense(FindInstitutionError),
  },
  {
    path: "/terms",
    element: withSuspense(TermsOfUse),
  },
  {
    path: "/privacy",
    element: withSuspense(PrivacyPolicy),
  },
  {
    path: "/institution-found",
    element: withSuspense(InstitutionFound),
  },
  {
    path: "/make-request",
    element: withSuspense(MakeRequest),
  },
  {
    path: "/request-submitted",
    element: withSuspense(RequestSubmitted),
  },
  {
    path: "/all-verified",
    element: withSuspense(AllVerified),
  },
  {
    path: "/waiting-room",
    element: withSuspense(WaitingRoom),
  },
  {
    path: "/reset-password",
    element: withSuspense(ResetPassword),
  },

  // Main app routes — nested under Layout
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "feed",
        element: withSuspense(UnifiedFeed),
      },
      {
        path: "feed/:pingId",
        element: withSuspense(PingDetail),
      },
      {
        path: "history",
        element: withSuspense(History),
      },
      {
        path: "history/:tab",
        element: withSuspense(History),
      },
    ],
  },

  // Redirects from old routes for backward compatibility
  {
    path: "soundBoard",
    element: <Navigate to="/feed" replace />,
  },
  {
    path: "stream",
    element: <Navigate to="/feed" replace />,
  },
  {
    path: "waveHistory",
    element: <Navigate to="/history" replace />,
  },

  // Conditional profile redirect — admins to /admin/profile, users to /user/profile
  {
    path: "/profile",
    element: <ProfileRedirect />,
  },

  {
    path: "/user",
    children: [
      {
        path: 'profile',
        element: withSuspense(UserProfile),
      },
      {
        path: "privacy",
        element: withSuspense(UserPrivacy),
      },
      {
        path: "account",
        element: withSuspense(UserAccount),
      },
      {
        path: "notification",
        element: withSuspense(UserNotification),
      },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    children: [
      {
        path: 'profile',
        element: withSuspense(AdminProfile),
      },
      {
        path: 'account',
        element: withSuspense(AdminAccount),
      },
      {
        path: 'notification',
        element: withSuspense(AdminNotification),
      },
      {
        path: "feed",
        element: (
          <AdminRoute>
            {withSuspense(Feed)}
          </AdminRoute>
        ),
      },
      {
        path: "feed/details/:pingId",
        element: withSuspense(PostDetails),
      },
      {
        path: "overview",
        element: (
          <AdminRoute>
            {withSuspense(Overview)}
          </AdminRoute>
        ),
      },
      {
        path: "followUp",
        element: (
          <AdminRoute>
            {withSuspense(FollowUp)}
          </AdminRoute>
        ),
      },
    ],
  },

  // Catch-all route for 404 and unmatched paths
  {
    path: "*",
    element: withSuspense(ErrorPage),
  },
]);

export default router;
