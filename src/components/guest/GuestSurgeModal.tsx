import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Mail, KeyRound, Loader2 } from "lucide-react";
import { guestService } from "../../api/services";
import { useGuestStore } from "../../stores";

interface GuestSurgeModalProps {
  pingId: number;
  pingTitle: string;
  onClose: () => void;
  onSuccess: (newSurgeCount?: number) => void;
}

const GuestSurgeModal = ({ pingId, pingTitle, onClose, onSuccess }: GuestSurgeModalProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "code" | "account_exists">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setGuestToken = useGuestStore((state) => state.setGuestToken);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await guestService.sendOtp(email, pingId);
      setStep("code");
    } catch (err: any) {
      if (err.response?.status === 409 || err.response?.data?.error === "account_exists") {
        setStep("account_exists");
      } else {
        setError(err.response?.data?.error || "Failed to send code. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await guestService.verifyOtp(email, code, pingId);
      setGuestToken(data.token);
      
      try {
        const surgeData = await guestService.guestSurgePing(pingId, data.token);
        onSuccess(surgeData.surgeCount);
        onClose();
      } catch {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-6 mt-2">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-[#F49B31] w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Surge as a Guest</h2>
            <p className="text-gray-600 text-sm">
              {step === "email" 
                ? "Enter your email to verify you're a real person. No password required."
                : step === "code" 
                ? `We sent a 6-digit code to ${email}`
                : "Looks like you're already one of us!"
              }
            </p>
          </div>

          {step !== "account_exists" && (
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-6">
              <p className="text-sm text-orange-800 font-medium truncate">
                Target: {pingTitle}
              </p>
            </div>
          )}

          {error && step !== "account_exists" && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
              {error}
            </div>
          )}

          {step === "account_exists" ? (
            <div className="text-center">
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
                This email is already registered on Echo. Please sign in to your account to surge this ping and track its progress!
              </div>
              <button
                onClick={() => navigate("/login")}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#F49B31] hover:bg-[#d88429] transition-colors mb-3"
              >
                Sign In to Echo
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setStep("email");
                  setError(null);
                  setEmail("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Use a different email
              </button>
            </div>
          ) : step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-[#F49B31] focus:border-[#F49B31] outline-none transition-shadow text-black"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#F49B31] hover:bg-[#d88429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F49B31] disabled:opacity-70 transition-colors"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Send Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-[#F49B31] focus:border-[#F49B31] outline-none transition-shadow tracking-widest text-center text-lg font-mono text-black"
                    placeholder="000000"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#F49B31] hover:bg-[#d88429] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F49B31] disabled:opacity-70 transition-colors"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify & Surge"}
              </button>
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => setStep("email")}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestSurgeModal;
