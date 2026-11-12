import React, { useState } from "react";
import { Mail, CheckCircle2, X, AlertCircle, Loader2 } from "lucide-react";
import userService from "../api/services/user.service";

interface UpgradeSchoolEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRegNumber?: string;
  currentEmail?: string;
}

export const UpgradeSchoolEmailModal: React.FC<UpgradeSchoolEmailModalProps> = ({
  isOpen,
  onClose,
  userRegNumber,
}) => {
  const [schoolEmail, setSchoolEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailTrimmed = schoolEmail.trim().toLowerCase();
    if (!emailTrimmed) {
      setError("Please enter your official university email address.");
      return;
    }

    if (!emailTrimmed.endsWith(".edu.ng") && !emailTrimmed.includes("@stu.cu.edu.ng")) {
      setError("Please provide your official university student email (e.g. name.regNumber@stu.cu.edu.ng).");
      return;
    }

    if (userRegNumber && !emailTrimmed.includes(userRegNumber.toLowerCase())) {
      setError(`Your school email must contain your registration number (${userRegNumber}).`);
      return;
    }

    setIsLoading(true);

    try {
      await userService.requestSchoolEmailUpgrade(emailTrimmed);
      setIsSuccess(true);
    } catch (err: any) {
      const apiErr =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to request email upgrade. Please verify your email and try again.";
      setError(apiErr);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setIsSuccess(false);
    setSchoolEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden font-poppins">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FFFDF9]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FEF5EA] text-[#F49B31] flex items-center justify-center">
              <Mail size={18} />
            </div>
            <h2 className="text-base font-semibold text-gray-900">
              Link Official School Email
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Verification Link Dispatched
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                We sent a verification link to <span className="font-semibold text-gray-900">{schoolEmail}</span>.
                Please open the email and click the confirmation link to permanently upgrade your Echo account.
              </p>
              <button
                onClick={handleClose}
                className="w-full mt-4 py-2.5 px-4 bg-[#F49B31] hover:bg-[#E8911A] text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
              >
                Got It
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                Now that IT has issued your university credentials, link your official student email to remove temporary limitations and make your Echo account permanent.
              </p>

              {userRegNumber && (
                <div className="text-[11px] text-[#A66E2E] bg-[#FEF5EA] border border-[#ffd7a8] rounded-xl px-3 py-2">
                  Registered Reg Number: <span className="font-semibold text-[#75420B]">{userRegNumber}</span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-600">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Official University Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                    placeholder="e.g. name.2201677@stu.cu.edu.ng"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#F49B31]/30 focus:border-[#F49B31] transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">
                  Must be your assigned university email address.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-[#F49B31] hover:bg-[#E8911A] text-white text-xs font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Verification Link"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradeSchoolEmailModal;

