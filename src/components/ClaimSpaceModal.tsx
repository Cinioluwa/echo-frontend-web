/**
 * ClaimSpaceModal
 * Figma ref: 4033:9279 (desktop), 4171:12085 (mobile)
 * Phase: 2
 *
 * Modal for claiming institutional leadership.
 * Echo logo at top, title "Take the lead", identity fields, submit button.
 */

import { useState } from "react";
import { useAuthStore } from "../stores";
import { organizationService } from "../api/services";

interface ClaimSpaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    institutionName?: string;
    organizationId: number | null;
}

const ClaimSpaceModal = ({
    isOpen,
    onClose,
    institutionName = "Your Institution",
    organizationId,
}: ClaimSpaceModalProps) => {
    const user = useAuthStore((state) => state.user);

    const [email, setEmail] = useState(user?.email ?? "");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [department, setDepartment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!organizationId) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await organizationService.claimOrganization(organizationId, {
                email,
                firstName,
                lastName,
                password,
                metadata: { role, department },
            });
            onClose();
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 409) {
                setError("This organisation has already been claimed or your request is pending review.");
            } else if (status === 403) {
                setError("Your email domain does not match this organisation's domain.");
            } else {
                setError("Failed to submit claim. Please try again.");
            }
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
                <div className="flex flex-col gap-2.5 items-center text-center w-full">
                    <h2
                        id="claim-space-title"
                        className="font-['Poppins',sans-serif] font-semibold text-[28px] text-black leading-9 w-full"
                    >
                        Take the lead
                    </h2>
                    <p className="font-['Poppins',sans-serif] font-medium text-[16px] text-[#4A504E] opacity-[0.69] leading-[21px] w-full">
                        Verify your identity and claim {institutionName}'s dashboard
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center w-full">
                    <div className="flex flex-col gap-[15px] items-center w-full">
                        {/* Email */}
                        <div className="bg-[#FBFBFB] border border-[#CACACA] rounded-xl flex items-center gap-[13px] h-[59px] px-[21px] py-[11px] w-full">
                            <svg className="w-[26px] h-[26px] shrink-0" fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect x="3" y="6" width="20" height="14" rx="2" stroke="#F49B31" strokeWidth="1.5" />
                                <path d="M3 9l10 7 10-7" stroke="#F49B31" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div className="w-px h-[38px] bg-[#CACACA] shrink-0" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email..."
                                required
                                className="flex-1 font-['Poppins',sans-serif] italic font-medium text-[13px] text-[#626665] bg-transparent outline-none"
                            />
                        </div>

                        {/* First Name */}
                        <div className="bg-[#FBFBFB] border border-[#CACACA] rounded-xl flex items-center gap-[13px] h-[59px] px-[21px] py-[11px] w-full">
                            <svg className="w-[26px] h-[26px] shrink-0" fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <circle cx="13" cy="8" r="5" stroke="#F49B31" strokeWidth="1.5" />
                                <path d="M3 22c0-4.418 4.477-8 10-8s10 3.582 10 8" stroke="#F49B31" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div className="w-px h-[38px] bg-[#CACACA] shrink-0" />
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter First Name..."
                                required
                                className="flex-1 font-['Poppins',sans-serif] italic font-medium text-[13px] text-[#626665] bg-transparent outline-none"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="bg-[#FBFBFB] border border-[#CACACA] rounded-xl flex items-center gap-[13px] h-[59px] px-[21px] py-[11px] w-full">
                            <svg className="w-[26px] h-[26px] shrink-0" fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <circle cx="13" cy="8" r="5" stroke="#F49B31" strokeWidth="1.5" />
                                <path d="M3 22c0-4.418 4.477-8 10-8s10 3.582 10 8" stroke="#F49B31" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div className="w-px h-[38px] bg-[#CACACA] shrink-0" />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter Last Name..."
                                required
                                className="flex-1 font-['Poppins',sans-serif] italic font-medium text-[13px] text-[#626665] bg-transparent outline-none"
                            />
                        </div>

                        {/* Password */}
                        <div className="bg-[#FBFBFB] border border-[#CACACA] rounded-xl flex items-center gap-[13px] h-[59px] px-[21px] py-[11px] w-full">
                            <svg className="w-[26px] h-[26px] shrink-0" fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect x="5" y="11" width="16" height="11" rx="2" stroke="#F49B31" strokeWidth="1.5" />
                                <path d="M9 11V7a4 4 0 018 0v4" stroke="#F49B31" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div className="w-px h-[38px] bg-[#CACACA] shrink-0" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password..."
                                required
                                className="flex-1 font-['Poppins',sans-serif] italic font-medium text-[13px] text-[#626665] bg-transparent outline-none"
                            />
                        </div>

                        {/* Role (Job Title) */}
                        <div className="bg-[#FBFBFB] border border-[#CACACA] rounded-xl flex items-center gap-[13px] h-[59px] px-[21px] py-[11px] w-full">
                            <svg className="w-[26px] h-[26px] shrink-0" fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect x="3" y="9" width="20" height="14" rx="2" stroke="#F49B31" strokeWidth="1.5" />
                                <path d="M9 9V7a4 4 0 018 0v2" stroke="#F49B31" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div className="w-px h-[38px] bg-[#CACACA] shrink-0" />
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="Enter Job Title..."
                                className="flex-1 font-['Poppins',sans-serif] italic font-medium text-[13px] text-[#626665] bg-transparent outline-none"
                            />
                        </div>

                        {/* Department */}
                        <div className="bg-[#FBFBFB] border border-[#CACACA] rounded-xl flex items-center gap-[13px] h-[59px] px-[21px] py-[11px] w-full">
                            <svg className="w-[26px] h-[26px] shrink-0" fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <rect x="3" y="5" width="20" height="18" rx="2" stroke="#F49B31" strokeWidth="1.5" />
                                <path d="M3 10h20" stroke="#F49B31" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M10 5V3M16 5V3" stroke="#F49B31" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div className="w-px h-[38px] bg-[#CACACA] shrink-0" />
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                placeholder="Enter Department..."
                                className="flex-1 font-['Poppins',sans-serif] italic font-medium text-[13px] text-[#626665] bg-transparent outline-none"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-[13px] text-center w-full">{error}</p>}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#F49B31] text-[#FFFEFE] font-['Poppins',sans-serif] font-medium text-[14px] leading-3.5 px-[50px] py-[15px] rounded-lg cursor-pointer hover:bg-[#d88429] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ClaimSpaceModal;
