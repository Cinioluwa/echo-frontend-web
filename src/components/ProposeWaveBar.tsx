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

  const getErrorMessage = (err: any): string => {
    // Check for detailed validation errors from backend
    if (
      err.response?.data?.details &&
      Array.isArray(err.response.data.details)
    ) {
      const messages = err.response.data.details
        .map((detail: any) => detail.message)
        .filter(Boolean);
      if (messages.length > 0) {
        return messages.join(". ");
      }
    }

    // Fall back to top-level error message
    if (err.response?.data?.error) {
      return err.response.data.error;
    }

    // Default error message
    return "Failed to propose wave. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!solution.trim()) {
      setError("Please enter a solution");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const createdWave = await waveService.createWaveForPing(
        pingId,
        solution.trim(),
      );
      useWavesStore.getState().addWave(createdWave);
      setSolution("");
      onWaveProposed?.();
    } catch (err: any) {
      console.error("Failed to propose wave:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[15px] mb-5 p-4 flex flex-col gap-[13px] w-full"
    >
      {/* Avatar + Textarea - desktop: same row, mobile: stacked */}
      <div className="flex flex-col md:flex-row md:items-center gap-2.5">
        {/* Author avatar */}
        <div className="shrink-0 size-[35px]">
          <UserAvatar user={user} size="md" bgColor="bg-[#ffc37b]" />
        </div>

        {/* Solution textarea */}
        <textarea
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="What's your Solution?"
          className="flex-1 bg-[#fefefe] border-[1.5px] border-[#ffc37b] rounded-[14px] px-[25px] py-2.5 text-[14px] text-[#454545] outline-none focus:border-[#F49B31] italic focus:border-2 transition-all resize-none font-['Poppins:Medium',sans-serif]"
          rows={1}
          disabled={isSubmitting}
        />

        {/* Button - desktop: inline right, mobile: hidden here */}
        <button
          type="submit"
          disabled={isSubmitting || !solution.trim()}
          className="hidden md:flex bg-[#fef5ea] border border-black rounded-[20px] h-[39px] px-2.5 py-[15px] items-center gap-[5px] cursor-pointer hover:bg-[#f9eedb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {/* Wave icon */}
          <img src={waveIcon} alt="Wave icon" className="w-8 h-8" />
          <span className="font-['Baloo_Bhai_2:SemiBold',sans-serif] text-[13px] text-black uppercase tracking-wide whitespace-nowrap">
            {isSubmitting ? "Proposing..." : "Propose a Wave"}
          </span>
        </button>
      </div>

      {/* Button - mobile only, aligned to right */}
      <div className="flex justify-end md:hidden">
        <button
          type="submit"
          disabled={isSubmitting || !solution.trim()}
          className="bg-[#fef5ea] border border-black rounded-[20px] h-[39px] px-2.5 py-[15px] flex items-center gap-[5px] cursor-pointer hover:bg-[#f9eedb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {/* Wave icon */}
          <img src={waveIcon} alt="Wave icon" className="w-8 h-8" />
          <span className="font-['Baloo_Bhai_2:SemiBold',sans-serif] text-[13px] text-black uppercase tracking-wide whitespace-nowrap">
            {isSubmitting ? "Proposing..." : "Propose a Wave"}
          </span>
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-xs ml-[45px]">{error}</p>}
    </form>
  );
};

export default ProposeWaveBar;
