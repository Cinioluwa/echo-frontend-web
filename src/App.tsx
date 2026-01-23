import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./stores";
import Stream from "./pages/Stream";
import SoundBoard from "./pages/SoundBoard";
import WaveHistory from "./pages/WaveHistory";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const App = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  // Initialize auth on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="waveHistory" element={<WaveHistory />} />
        <Route path="soundBoard" element={<SoundBoard />} />
        <Route path="stream" element={<Stream />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
