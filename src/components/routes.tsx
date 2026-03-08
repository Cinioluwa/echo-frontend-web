import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import LoadingFallback from "./auth/LoadingFallback";

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

// Lazy load main app pages
const WaveHistory = lazy(() => import("../pages/WaveHistory"));
const Stream = lazy(() => import("../pages/Stream"));
const SoundBoard = lazy(() => import("../pages/SoundBoard"));
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
  {
    path: "waveHistory",
    element: withSuspense(WaveHistory),
  },
  {
    path: "stream",
    element: withSuspense(Stream),
  },
  {
    path: "soundBoard",
    element: withSuspense(SoundBoard),
  },
  {
    path: "profile",
    element: withSuspense(Profile),
  },

  // Admin routes

  {
    path: "/admin",
    children: [
      {
        path: "feed",
        element: withSuspense(Feed),
      },
      {
        path: "overview",
        element: withSuspense(Overview),
      },
      {
        path: "followUp",
        element: withSuspense(FollowUp),
      },
    ],
  },
]);

export default router;
