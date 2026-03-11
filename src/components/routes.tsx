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
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoadingFallback from "./auth/LoadingFallback";
import AdminRoute from "./auth/AdminRoute";
import ProtectedRoute from "./auth/ProtectedRoute";
import Layout from "./Layout";

// Eager load critical auth pages for immediate user experience
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

// Lazy load auth flow pages - Phase 10 Performance Optimization
const Verification = lazy(() => import("../pages/auth/Verification"));
const SignUpError = lazy(() => import("../pages/auth/SignUpError"));
const FindInstitution = lazy(() => import("../pages/auth/FindInstitution"));
const FindInstitutionError = lazy(() => import("../pages/auth/FindInstitutionError"));
const InstitutionFound = lazy(() => import("../pages/auth/InstitutionFound"));
const MakeRequest = lazy(() => import("../pages/auth/MakeRequest"));
const RequestSubmitted = lazy(() => import("../pages/auth/RequestSubmitted"));
const AllVerified = lazy(() => import("../pages/auth/AllVerified"));
const WaitingRoom = lazy(() => import("../pages/auth/WaitingRoom"));

// Lazy load main app pages (new unified architecture)
const UnifiedFeed = lazy(() => import("../pages/UnifiedFeed"));
const PingDetail = lazy(() => import("../pages/PingDetail"));
const History = lazy(() => import("../pages/History"));
const Profile = lazy(() => import("../pages/Profile"));

// Lazy load admin pages
const Feed = lazy(() => import("../Admin/Pages/Feed"));
const FollowUp = lazy(() => import("../Admin/Pages/FollowUp"));
const Overview = lazy(() => import("../Admin/Pages/Overview"));

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
      {
        path: "profile",
        element: withSuspense(Profile),
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

  // Admin routes
  {
    path: "/admin",
    children: [
      {
        path: "feed",
        element: (
          <AdminRoute>
            {withSuspense(Feed)}
          </AdminRoute>
        ),
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
]);

export default router;
