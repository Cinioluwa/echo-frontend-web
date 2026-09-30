/**
 * MarkAsResolvedBar
 * Figma ref: 4183:14873
 * Phase: 3
 *
 * Shown at the bottom of a Ping Detail when waves exist.
 * Only visible to the ping author or an admin.
 * Includes confirmation dialog and loading state.
 */
import { useState } from "react";

interface Props {
    pingId: string;
    onResolved?: () => Promise<void> | void;
    isLoading?: boolean;
}

const MarkAsResolvedBar = ({ onResolved, isLoading = false }: Props) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleResolveRequest = () => {
        setShowConfirmation(true);
    };

    const handleConfirm = async () => {
        try {
            setIsProcessing(true);
            await onResolved?.();
            setShowConfirmation(false);
        } catch (err) {
            console.error("Failed to mark ping as resolved:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = () => {
        setShowConfirmation(false);
    };

    // Show confirmation dialog
    if (showConfirmation) {
        return (
            <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
                <div className="bg-white flex flex-col gap-[15px] items-end justify-center overflow-hidden px-[15px] py-5 rounded-[20px] w-[330px] md:p-6 md:rounded-[30px] md:w-[477px]">
                    {/* Title section */}
                    <div className="flex flex-col gap-2.5 md:gap-[15px] items-start w-full">
                        <div className="flex flex-col gap-[5px] items-center justify-center w-full">
                            {/* Checkmark icon */}
                            <div className="w-[31px] h-8 flex items-center justify-center">
                                <svg
                                    className="w-[31px] h-8"
                                    viewBox="0 0 31 32"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="0.5"
                                        y="0.5"
                                        width="30"
                                        height="31"
                                        rx="4.5"
                                        stroke="#2E7D32"
                                        strokeOpacity="0.4"
                                    />
                                    <path
                                        d="M8 16L13 21L23 11"
                                        stroke="#2E7D32"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            {/* Title */}
                            <p className="font-semibold leading-[1.46] text-[#282828] text-center w-full text-[20px] md:text-[26px]">
                                Mark as Resolved?
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-[14px] md:text-[16px] text-[#666] text-center w-full leading-normal">
                            This will mark the ping as resolved.
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 w-full justify-end">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isProcessing}
                            className="px-4 py-2 rounded-[15px] border border-[#ddd] text-[14px] font-medium text-[#666] hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="px-4 py-2 rounded-[15px] bg-[#2E7D32] text-white text-[14px] font-medium hover:bg-[#1b5e20] transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? "Resolving..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show resolve button
    return (
        <div className="flex flex-col items-center gap-2.5 justify-center w-full">
            {/* Text */}
            <p className="text-[16px] text-black text-center font-['Poppins',sans-serif] font-medium">
                Has this problem been solved?
            </p>

            {/* Mark as Resolved button */}
            <button
                type="button"
                onClick={handleResolveRequest}
                disabled={isLoading || isProcessing}
                className="w-full bg-[#f49b31] hover:bg-[#e08922] py-3 px-6 rounded-full cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xs"
            >
                <span className="font-['Baloo_Bhai_2',sans-serif] font-extrabold text-white text-[17px] tracking-wide uppercase text-center whitespace-nowrap">
                    {isLoading || isProcessing ? "RESOLVING..." : "MARK AS RESOLVED"}
                </span>
            </button>
        </div>
    );
};

export default MarkAsResolvedBar;
