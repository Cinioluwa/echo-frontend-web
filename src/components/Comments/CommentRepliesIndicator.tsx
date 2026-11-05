interface Props {
    replyCount: number;
    commentId: string;
}

const CommentRepliesIndicator = ({ replyCount }: Props) => {
    // TODO: Implement click handler to view replies
    const handleViewReplies = () => {
        console.log("View replies functionality to be implemented");
    };

    return (
        <div className="flex items-center gap-2 py-2 border-t border-[#E7E7EF]">
            {/* Reply avatars - show up to 3 overlapping circles */}
            <div className="flex items-center -space-x-2">
                {/* First avatar */}
                <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white overflow-hidden"></div>

                {/* Second avatar (only if 2+ replies) */}
                {replyCount >= 2 && (
                    <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-white overflow-hidden"></div>
                )}

                {/* Third avatar (only if 3+ replies) */}
                {replyCount >= 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-white overflow-hidden"></div>
                )}
            </div>

            {/* Reply count text */}
            <button
                onClick={handleViewReplies}
                className="text-sm font-medium text-[#63637B] hover:text-[#292936] transition-colors"
            >
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
            </button>
        </div>
    );
};

export default CommentRepliesIndicator;
