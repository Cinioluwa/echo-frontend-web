/**
 * ProposeWaveBar
 * Figma ref: 4162:11263 (in Ping Detail 4139:10022)
 * Phase: 3
 *
 * Inline bar for proposing a wave on a ping.
 * Clicking the input or the button opens ProposeWaveModal.
 */
import { useState } from "react";
import { useAuthStore } from "../stores";
import ProposeWaveModal from "./ProposeWaveModal";

const waveIcon = "/assets/icon/wave.svg";
interface Props {
    pingId: string;
    pingTitle?: string;
    pingCreatedAt?: string;
    onWaveProposed?: () => void;
}

const ProposeWaveBar = ({ pingId, pingTitle, pingCreatedAt, onWaveProposed }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { user } = useAuthStore();

    const initials = user
        ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
        : "?";

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div className="bg-white rounded-[15px] p-2.5 flex flex-col gap-[13px] w-full">
                {/* Row 1: Avatar + Input bar */}
                <div className="flex items-center gap-2.5">
                    {/* Author avatar */}
                    <div className="size-[35px] shrink-0 rounded-full bg-[#ffc37b] flex items-center justify-center overflow-hidden">
                        <span className="text-white text-[12px] font-semibold">{initials}</span>
                    </div>

                    {/* Clickable input placeholder */}
                    <button
                        type="button"
                        onClick={openModal}
                        className="flex-1 bg-[#fefefe] border-[1.5px] border-[#ffc37b] rounded-[20px] px-[25px] py-2.5 text-left cursor-text"
                    >
                        <span className="font-['Poppins:Medium',sans-serif] text-[11px] text-[#8b8e8d]">
                            What's your Solution?
                        </span>
                    </button>
                </div>

                {/* Row 2: PROPOSE A WAVE button — full-width on mobile, right-aligned on desktop */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={openModal}
                        className="w-full md:w-auto bg-[#fef5ea] border border-black rounded-[20px] h-[39px] px-2.5 flex items-center gap-[5px] cursor-pointer justify-center md:justify-start"
                    >
                        {/* Wave icon */}
                        <img src={waveIcon} alt="Wave icon" className="w-5 h-5" />
                        <span className="font-['Baloo_Bhai_2:SemiBold',sans-serif] text-[13px] text-black uppercase tracking-wide">
                            Propose a Wave
                        </span>
                    </button>
                </div>
            </div>

            {/* Propose Wave Modal */}
            {isModalOpen && (
                <ProposeWaveModal
                    onClose={closeModal}
                    pingId={pingId}
                    pingTitle={pingTitle}
                    pingTimeStamp={pingCreatedAt}
                    setProposeActive={() => { }}
                    onWaveCreated={() => {
                        closeModal();
                        onWaveProposed?.();
                    }}
                />
            )}
        </>
    );
};

export default ProposeWaveBar;
