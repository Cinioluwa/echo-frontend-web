/**
 * DeleteConfirmationModal
 * Figma ref: 3878:9256 (desktop), 4162:11461 (mobile)
 * Phase: 5
 */

interface DeleteConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    itemType?: "Ping" | "Wave" | "Comment";
}

const DeleteConfirmationModal = ({
    onConfirm,
    onCancel,
    isLoading = false,
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
                                    stroke="#B01212"
                                    strokeOpacity="0.4"
                                />
                                <path
                                    d="M21 11H10M13 11V9.5C13 9.10218 13.158 8.72064 13.4393 8.43934C13.7206 8.15804 14.1022 8 14.5 8H16.5C16.8978 8 17.2794 8.15804 17.5607 8.43934C17.842 8.72064 18 9.10218 18 9.5V11M12 14L12.5 22M19 14L18.5 22M15.5 14V22M10 11L11 23.5C11 23.8978 11.158 24.2794 11.4393 24.5607C11.7206 24.842 12.1022 25 12.5 25H18.5C18.8978 25 19.2794 24.842 19.5607 24.5607C19.842 24.2794 20 23.8978 20 23.5L21 11"
                                    stroke="#B01212"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
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
