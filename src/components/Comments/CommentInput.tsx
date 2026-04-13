import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../stores";
import { commentService } from "../../api/services";
import userService from "../../api/services/user.service";
import type { UserPreference } from "../../api/types";
import UserAvatar from "../UserAvatar";

interface Props {
    targetType: "ping" | "wave";
    targetId: string;
    parentCommentId?: string;
    onCommentAdded?: () => void;
    onCancel?: () => void;
}

const CommentInput = ({
    targetType,
    targetId,
    parentCommentId: _parentCommentId,
    onCommentAdded,
}: Props) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userPreferences, setUserPreferences] = useState<UserPreference | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { user } = useAuthStore();

    // Fetch user preferences on mount
    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const preferences = await userService.getMyPreferences();
                setUserPreferences(preferences);
            } catch (err) {
                console.error("Failed to fetch user preferences:", err);
            }
        };

        fetchPreferences();
    }, []);

    // Close input when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsFocused(false);
            }
        };

        if (isFocused) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isFocused]);

    const handleSubmit = async () => {
        if (!content.trim()) {
            setError("Comment cannot be empty");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Use the preference setting to determine if comment should be anonymous
            const isAnonymous = userPreferences?.commentAnonymously ?? false;

            // Use the correct API endpoints that match the documentation
            if (targetType === "ping") {
                await commentService.createCommentOnPing(targetId, content.trim(), isAnonymous);
            } else {
                await commentService.createCommentOnWave(targetId, content.trim(), isAnonymous);
            }

            // Success - clear input and notify parent
            setContent("");
            onCommentAdded?.();
        } catch (err) {
            console.error("Failed to post comment:", err);
            setError("Failed to post comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="bg-none md:bg-[#f49b31] flex gap-2 items-start px-[15px] py-2.5 rounded-bl-[15px] rounded-br-[15px] w-full" data-node-id="4790:11755" ref={containerRef}>
            {/* Avatar */}
            <div className="flex items-center shrink-0" data-node-id="4790:11756">
                <div className="size-[30px]" data-node-id="4790:11757">
                    <UserAvatar
                        user={user}
                        size="sm"
                        bgColor="bg-[#f49b31]"
                    />
                </div>
            </div>

            {/* Input field container */}
            <div className="flex-1" ref={containerRef}>
                {!isFocused ? (
                    /* Default state - button */
                    <button
                        onClick={() => setIsFocused(true)}
                        className="bg-white flex h-[30px] items-center px-2.5 rounded-[30px] w-full cursor-pointer hover:bg-gray-50 transition-colors"
                        data-node-id="5210:15041"
                    >
                        <div className="text-[#626665] text-[9px] font-['Poppins',sans-serif] font-normal">
                            What do you have to say?
                        </div>
                    </button>
                ) : (
                    /* Active state - textarea with button */
                    <div className="bg-white flex flex-col gap-[5px] items-end justify-end h-[46px] pl-2.5 pr-[5px] py-[5px] rounded-[12.5px]" data-node-id="5210:15043">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What do you have to say?"
                            autoFocus
                            className="w-full flex-1 p-0 text-sm text-[#292936] placeholder:text-[#626665] resize-none focus:outline-none font-['Poppins',sans-serif] bg-transparent text-[9px]"
                            disabled={isSubmitting}
                        />

                        {/* Comment button - right aligned */}
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim()}
                            className="bg-[#f49b31] flex items-center justify-center px-[5px] py-[2.5px] rounded-[15px] text-white text-[8px] font-['Poppins',sans-serif] font-medium hover:bg-[#d88429] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-[52px] shrink-0"
                            data-node-id="5210:15071"
                        >
                            {isSubmitting ? "..." : "Comment"}
                        </button>
                    </div>
                )}
                {/* Error message */}
                {error && (
                    <p className="text-xs text-red-500 px-[5px] w-full mt-1">{error}</p>
                )}
            </div>
        </div>
    );
};

export default CommentInput;
