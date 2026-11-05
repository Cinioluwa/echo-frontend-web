import React, { useState, useEffect } from "react";
import { Check, X, Loader2 } from "lucide-react";

interface WaveActionModalProps {
    action: "APPROVED" | "REJECTED" | "UNDER_REVIEW" | "IN_PROGRESS" | "COMPLETED";
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
        if (action === "REJECTED" && !reason.trim()) {
            setError("A reason is required to reject a wave.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await onConfirm(action === "REJECTED" ? reason : undefined);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err?.message || "Failed to update wave status. Please try again.");
            setIsLoading(false);
        }
    };

    // Render Success State
    if (isSuccess) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in font-poppins">
                <div className="bg-white rounded-[30px] w-[350px] p-8 flex flex-col items-center justify-center gap-6 shadow-2xl animate-scale-in">
                    {(action === "IN_PROGRESS" || action === "COMPLETED") && (
                        <>
                            <div className="w-[80px] h-[80px] rounded-full border-[4px] border-[#f49b31] flex items-center justify-center animate-bounce-subtle">
                                <Check className="w-10 h-10 text-[#f49b31]" strokeWidth={3.5} />
                            </div>
                            <h3 className="font-bold text-[24px] text-black text-center tracking-tight">
                                {action === "COMPLETED" ? "Completed!" : "In Progress!"}
                            </h3>
                        </>
                    )}
                    {action === "APPROVED" && (
                        <>
                            <div className="w-[80px] h-[80px] rounded-full border-[4px] border-[#f49b31] flex items-center justify-center animate-bounce-subtle">
                                <Check className="w-10 h-10 text-[#f49b31]" strokeWidth={3.5} />
                            </div>
                            <h3 className="font-bold text-[24px] text-black text-center tracking-tight">
                                Approved!
                            </h3>
                        </>
                    )}

                    {action === "UNDER_REVIEW" && (
                        <>
                            <div className="w-[80px] h-[80px] rounded-full border-[4px] border-[#f49b31] flex items-center justify-center animate-bounce-subtle">
                                <Check className="w-10 h-10 text-[#f49b31]" strokeWidth={3.5} />
                            </div>
                            <h3 className="font-bold text-[24px] text-black text-center tracking-tight">
                                Under Review!
                            </h3>
                        </>
                    )}

                    {action === "REJECTED" && (
                        <>
                            <div className="w-[80px] h-[80px] rounded-full bg-[#eb5050] flex items-center justify-center animate-bounce-subtle shadow-md">
                                <X className="w-10 h-10 text-white" strokeWidth={3.5} />
                            </div>
                            <h3 className="font-bold text-[24px] text-black text-center tracking-tight">
                                Rejected!
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
            <div className="bg-white rounded-[30px] w-[350px] p-8 flex flex-col items-center gap-6 shadow-2xl animate-scale-in relative">
                {error && (
                    <div className="absolute top-4 left-4 right-4 bg-red-50 text-red-600 text-xs p-2 rounded-lg text-center font-medium border border-red-100">
                        {error}
                    </div>
                )}

                {(action === "IN_PROGRESS" || action === "COMPLETED") && (
                    <>
                        <div className="w-[80px] h-[80px] rounded-full border-[4px] border-[#f49b31] flex items-center justify-center">
                            <span className="text-[#f49b31] font-bold text-[48px] leading-none -mt-1 font-sans">!</span>
                        </div>

                        <h3 className="font-bold text-[20px] text-center text-[#282828] leading-[26px]">
                            {action === "COMPLETED"
                                ? "Mark this wave as Completed?"
                                : "Mark this wave as In Progress?"}
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
                {/* APPROVED Action */}
                {action === "APPROVED" && (
                    <>
                        <div className="w-[80px] h-[80px] rounded-full border-[4px] border-[#f49b31] flex items-center justify-center">
                            <span className="text-[#f49b31] font-bold text-[48px] leading-none -mt-1 font-sans">!</span>
                        </div>
                        
                        <h3 className="font-bold text-[20px] text-center text-[#282828] leading-[26px]">
                            Do you want to Approve this wave?
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

                {/* UNDER_REVIEW Action */}
                {action === "UNDER_REVIEW" && (
                    <>
                        <div className="w-[80px] h-[80px] rounded-full border-[4px] border-[#f49b31] flex items-center justify-center">
                            <span className="text-[#f49b31] font-bold text-[48px] leading-none -mt-1 font-sans">!</span>
                        </div>
                        
                        <h3 className="font-bold text-[20px] text-center text-[#282828] leading-[26px]">
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
                        <h3 className="font-bold text-[24px] text-center text-[#282828]">
                            Why is it being Rejected?
                        </h3>

                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="What's the reason behind the rejection?"
                            disabled={isLoading}
                            className="w-full h-[100px] border border-[#a2a2a2] rounded-[10px] p-3 text-[14px] font-medium text-black placeholder-[#626665] outline-none focus:border-[#eb5050] transition-colors resize-none disabled:bg-gray-50"
                        />
                        <p className="w-full -mt-4 text-left text-xs text-[#b01212]">
                            {error || "A reason is required to reject a wave."}
                        </p>

                        <div className="flex flex-col items-center gap-4 w-full mt-2">
                            <button
                                onClick={handleConfirm}
                                disabled={isLoading || !reason.trim()}
                                className="w-full py-3 bg-[#b01212] hover:bg-[#8e0f0f] text-white font-bold text-[16px] rounded-[15px] transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center shadow-md"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reject"}
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="font-bold text-[16px] text-black underline hover:text-[#626665] transition-colors cursor-pointer"
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
