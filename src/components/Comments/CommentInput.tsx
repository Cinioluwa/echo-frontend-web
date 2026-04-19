import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../stores";
import { commentService } from "../../api/services";
import userService from "../../api/services/user.service";
import type { UserPreference, Comment } from "../../api/types";
import UserAvatar from "../UserAvatar";
import { checkContent } from "../../utils/contentModeration";
import { getErrorMessage } from "../../utils/networkUtils";

interface Props {
    targetType: "ping" | "wave";
    targetId: string;
    parentCommentId?: string;
    onCommentAdded?: (comment: Comment) => void;
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
            setError("Enter a comment before posting.");
            return;
        }

        // Content moderation check
        const moderation = checkContent(content);
        if (!moderation.passed) {
            setError(moderation.reason);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Use the preference setting to determine if comment should be anonymous
            const isAnonymous = userPreferences?.commentAnonymously ?? false;

            // Use the correct API endpoints that match the documentation
            let createdComment;
            if (targetType === "ping") {
                createdComment = await commentService.createCommentOnPing(targetId, content.trim(), isAnonymous);
            } else {
                createdComment = await commentService.createCommentOnWave(targetId, content.trim(), isAnonymous);
            }

            // Success - clear input and notify parent with the new comment
            setContent("");
            onCommentAdded?.(createdComment);
            setIsFocused(false);
        } catch (err) {
            console.error("Failed to post comment:", err);
            setError(getErrorMessage(err));
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
            <div className="flex-1">
                {!isFocused ? (
                    /* Default state - button */
                    <button
                        onClick={() => setIsFocused(true)}
                        className="bg-white flex h-[32px] md:h-[30px] items-center px-2.5 rounded-[30px] w-full cursor-pointer hover:bg-gray-50 transition-colors"
                        data-node-id="5210:15041"
                    >
                        <div className="text-[#626665] text-[12px] font-['Poppins',sans-serif] font-normal">
                            What do you have to say?
                        </div>
                    </button>
                ) : (
                    /* Active state - textarea with button */
                    <div className="bg-white flex flex-col gap-2 items-stretch justify-between min-h-[74px] md:min-h-[60px] px-2.5 py-2 rounded-[12.5px] transition-all duration-200" data-node-id="5210:15043">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What do you have to say?"
                            autoFocus
                            className="w-full flex-1 p-0 text-[12px] text-[#292936] placeholder:text-[#626665] resize-none focus:outline-none font-['Poppins',sans-serif] bg-transparent min-h-[34px] md:min-h-[30px]"
                            disabled={isSubmitting}
                        />

                        {/* Comment button - right aligned */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim()}
                            className="self-end bg-[#f49b31] inline-flex items-center justify-center px-2.5 py-1 rounded-[16px] text-white text-[11px] font-['Poppins',sans-serif] font-medium leading-none hover:bg-[#d88429] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[64px] md:min-w-[58px] shrink-0"
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
