import React, { useState } from "react";

export type TakeActionType = "WARN" | "SUSPEND" | "BAN";
export type SuspendDuration = "1_DAY" | "1_WEEK" | "1_MONTH";

interface BaseModalProps {
    title: string;
    description: string;
    confirmText: string;
    onConfirm: (deletePost: boolean) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ActionConfirmModal: React.FC<BaseModalProps> = ({
    title,
    description,
    confirmText,
    onConfirm,
    onCancel,
    isLoading = false
}) => {
    const [deletePost, setDeletePost] = useState(false);

    return (
        <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
            <div className="bg-white flex flex-col gap-4 items-start justify-center overflow-hidden px-[15px] py-5 rounded-[20px] w-[330px] md:p-6 md:rounded-[30px] md:w-[477px]">
                <div className="flex flex-col gap-2.5 md:gap-[15px] items-start w-full">
                    <p className="font-semibold leading-[1.46] text-[#282828] text-center w-full text-[20px] md:text-[26px]">
                        {title}
                    </p>
                    <p className="font-poppins text-[#282828] text-center w-full text-[13px] leading-normal md:text-[16px] md:leading-[26px]">
                        {description}
                    </p>
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="deletePost"
                        checked={deletePost}
                        onChange={(e) => setDeletePost(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#f49b31] focus:ring-[#f49b31]"
                    />
                    <label htmlFor="deletePost" className="text-[13px] md:text-[15px] font-medium text-black">
                        Delete post
                    </label>
                </div>

                <div className="flex flex-col gap-[5px] md:gap-2.5 items-start w-full mt-2">
                    <button
                        onClick={() => onConfirm(deletePost)}
                        disabled={isLoading}
                        className="bg-[#b01212] flex gap-2 items-center justify-center rounded-lg w-full text-white font-medium tracking-[-0.2px] px-5 py-2 text-[12px] leading-7 md:px-7 md:py-3 md:text-[16px] hover:bg-[#8e0f0f] transition-colors duration-200 disabled:opacity-60"
                    >
                        {isLoading ? "Loading..." : confirmText}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex items-center justify-center rounded-lg w-full font-medium tracking-[-0.2px] underline text-[12px] leading-7 text-black md:text-[16px] hover:opacity-70 transition-opacity duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

interface SuspendDurationModalProps {
    onConfirm: (duration: SuspendDuration, deletePost: boolean) => void;
    onCancel: () => void;
    isLoading?: boolean;
    initialDeletePost: boolean;
}

export const SuspendDurationModal: React.FC<SuspendDurationModalProps> = ({
    onConfirm,
    onCancel,
    isLoading = false,
    initialDeletePost
}) => {
    const [duration, setDuration] = useState<SuspendDuration>("1_DAY");
    const [deletePost, setDeletePost] = useState(initialDeletePost);

    return (
        <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
            <div className="bg-white flex flex-col gap-4 items-start justify-center overflow-hidden px-[15px] py-5 rounded-[20px] w-[330px] md:p-6 md:rounded-[30px] md:w-[477px]">
                <div className="flex flex-col gap-2.5 md:gap-[15px] items-start w-full">
                    <p className="font-semibold leading-[1.46] text-[#282828] text-center w-full text-[20px] md:text-[26px]">
                        For how long?
                    </p>
                    <p className="font-poppins text-[#282828] text-center w-full text-[13px] leading-normal md:text-[16px] md:leading-[26px]">
                        Select the duration for the account suspension.
                    </p>
                </div>

                <select
                    className="flex flex-col gap-2 w-full mt-2 border rounded-lg p-5 bg-[#FEF5EA] border-[#f49b31]"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as SuspendDuration)}
                >
                    <option className="flex items-center gap-2 cursor-pointer" value="1_DAY">
                        <span className="text-[14px] md:text-[16px] font-medium text-[#282828]">24 Hours</span>
                    </option>
                    <option className="flex items-center gap-2 cursor-pointer" value="1_WEEK">
                        <span className="text-[14px] md:text-[16px] font-medium text-[#282828]">1 Week</span>
                    </option>
                    <option className="flex items-center gap-2 cursor-pointer" value="1_MONTH">
                        <span className="text-[14px] md:text-[16px] font-medium text-[#282828]">1 Month</span>
                    </option>
                </select>


                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="deletePostDuration"
                        checked={deletePost}
                        onChange={(e) => setDeletePost(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#f49b31] focus:ring-[#f49b31]"
                    />
                    <label htmlFor="deletePostDuration" className="text-[13px] md:text-[15px] font-medium text-black">
                        Delete post
                    </label>
                </div>

                <div className="flex flex-col gap-[5px] md:gap-2.5 items-start w-full mt-4">
                    <button
                        onClick={() => onConfirm(duration, deletePost)}
                        disabled={isLoading}
                        className="bg-[#f49b31] flex gap-2 items-center justify-center rounded-lg w-full text-white font-medium tracking-[-0.2px] px-5 py-2 text-[12px] leading-7 md:px-7 md:py-3 md:text-[16px] hover:bg-[#e68a1f] transition-colors duration-200 disabled:opacity-60"
                    >
                        {isLoading ? "Loading..." : "Confirm"}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex items-center justify-center rounded-lg w-full font-medium tracking-[-0.2px] underline text-[12px] leading-7 text-black md:text-[16px] hover:opacity-70 transition-opacity duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export const WarnModal: React.FC<Omit<BaseModalProps, "title" | "description" | "confirmText">> = (props) => (
    <ActionConfirmModal
        title="Do you want to warn?"
        description="The account will receive a warning."
        confirmText="Warn Account"
        {...props}
    />
);

export const BanModal: React.FC<Omit<BaseModalProps, "title" | "description" | "confirmText">> = (props) => (
    <ActionConfirmModal
        title="Do you want to ban?"
        description="The account will be permanently banned from the platform."
        confirmText="Ban Account"
        {...props}
    />
);

export const SuspendConfirmModal: React.FC<Omit<BaseModalProps, "title" | "description" | "confirmText">> = (props) => (
    <ActionConfirmModal
        title="Do you want to suspend?"
        description="The account will be suspended. You will choose the duration next."
        confirmText="Continue"
        {...props}
    />
);
