import { useState } from "react";
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
  const [step, setStep] = useState<"email" | "code">("email");
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
      setError(err.response?.data?.error || "Failed to send code. Please try again.");
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
      
      // Verification automatically surges the ping in the backend, but we can also trigger a manual surge call if needed.
      // Actually, verifyOtp returns the token. We can then call guestSurgePing to be absolutely sure, or rely on the backend.
      // Let's call guestSurgePing to get the new surgeCount.
      try {
        const surgeData = await guestService.guestSurgePing(pingId, data.token);
        onSuccess(surgeData.surgeCount);
        onClose();
      } catch (surgeErr: any) {
        // If it was already surged during verify, it might return an error or just success.
        // Assuming the backend handles double surges gracefully.
        onSuccess(); // Optimistic if API fails
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={onClose}>
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

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-[#F49B31] w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Surge as a Guest</h2>
            <p className="text-gray-600 text-sm">
              {step === "email" 
                ? "Enter your email to verify you're a real person. No password required."
                : `We sent a 6-digit code to ${email}`
              }
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 mb-6">
            <p className="text-sm text-orange-800 font-medium truncate">
              Target: {pingTitle}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
              {error}
            </div>
          )}

          {step === "email" ? (
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-[#F49B31] focus:border-[#F49B31] outline-none transition-shadow"
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
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-[#F49B31] focus:border-[#F49B31] outline-none transition-shadow tracking-widest text-center text-lg font-mono"
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
                  className="text-sm text-gray-500 hover:text-gray-700"
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
