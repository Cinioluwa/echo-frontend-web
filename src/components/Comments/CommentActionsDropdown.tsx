import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Flag, Trash2, MoreVertical } from "lucide-react";
import Toast from "../shared/Toast";
import ReportModal from "../shared/ReportModal";
import { buildCommentShareUrl } from "../../utils/shareUrl";

interface CommentActionsDropdownProps {
    commentId: number | string;
    isOwner: boolean;
    canEdit?: boolean;
    onEdit?: () => void;
    onDelete: () => void;
}

const CommentActionsDropdown = ({
    commentId,
    isOwner,
    canEdit,
    onEdit,
    onDelete,
}: CommentActionsDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [showReportToast, setShowReportToast] = useState(false);
    const [showCopyToast, setShowCopyToast] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuItemClass =
        "w-full flex gap-2.5 items-center py-2 px-2.5 hover:bg-gray-50 rounded-[8px] transition-colors text-left cursor-pointer";
    const menuLabelClass =
        "font-['Poppins',sans-serif] font-medium text-[13px] leading-[1.2] text-black whitespace-nowrap";

    // Memoized so the effect below can list it as a dependency without
    // re-subscribing on every render.
    const updatePosition = useCallback(() => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const menuWidth = 172;
        const menuHeight = isOwner ? 140 : 100;

        // Check if there is enough space below, else flip upwards
        const spaceBelow = window.innerHeight - rect.bottom;
        const shouldOpenUp = spaceBelow < menuHeight && rect.top > menuHeight;

        const top = shouldOpenUp ? rect.top - menuHeight - 6 : rect.bottom + 6;
        const left = Math.max(12, Math.min(window.innerWidth - menuWidth - 12, rect.right - menuWidth));

        setCoords({ top, left });
    }, [isOwner]);

    // Close dropdown when clicking outside or scrolling
    useEffect(() => {
        if (!isOpen) return;

        updatePosition();

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        const handleScrollOrResize = () => {
            setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScrollOrResize, true);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [isOpen, updatePosition]);

    const handleCopyLink = (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = buildCommentShareUrl(Number(commentId));
        navigator.clipboard.writeText(url);
        setIsOpen(false);
        setShowCopyToast(true);
    };

    const handleReport = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        setIsReportModalOpen(true);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {showCopyToast && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Toast
                        variant="copied"
                        duration={2000}
                        onDismiss={() => setShowCopyToast(false)}
                    />
                </div>
            )}
            {showReportToast && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Toast
                        variant="reported"
                        duration={2500}
                        onDismiss={() => setShowReportToast(false)}
                    />
                </div>
            )}
            {/* Vertical ellipsis button */}
            <button
                ref={buttonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                aria-label="More actions"
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#FFC37BAB] transition-colors cursor-pointer"
            >
                <MoreVertical
                    width={16}
                    height={16}
                    className="text-[#4A504E]"
                />
            </button>

            {/* Dropdown menu rendered via Portal so it displays OVER EVERYTHING */}
            {isOpen && coords && createPortal(
                <AnimatePresence>
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12 }}
                        style={{
                            position: "fixed",
                            top: `${coords.top}px`,
                            left: `${coords.left}px`,
                            zIndex: 99999,
                        }}
                        className="bg-white rounded-[10px] shadow-[0px_8px_24px_rgba(0,0,0,0.18)] border border-[#eaeaea] py-1.5 px-1.5 min-w-[172px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Copy link */}
                        <button
                            onClick={handleCopyLink}
                            className={menuItemClass}
                        >
                            <Link2 width={17} height={17} className="text-black shrink-0" />
                            <span className={menuLabelClass}>
                                Copy link
                            </span>
                        </button>

                        {/* Report */}
                        <button
                            onClick={handleReport}
                            className={`${menuItemClass} mt-0.5`}
                        >
                            <Flag width={17} height={17} className="text-black shrink-0" />
                            <span className={menuLabelClass}>
                                Report
                            </span>
                        </button>

                        {/* Edit - if within time window */}
                        {canEdit && onEdit && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                    setIsOpen(false);
                                }}
                                className={`${menuItemClass} mt-0.5`}
                            >
                                <svg
                                    width="17"
                                    height="17"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-black shrink-0"
                                >
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                                <span className={menuLabelClass}>
                                    Edit
                                </span>
                            </button>
                        )}

                        {/* Delete - only if owner */}
                        {isOwner && (
                            <button
                                onClick={handleDelete}
                                className={`${menuItemClass} mt-0.5 hover:bg-red-50 text-red-500`}
                            >
                                <Trash2
                                    width={17}
                                    height={17}
                                    className="text-red-500 shrink-0"
                                />
                                <span className="font-['Poppins',sans-serif] font-medium text-[13px] leading-[1.2] text-red-500 whitespace-nowrap">
                                    Delete
                                </span>
                            </button>
                        )}
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                entityType="comment"
                entityId={Number(commentId)}
                onSuccess={() => setShowReportToast(true)}
            />
        </div>
    );
};

export default CommentActionsDropdown;
