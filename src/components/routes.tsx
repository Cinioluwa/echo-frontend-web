import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import WaveHistory from "../pages/WaveHistory";
import Stream from "../pages/Stream";
import SoundBoard from "../pages/SoundBoard";
import Profile from "../pages/Profile";
import Feed from "../Admin/Pages/Feed";
import FollowUp from "../Admin/Pages/FollowUp";
import Overview from "../Admin/Pages/Overview";

// Auth flow pages (to be created in Phase 2+)
import Verification from "../pages/auth/Verification";
import FindInstitution from "../pages/auth/FindInstitution";
import InstitutionFound from "../pages/auth/InstitutionFound";
import MakeRequest from "../pages/auth/MakeRequest";
import RequestSubmitted from "../pages/auth/RequestSubmitted";
import AllVerified from "../pages/auth/AllVerified";
import WaitingRoom from "../pages/auth/WaitingRoom";

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
  // Auth flow routes
  {
    path: "/verification",
    element: <Verification />,
  },
  {
    path: "/find-institution",
    element: <FindInstitution />,
  },
  {
    path: "/institution-found",
    element: <InstitutionFound />,
  },
  {
    path: "/make-request",
    element: <MakeRequest />,
  },
  {
    path: "/request-submitted",
    element: <RequestSubmitted />,
  },
  {
    path: "/all-verified",
    element: <AllVerified />,
  },
  {
    path: "/waiting-room",
    element: <WaitingRoom />,
  },
  {
    path: "waveHistory",
    element: <WaveHistory />,
  },
  {
    path: "stream",
    element: <Stream />,
  },
  {
    path: "soundBoard",
    element: <SoundBoard />,
  },
  {
    path: "profile",
    element: <Profile />,
  },

  // Admin routes

  {
    path: "/admin",
    children: [
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "overview",
        element: <Overview />,
      },
      {
        path: "followUp",
        element: <FollowUp />,
      },
    ],
  },
]);

export default router;
