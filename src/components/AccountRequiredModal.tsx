import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { getAppOrigin } from "../utils/shareUrl";

interface AccountRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: "comment" | "wave";
}

const ACCOUNT_URL = getAppOrigin();
const SIGN_UP_URL = `${ACCOUNT_URL}/signUp`;

const AccountRequiredModal = ({
  isOpen,
  onClose,
  trigger,
}: AccountRequiredModalProps) => {
  const isComment = trigger === "comment";
  const heading = isComment
    ? "Join the conversation"
    : "Propose a solution";
  const body = isComment
    ? "Create an account or sign in with your school email to comment on this ping."
    : "Create an account or sign in with your school email to propose a wave for this ping.";

  // Focus trap + Escape handling
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            <h2 className="font-['Poppins',sans-serif] font-semibold text-[24px] text-black mb-3 leading-snug">
              {heading}
            </h2>
            <p className="font-['Poppins',sans-serif] font-normal text-[14px] text-[#626665] mb-6 leading-relaxed">
              {body}
            </p>

            <div className="flex flex-col gap-[10px]">
              <a
                href={SIGN_UP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Poppins',sans-serif] font-semibold text-[15px] text-white bg-[#F49B31] border border-[#F49B31] rounded-[15px] px-5 py-[13px] text-center hover:bg-[#d88429] transition-colors"
              >
                Create an Account
              </a>
              <a
                href={ACCOUNT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#F49B31] underline underline-offset-4 hover:text-[#d88429] transition-colors text-center"
              >
                Already have an account? Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountRequiredModal;
