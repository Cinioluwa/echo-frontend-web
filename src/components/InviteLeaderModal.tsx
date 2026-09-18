/**
 * InviteLeaderModal
 * Figma ref: 4033:9353 (desktop), 4171:12142 (mobile)
 * Phase: 2
 *
 * Modal for inviting someone to lead the institution.
 * Echo logo at top, title "Know who should lead this?", name + email + proof link fields, invite button.
 */

import { useState } from "react";
import { organizationService } from "../api/services";
import EchoLogo from "./auth/EchoLogo";

interface InviteLeaderModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizationId: number | null;
}

const InviteLeaderModal = ({ isOpen, onClose, organizationId }: InviteLeaderModalProps) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [proofLink, setProofLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!organizationId) return;
        setIsSubmitting(true);
        setError(null);
        try {
            await organizationService.inviteLeader(organizationId, { name, email, proofLink });
            onClose();
        } catch {
            setError("Failed to send invite. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-leader-title"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-[30px] p-[50px] flex flex-col gap-[30px] items-center w-full max-w-[480px]">
                {/* Echo Logo */}
                <EchoLogo size="md" />

                {/* Header */}
                <div className="flex flex-col gap-2.5 items-center text-center w-full">
                    <h2
                        id="invite-leader-title"
                        className="font-['Poppins',sans-serif] font-semibold text-[28px] text-black leading-9 w-full"
                    >
                        Know who should lead this?
                    </h2>
                    <p className="font-['Poppins',sans-serif] font-medium text-[16px] text-[#4A504E] opacity-[0.69] leading-[21px] w-full">
                        Send them an invite and let them know their community is waiting
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center w-full">
                    <div className="flex flex-col gap-[15px] items-center w-full">
                        {/* Name */}
                        <div className="bg-[#FBFBFB] border border-[#CACACA] rounded-xl flex items-center gap-[13px] h-[59px] px-[21px] py-[11px] w-full">
                            <svg className="w-[26px] h-[26px] shrink-0" fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <circle cx="13" cy="8" r="5" stroke="#F49B31" strokeWidth="1.5" />
                                <path d="M3 22c0-4.418 4.477-8 10-8s10 3.582 10 8" stroke="#F49B31" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <div className="w-px h-[38px] bg-[#CACACA] shrink-0" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Leader's Name..."
                                required
                                className="flex-1 font-['Poppins',sans-serif] italic font-medium text-[13px] text-[#626665] bg-transparent outline-none"
                            />
                        </div>

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
                                placeholder="Enter Leader's Email..."
                                required
                                className="flex-1 font-['Poppins',sans-serif] italic font-medium text-[13px] text-[#626665] bg-transparent outline-none"
                            />
                        </div>

                        {/* Proof Link */}
                        <div className="bg-[#FBFBFB] border border-[#CACACA] rounded-xl flex items-center gap-[13px] h-[59px] px-[21px] py-[11px] w-full">
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
                                className="flex-1 font-['Poppins',sans-serif] italic font-medium text-[13px] text-[#626665] bg-transparent outline-none"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-[13px] text-center w-full">{error}</p>}

                    {/* Invite Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#F49B31] text-[#FFFEFE] font-['Poppins',sans-serif] font-medium text-[14px] leading-3.5 px-[50px] py-[15px] rounded-lg cursor-pointer hover:bg-[#d88429] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Inviting..." : "Invite"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default InviteLeaderModal;
