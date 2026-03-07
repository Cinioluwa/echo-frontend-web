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
