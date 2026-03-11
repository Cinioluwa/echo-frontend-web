/**
 * ClaimSpaceModal
 * Figma ref: 4033:9279 (desktop), 4171:12085 (mobile)
 * Phase: 2
 *
 * Modal for claiming institutional leadership.
 * Echo logo at top, title "Take the lead", job title + proof link fields, submit button.
 */

import { useState } from "react";

interface ClaimSpaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    institutionName?: string;
}

// TODO: API — POST /api/organization/:id/claim  { jobTitle, proofLink }

const ClaimSpaceModal = ({
    isOpen,
    onClose,
    institutionName = "Your Institution",
}: ClaimSpaceModalProps) => {
    const [jobTitle, setJobTitle] = useState("");
    const [proofLink, setProofLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // TODO: API — POST /api/organization/:id/claim  { jobTitle, proofLink }
            console.log("Claim submission:", { jobTitle, proofLink });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="claim-space-title"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-[30px] p-[50px] flex flex-col gap-[30px] items-center w-full max-w-[480px]">
                {/* Echo Logo */}
                <div className="flex items-center gap-[5.6px] justify-center">
                    <img
                        src="/assets/images/echo-logo-coloured.png"
                        alt="Echo Logo"
                        className="h-[30px] w-auto"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                    />
                    <span className="font-['Poppins',sans-serif] font-bold text-[33.75px] text-[#FFC37B] leading-normal">
                        Echo
                    </span>
                </div>

                {/* Header */}
                <div className="flex flex-col gap-[10px] items-center text-center w-full">
                    <h2
                        id="claim-space-title"
                        className="font-['Poppins',sans-serif] font-semibold text-[28px] text-black leading-[36px] w-full"
                    >
                        Take the lead
                    </h2>
                    <p className="font-['Poppins',sans-serif] font-medium text-[16px] text-[#4A504E] opacity-[0.69] leading-[21px] w-full">
                        Verify your identity and claim {institutionName}'s dashboard
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] items-center w-full">
                    <div className="flex flex-col gap-[15px] items-center w-full">
                        {/* Job Title */}
                        <div className="bg-[#FBFBFB] border border-[#CACACA] rounded-[12px] flex items-center gap-[13px] h-[59px] px-[21px] py-[11px] w-full">
                            <svg className="w-[26px] h-[26px] shrink-0 text-[#F49B31]" fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <circle cx="13" cy="8" r="5" stroke="#F49B31" strokeWidth="1.5" />
                                <path d="M3 22c0-4.418 4.477-8 10-8s10 3.582 10 8" stroke="#F49B31" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div className="w-px h-[38px] bg-[#CACACA] shrink-0" />
                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder="Enter Job Title..."
                                required
                                className="flex-1 font-['Poppins',sans-serif] italic font-medium text-[13px] text-[#626665] bg-transparent outline-none"
                            />
                        </div>

                        {/* Proof Link */}
                        <div className="bg-[#FBFBFB] border border-[#CACACA] rounded-[12px] flex items-center gap-[13px] h-[59px] px-[21px] py-[11px] w-full">
                            <svg className="w-[26px] h-[26px] shrink-0" fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#F49B31" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#F49B31" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="w-px h-[38px] bg-[#CACACA] shrink-0" />
                            <input
                                type="url"
                                value={proofLink}
                                onChange={(e) => setProofLink(e.target.value)}
                                placeholder="Enter Proof Link... (LinkedIn, Faculty Page)"
                                required
                                className="flex-1 font-['Poppins',sans-serif] italic font-medium text-[13px] text-[#626665] bg-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#F49B31] text-[#FFFEFE] font-['Poppins',sans-serif] font-medium text-[14px] leading-[14px] px-[50px] py-[15px] rounded-[8px] cursor-pointer hover:bg-[#d88429] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ClaimSpaceModal;
