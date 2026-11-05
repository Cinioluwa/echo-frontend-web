/**
 * PostSuccessModal — replaced by lightweight Toast notification
 * Figma ref: 3878:9112 (ping posted), 3878:9115 (wave posted)
 * Phase: 5
 *
 * This component now renders a non-blocking toast instead of a full-screen modal.
 * The existing Props interface is preserved for backward compatibility with
 * PingFormModal and WaveFormModal.
 */

import { useEffect } from "react";

interface Props {
  setPostSuccessModal: () => void;
  formSegment: string;
}

const PostSuccessModal = ({ setPostSuccessModal, formSegment }: Props) => {
  const isWave = formSegment === "wave";
  const message = isWave ? "Wave Posted Successfully" : "Ping Posted Successfully";

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPostSuccessModal();
    }, 3000);
    return () => clearTimeout(timer);
  }, [setPostSuccessModal]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100">
      <div
        role="status"
        aria-live="polite"
        className="bg-[#ffc37b] flex gap-2 items-center overflow-hidden
          px-[11px] py-2.5 rounded-[15px] font-poppins shadow-lg"
      >
        {/* Orange icon circle */}
        <div className="bg-[#f49b31] mix-blend-luminosity rounded-full shrink-0 w-[30px] h-[30px] flex items-center justify-center">
          <svg
            className="w-4 h-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M13.5 4.5L6.5 11.5L3 8"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Message */}
        <p className="font-medium text-[16px] leading-normal whitespace-nowrap text-[#454545]">
          {message}
        </p>
      </div>
    </div>
  );
};

export default PostSuccessModal;
