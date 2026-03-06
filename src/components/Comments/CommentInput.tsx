import { useState } from "react";
import { useAuthStore } from "../../stores";
import { commentService } from "../../api/services";

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

    const { user } = useAuthStore();

    const handleSubmit = async () => {
        if (!content.trim()) {
            setError("Comment cannot be empty");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Use the correct API endpoints that match the documentation
            if (targetType === "ping") {
                await commentService.createCommentOnPing(targetId, content.trim());
            } else {
                await commentService.createCommentOnWave(targetId, content.trim());
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

    const userName = user
        ? `${user.firstName} ${user.lastName}`
        : "Anonymous User";

    return (
        <div className="bg-[#FFF7E8] flex flex-col gap-3.5 p-[15px] rounded-[10px] w-full">
            {/* User info */}
            <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-semibold">
                        {userName.charAt(0).toUpperCase()}
                    </span>
                </div>
                <p className="text-sm font-semibold text-[#63637B]">{userName}</p>
            </div>

            {/* Text input */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Give an official comment..."
                className="w-full min-h-[100px] p-4 rounded-[10px] border border-[#E7E7EF] text-sm text-[#292936] placeholder:text-[#9191A8] resize-none focus:outline-none focus:ring-2 focus:ring-[#F49B31] focus:border-transparent"
                disabled={isSubmitting}
            />

            {/* Error message */}
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

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
    );
};

export default CommentInput;
