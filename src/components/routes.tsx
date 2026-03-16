import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import WaveHistory from "../pages/WaveHistory";
import Stream from "../pages/Stream";
import SoundBoard from "../pages/SoundBoard";
import Feed from "../Admin/Pages/Feed";
import FollowUp from "../Admin/Pages/FollowUp";
import Overview from "../Admin/Pages/Overview";
import PostDetails from "../Admin/Components/PostDetails";
import UserProfile from "../pages/UserProfile";
import UserPrivacy from "../pages/UserPrivacy";
import UserAccount from "../pages/UserAccount";
import UserNotification from "../pages/UserNotification";
import AdminProfile from "../Admin/Pages/AdminProfile";
import AdminAccount from "../Admin/Pages/AdminAccount";
import AdminNotification from "../Admin/Pages/AdminNotification";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
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
    path: "/user",
    children: [
      {
        path: 'profile',
        element: <UserProfile />,
      },
      {
        path: "privacy",
        element: <UserPrivacy />,
      },
      {
        path: "account",
        element: <UserAccount />,
      },
      {
        path: "notification",
        element: <UserNotification />,
      },
    ],
  },

  // Admin routes

  {
    path: "/admin",
    children: [
      {
        path: 'profile',
        element: <AdminProfile />
      },
      {
        path: 'account',
        element: <AdminAccount />
      },
      {
        path: 'notification',
        element: <AdminNotification />
      },
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "feed/details",
        element: <PostDetails />,
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
