import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { getAppOrigin } from "../utils/shareUrl";

export type AccountTrigger = "comment" | "wave" | "wave_surge" | "view_more_comments" | "view_more_waves";

interface AccountRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: AccountTrigger;
  returnTo?: string;
}

const getModalContent = (trigger: AccountTrigger) => {
  switch (trigger) {
    case "wave_surge":
      return {
        heading: "Support this solution",
        body: "Create an account or sign in with your school email to surge community solutions.",
      };
    case "view_more_comments":
      return {
        heading: "View all comments",
        body: "Create an account or sign in with your school email to read the full community discussion.",
      };
    case "view_more_waves":
      return {
        heading: "Explore all solutions",
        body: "Create an account or sign in with your school email to browse all proposed waves.",
      };
    case "wave":
      return {
        heading: "Propose a solution",
        body: "Create an account or sign in with your school email to propose a wave for this ping.",
      };
    case "comment":
    default:
      return {
        heading: "Join the conversation",
        body: "Create an account or sign in with your school email to comment on this ping.",
      };
  }
};

const AccountRequiredModal = ({
  isOpen,
  onClose,
  trigger,
  returnTo,
}: AccountRequiredModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryActionRef = useRef<HTMLAnchorElement>(null);
  const { heading, body } = getModalContent(trigger);

  const fallbackReturnTo =
    typeof window !== "undefined"
      ? (window.location.pathname.startsWith("/guest/feed/")
          ? window.location.pathname.replace(/^\/guest/, "")
          : window.location.pathname)
      : "/feed";
  const targetReturnTo = returnTo || fallbackReturnTo;
  const returnToQuery = targetReturnTo
    ? `?returnTo=${encodeURIComponent(targetReturnTo)}`
    : "";
  const signUpUrl = `${getAppOrigin()}/signUp${returnToQuery}`;
  const signInUrl = `${getAppOrigin()}/login${returnToQuery}`;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    primaryActionRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-required-title"
        aria-describedby="account-required-description"
        className="bg-white rounded-[15px] border border-[#F49B31]/40 shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#626665] hover:text-black hover:bg-[#FEF5EA] rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F49B31]"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            <h2 id="account-required-title" className="font-['Poppins',sans-serif] font-semibold text-[30px] text-black mb-3 leading-snug">
              {heading}
            </h2>
            <p id="account-required-description" className="font-['Poppins',sans-serif] font-normal text-[14px] text-[#626665] mb-6 leading-relaxed">
              {body}
            </p>

            <div className="flex flex-col gap-[10px]">
              <a
                ref={primaryActionRef}
                href={signUpUrl}
                className="font-['Poppins',sans-serif] font-semibold text-[15px] text-white bg-[#F49B31] border border-[#F49B31] rounded-[15px] px-5 h-12 inline-flex items-center justify-center hover:bg-[#d88429] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Create an Account
              </a>
              <a
                href={signInUrl}
                className="font-['Poppins',sans-serif] font-medium text-[14px] text-[#F49B31] underline underline-offset-4 hover:text-[#d88429] transition-colors text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F49B31]"
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
