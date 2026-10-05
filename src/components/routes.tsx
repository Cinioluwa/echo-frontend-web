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
import RepresentativeRoute from "./auth/RepresentativeRoute";
import AdminRoute from "./auth/AdminRoute";
import SuperAdminRoute from "./auth/SuperAdminRoute";
import ProtectedRoute from "./auth/ProtectedRoute";
import ProfileRedirect from "./auth/ProfileRedirect";
import Layout from "./Layout";
import ErrorPage from "../pages/ErrorPage";
import {
  isChunkLoadError,
  tryAutoReloadForChunkError,
  clearChunkReloadState,
} from "../utils/chunkRetry";

const lazyWithRetry = <T extends ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
) =>
  lazy(async () => {
    try {
      const module = await importer();
      clearChunkReloadState();
      return module;
    } catch (error) {
      if (isChunkLoadError(error)) {
        const reloaded = tryAutoReloadForChunkError(error);
        if (reloaded) {
          return new Promise<never>(() => {});
        }
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
const InstitutionAgreement = lazyWithRetry(() => import("../pages/auth/InstitutionAgreement"));

// Lazy load main app pages (new unified architecture)
const UnifiedFeed = lazyWithRetry(() => import("../pages/UnifiedFeed"));
const PingDetail = lazyWithRetry(() => import("../pages/PingDetail"));
const RepInbox = lazyWithRetry(() => import("../pages/RepInbox"));
const RepPingDetail = lazyWithRetry(() => import("../components/admin/PingDetail/AdminPingDetail").then((m) => ({ default: () => <m.default mode="rep" /> })));
const RepFollowUp = lazyWithRetry(() => import("../components/admin/FollowUp/FollowUp").then((m) => ({ default: () => <m.default mode="rep" /> })));
const History = lazyWithRetry(() => import("../pages/History"));
const Notifications = lazyWithRetry(() => import("../pages/Notifications"));

// Lazy load guest pages
const GuestPingDetail = lazyWithRetry(() => import("../pages/guest/GuestPingDetail"));

// Lazy load admin pages
const FollowUpPage = lazyWithRetry(() => import("../pages/admin/FollowUpPage"));
const ModerationPage = lazyWithRetry(() => import("../pages/admin/ModerationPage"));
const AdminPingDetailPage = lazyWithRetry(() => import("../pages/admin/AdminPingDetailPage"));
const AdminSoundboardPage = lazyWithRetry(() => import("../pages/admin/AdminSoundboardPage"));
const InstitutionWorkspace = lazyWithRetry(() => import("../pages/admin/InstitutionWorkspace"));

// Lazy load admin components
const UserProfile = lazyWithRetry(() => import("../pages/UserProfile"));
const UserPrivacy = lazyWithRetry(() => import("../pages/UserPrivacy"));
const UserAccount = lazyWithRetry(() => import("../pages/UserAccount"));
const UserNotification = lazyWithRetry(() => import("../pages/UserNotification"));

// Lazy load admin profile pages
const AdminProfile = lazyWithRetry(() => import("../pages/admin/AdminProfile"));
const AdminAccount = lazyWithRetry(() => import("../pages/admin/AdminAccount"));
const AdminNotification = lazyWithRetry(() => import("../pages/admin/AdminNotification"));

// Lazy load Super Admin pages
const SuperAdminLayout = lazyWithRetry(() => import("./super-admin/SuperAdminLayout"));
const SuperAdminDashboard = lazyWithRetry(() => import("../pages/super-admin/SuperAdminDashboard"));
const SuperAdminOrganizations = lazyWithRetry(() => import("../pages/super-admin/SuperAdminOrganizations"));
const SuperAdminUsers = lazyWithRetry(() => import("../pages/super-admin/SuperAdminUsers"));
const SuperAdminMaintenance = lazyWithRetry(() => import("../pages/super-admin/SuperAdminMaintenance"));



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
    errorElement: <ErrorPage />,
    children: [
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
  {
    path: "/signup",
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
    path: "/guest/feed/:pingId",
    element: withSuspense(GuestPingDetail),
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
  {
    path: "/onboarding/institution-agreement",
    element: withSuspense(InstitutionAgreement),
  },

  // Main app routes — nested under Layout
  {
    errorElement: <ErrorPage />,
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
      {
        path: "",
        element: <RepresentativeRoute />,
        children: [
          { path: "inbox", element: withSuspense(RepInbox) },
          { path: "inbox/:pingId", element: withSuspense(RepPingDetail) },
          { path: "follow-up", element: withSuspense(RepFollowUp) },
        ],
      },
      {
        path: "notifications",
        element: withSuspense(Notifications),
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
        path: 'notification-settings',
        element: withSuspense(AdminNotification),
      },
      {
        path: "soundboard",
        element: (
          <AdminRoute allowActiveRepresentative>
            {withSuspense(AdminSoundboardPage)}
          </AdminRoute>
        ),
      },
      {
        path: "soundboard/:pingId",
        element: (
          <AdminRoute>
            {withSuspense(AdminPingDetailPage)}
          </AdminRoute>
        ),
      },
      {
        path: "followUp",
        element: (
          <AdminRoute>
            {withSuspense(FollowUpPage)}
          </AdminRoute>
        ),
      },
      {
        path: "moderation",
        element: (
          <AdminRoute>
            {withSuspense(ModerationPage)}
          </AdminRoute>
        ),
      },
      {
        path: "settings",
        element: <Navigate to="/admin/institution" replace />,
      },
      {
        path: "institution",
        element: (
          <AdminRoute allowRepresentativeManager>
            {withSuspense(InstitutionWorkspace)}
          </AdminRoute>
        ),
      },
    ],
  },

  // Super Admin routes
  {
    path: "/super-admin",
    element: (
      <SuperAdminRoute>
        {withSuspense(SuperAdminLayout)}
      </SuperAdminRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: withSuspense(SuperAdminDashboard),
      },
      {
        path: "organizations",
        element: withSuspense(SuperAdminOrganizations),
      },
      {
        path: "users",
        element: withSuspense(SuperAdminUsers),
      },
      {
        path: "maintenance",
        element: withSuspense(SuperAdminMaintenance),
      },
      {
        path: "",
        element: <Navigate to="dashboard" replace />,
      },
    ],
  },


  // Catch-all route for 404 and unmatched paths
  {
    path: "*",
    element: <ErrorPage />,
  },
    ],
  },
]);

export default router;
