import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Stream from "./pages/Stream";
import SoundBoard from "./pages/SoundBoard";
import WaveHistory from "./pages/WaveHistory";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="waveHistory" element={<WaveHistory />} />
          <Route path="soundBoard" element={<SoundBoard />} />
          <Route path="stream" element={<Stream />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
