/**
 * ProposeWaveBar
 * Figma ref: 4162:11263 (in Ping Detail 4139:10022)
 * Phase: 3
 *
 * Inline bar for proposing a wave on a ping.
 * User can type solution directly and submit with button click.
 */
import { useState } from "react";
import { useAuthStore, useWavesStore } from "../stores";
import { waveService } from "../api/services";
import UserAvatar from "./UserAvatar";

const waveIcon = "/assets/icon/wave.svg";
interface Props {
    pingId: string;
    pingTitle?: string;
    pingCreatedAt?: string;
    onWaveProposed?: () => void;
}

const ProposeWaveBar = ({ pingId, onWaveProposed }: Props) => {
    const [solution, setSolution] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!solution.trim()) {
            setError("Please enter a solution");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const createdWave = await waveService.createWaveForPing(pingId, solution.trim());
            useWavesStore.getState().addWave(createdWave);
            setSolution("");
            onWaveProposed?.();
        } catch (err: any) {
            console.error("Failed to propose wave:", err);
            setError(err.response?.data?.error || "Failed to propose wave. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[15px] p-2.5 flex flex-col gap-[13px] w-full">
            {/*  Avatar + Textarea + Button */}
            <div className="flex items-center gap-2.5">
                {/* Author avatar */}
                <UserAvatar user={user} size="md" bgColor="bg-[#ffc37b]" className="mt-2.5" />

                {/* Solution textarea */}
                <textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="What's your Solution?"
                    className="flex-1 bg-[#fefefe] border-[1.5px] border-[#ffc37b] rounded-[15px] px-[15px] py-2.5 text-[12px] text-[#454545] outline-none focus:border-[#F49B31] focus:border-2 transition-all resize-none font-['Poppins:Medium',sans-serif]"
                    rows={1}
                    disabled={isSubmitting}
                />

                {/* PROPOSE A WAVE button — full-width on mobile, right-aligned on desktop */}
                <button
                    type="submit"
                    disabled={isSubmitting || !solution.trim()}
                    className="w-full md:w-auto bg-[#fef5ea] border border-black rounded-[20px] h-[39px] px-2.5 flex items-center gap-[5px] cursor-pointer justify-center md:justify-start hover:bg-[#f9eedb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {/* Wave icon */}
                    <img src={waveIcon} alt="Wave icon" className="w-5 h-5" />
                    <span className="font-['Baloo_Bhai_2:SemiBold',sans-serif] text-[13px] text-black uppercase tracking-wide">
                        {isSubmitting ? "Proposing..." : "Propose a Wave"}
                    </span>
                </button>
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-xs ml-[47px]">{error}</p>}


        </form>
    );
};

export default ProposeWaveBar;
