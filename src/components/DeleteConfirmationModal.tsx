/**
 * DeleteConfirmationModal
 * Figma ref: 3878:9256 (desktop), 4162:11461 (mobile)
 * Phase: 5
 */

import { Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    errorMessage?: string | null;
    itemType?: "Ping" | "Wave" | "Comment" | "Category" | "College" | "Department" | "Body";
}

const DeleteConfirmationModal = ({
    onConfirm,
    onCancel,
    isLoading = false,
    errorMessage,
    itemType = "Ping",
}: DeleteConfirmationModalProps) => {
    return (
        <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
            {/* Desktop: 477×333, Mobile: 330×279 */}
            <div className="bg-white flex flex-col gap-[15px] items-end justify-center overflow-hidden
        px-[15px] py-5 rounded-[20px] w-[330px]
        md:p-6 md:rounded-[30px] md:w-[477px]">

                {/* Title section */}
                <div className="flex flex-col gap-2.5 md:gap-[15px] items-start w-full">
                    <div className="flex flex-col gap-[5px] items-center justify-center w-full">
                        {/* Trash icon */}
                        <div className="w-[31px] h-8 flex items-center justify-center">
                            <Trash2 width={20} height={20} className="text-[#b01212]" />
                        </div>

                        {/* Title */}
                        <p className="font-semibold leading-[1.46] text-[#282828] text-center w-full
              text-[20px] md:text-[26px]">
                            Are you sure you want to delete?
                        </p>
                    </div>

                    {/* Warning text */}
                    <p className="font-poppins text-[#282828] text-center w-full
            text-[13px] leading-normal md:text-[16px] md:leading-[26px]">
                        {`The `}
                        <span className="font-semibold text-[#f49b31]">{itemType}</span>
                        {` would be deleted permanently. Action cannot be reverted`}
                    </p>
                    {errorMessage && (
                        <p role="alert" className="w-full rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700">
                            {errorMessage}
                        </p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-[5px] md:gap-2.5 items-start w-full">
                    {/* Delete button */}
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-[#b01212] flex gap-2 items-center justify-center
              rounded-lg w-full text-white font-medium tracking-[-0.2px]
              px-5 py-2 text-[12px] leading-7
              md:px-7 md:py-3 md:text-[16px]
              hover:bg-[#8e0f0f] transition-colors duration-200 disabled:opacity-60"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>

                    {/* Cancel button */}
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex items-center justify-center rounded-lg w-full
              font-medium tracking-[-0.2px] underline
              text-[12px] leading-7 text-black
              md:text-[16px]
              hover:opacity-70 transition-opacity duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
