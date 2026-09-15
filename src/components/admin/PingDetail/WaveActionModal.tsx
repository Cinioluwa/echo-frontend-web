import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface WaveActionModalProps {
    action: "APPROVED" | "REJECTED" | "UNDER_REVIEW";
    onConfirm: (reason?: string) => Promise<void>;
    onCancel: () => void;
}

const WaveActionModal: React.FC<WaveActionModalProps> = ({ action, onConfirm, onCancel }) => {
    const [reason, setReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Auto close on success
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                onCancel();
            }, 1800);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, onCancel]);

    const handleConfirm = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await onConfirm(action === "REJECTED" ? reason : undefined);
            setIsSuccess(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to update wave status. Please try again.");
            setIsLoading(false);
        }
    };

    // Render Success State
    if (isSuccess) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in font-poppins">
                <div className="bg-white rounded-[32px] w-[min(530px,calc(100vw-32px))] p-8 sm:p-10 flex flex-col items-center justify-center gap-6 animate-scale-in">
                    {action === "APPROVED" && (
                        <>
                            <img src="/assets/figma/admin/approve-success.svg" alt="" className="w-[114px] h-[114px]" />
                            <h3 className="font-poppins font-semibold text-[28px] text-black text-center">
                                Approved!
                            </h3>
                        </>
                    )}

                    {action === "UNDER_REVIEW" && (
                        <>
                            <img src="/assets/figma/admin/approve-success.svg" alt="" className="w-[114px] h-[114px]" />
                            <h3 className="font-bold text-[24px] text-black text-center tracking-tight">
                                Under Review!
                            </h3>
                        </>
                    )}

                    {action === "REJECTED" && (
                        <>
                            <img src="/assets/figma/admin/rejected.svg" alt="" className="w-[114px] h-[114px]" />
                            <h3 className="font-poppins font-semibold text-[28px] text-black text-center">
                                Rejected
                            </h3>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Render Confirmation Forms
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in font-poppins">
            <div className="bg-white rounded-[32px] w-[min(530px,calc(100vw-32px))] px-8 sm:px-10 py-10 flex flex-col items-center gap-6 animate-scale-in relative">
                {error && (
                    <div className="absolute top-4 left-4 right-4 bg-red-50 text-red-600 text-xs p-2 rounded-lg text-center font-medium border border-red-100">
                        {error}
                    </div>
                )}

                {/* APPROVED Action */}
                {action === "APPROVED" && (
                    <>
                        <img src="/assets/figma/admin/approve-warning.svg" alt="" className="w-[114px] h-[114px]" />
                        
                        <h3 className="font-poppins font-semibold text-[28px] text-center text-[#282828] leading-[normal]">
                            Do you want to Approve this wave?
                        </h3>

                        <div className="flex gap-4 w-full mt-2">
                            <button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className="flex-1 py-3 bg-[#f49b31] hover:bg-[#e68a1f] text-white font-medium text-[18px] rounded-[17px] transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes"}
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="flex-1 py-3 border-2 border-[#f49b31] text-[#f49b31] bg-[#fef5ea] hover:bg-white font-medium text-[18px] rounded-[17px] transition-colors disabled:opacity-50"
                            >
                                No
                            </button>
                        </div>
                    </>
                )}

                {/* UNDER_REVIEW Action */}
                {action === "UNDER_REVIEW" && (
                    <>
                        <img src="/assets/figma/admin/approve-warning.svg" alt="" className="w-[114px] h-[114px]" />
                        
                        <h3 className="font-poppins font-semibold text-[28px] text-center text-[#282828] leading-[normal]">
                            Do you want to put this wave Under Review?
                        </h3>

                        <div className="flex gap-4 w-full mt-2">
                            <button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className="flex-1 py-3 bg-[#f49b31] hover:bg-[#e68a1f] text-white font-bold text-[16px] rounded-[15px] transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes"}
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="flex-1 py-3 border-2 border-[#f49b31] text-[#f49b31] bg-transparent hover:bg-[#fef5ea] font-bold text-[16px] rounded-[15px] transition-all duration-200 active:scale-95 disabled:opacity-50"
                            >
                                No
                            </button>
                        </div>
                    </>
                )}

                {/* REJECTED Action */}
                {action === "REJECTED" && (
                    <>
                        <h3 className="font-poppins font-semibold text-[28px] text-center text-[#282828]">
                            Why is it being Rejected?
                        </h3>

                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="What's the reason behind the rejection?"
                            disabled={isLoading}
                            className="w-full h-[74px] border border-[#626665] rounded-[10px] p-3 text-[12px] font-normal text-black placeholder-[#626665] outline-none focus:border-[#b01212] transition-colors resize-none disabled:bg-gray-50"
                        />

                        <div className="flex flex-col items-center gap-4 w-full mt-2">
                            <button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className="w-full py-3 bg-[#b01212] hover:bg-[#8e0f0f] text-white font-medium text-[18px] rounded-[17px] transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reject"}
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="font-medium text-[18px] text-black underline hover:text-[#626665] transition-colors cursor-pointer"
                            >
                                Don't reject
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WaveActionModal;
