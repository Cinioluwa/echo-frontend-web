import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import type { Ping } from "../../api/types";
import PingHeader from "./PingHeader";
import PingContent from "./PingContent";
import CommentInput from "./CommentInput";
import CommentsList, { type CommentsListHandle } from "./CommentsList";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ping: Ping;
    onCommentAdded?: () => void;
}

const CommentModal = ({ isOpen, onClose, ping, onCommentAdded }: Props) => {
    const commentsListRef = useRef<CommentsListHandle>(null);

    const handleCommentAdded = () => {
        // Refresh the comments list to show the new comment
        commentsListRef.current?.refresh();
        // Notify parent to refresh ping data (updates comment count)
        onCommentAdded?.();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-5 rounded-4xl flex flex-col gap-[15px] max-w-[800px] w-full max-h-[90vh] overflow-hidden mx-4"
                    >
                        {/* Header with close button */}
                        <PingHeader
                            authorName={
                                ping.author
                                    ? typeof ping.author === "string"
                                        ? ping.author
                                        : `${ping.author.firstName} ${ping.author.lastName}`
                                    : "Anonymous"
                            }
                            timestamp={ping.createdAt}
                            onClose={onClose}
                        />

                        {/* Scrollable content area */}
                        <div className="flex flex-col gap-[15px] overflow-y-auto pr-2">
                            {/* Ping content */}
                            <PingContent title={ping.title} description={ping.content} />

                            {/* Comment Input */}
                            <CommentInput
                                targetType="ping"
                                targetId={ping.id.toString()}
                                onCommentAdded={handleCommentAdded}
                            />

                            {/* Comments List */}
                            <CommentsList
                                ref={commentsListRef}
                                targetType="ping"
                                targetId={ping.id.toString()}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CommentModal;
