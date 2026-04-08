import { useState, useEffect } from "react";
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
    onCancel,
}: Props) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userPreferences, setUserPreferences] = useState<UserPreference | null>(null);

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

    const handleCancel = () => {
        setContent("");
        setError(null);
        onCancel?.();
    };

    return (
        <div className="flex flex-col gap-3.5 rounded-[10px] w-full">
            <div className=" flex gap-2.5 items-start p-4 rounded-[10px]">

                {/* User info */}
                <div className="flex items-center">
                    {/* Avatar */}
                    <UserAvatar user={user} size="md" bgColor="bg-[#f49b31]" />
                </div>
                <div className="flex flex-col w-full gap-2">

                    {/* Text input */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What do you have to say?"
                        className="w-full min-h-[100px] p-4 rounded-[10px] bg-[#FFF7E8] border border-[#F49B31] text-sm text-[#292936] placeholder:text-[#9191A8] resize-none focus:outline-none focus:ring-2 focus:ring-[#F49B31] focus:border-transparent"
                        disabled={isSubmitting}
                    />
                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim()}
                            className="bg-[#F49B31] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d88429] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Posting..." : "Reply"}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="text-[#63637B] text-base hover:text-[#292936] transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

        </div>
    );
};

export default CommentInput;
