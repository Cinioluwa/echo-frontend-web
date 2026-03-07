import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import WaveHistory from "../pages/WaveHistory";
import Stream from "../pages/Stream";
import SoundBoard from "../pages/SoundBoard";

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
]);

export default router;
