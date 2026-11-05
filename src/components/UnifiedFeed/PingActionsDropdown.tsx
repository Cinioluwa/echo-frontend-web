/**
 * PingActionsDropdown
 * Figma ref: 5139:13937
 * Phase: 2
 *
 * Dropdown menu showing: Copy link, Report, Delete (owner only)
 * Opens on click of vertical ellipsis button
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Flag, Trash2, MoreVertical } from "lucide-react";
import Toast from "../shared/Toast";
import ReportModal from '../shared/ReportModal';
import { buildPingShareUrl } from "../../utils/shareUrl";

interface PingActionsDropdownProps {
    pingId: number;
    isOwner: boolean;
    canEdit?: boolean;
    onEdit?: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}

const PingActionsDropdown = ({
    pingId,
    isOwner,
    canEdit,
    onEdit,
    onDelete,
}: PingActionsDropdownProps) => {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [showReportToast, setShowReportToast] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showCopyToast, setShowCopyToast] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuItemClass =
        "w-full flex gap-2.5 items-center py-1.5 px-2 hover:bg-gray-50 rounded-[6px] transition-colors text-left";
    const menuLabelClass =
        "font-['Poppins',sans-serif] font-medium text-[13px] leading-[1.2] text-black whitespace-nowrap";

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen]);

    const handleCopyLink = (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = buildPingShareUrl(pingId);
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
        onDelete(e);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
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
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label="More actions"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FFC37BAB] transition-colors cursor-pointer"
            >
                <motion.div
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <MoreVertical
                        width={21}
                        height={21}
                        className={isHovered ? "text-black" : "text-[#4A504E]"}
                    />
                </motion.div>
            </button>

            {/* Dropdown menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] py-2 px-2 min-w-[172px] z-50"
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
                            className={`${menuItemClass} mt-1`}
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
                                    onEdit(e);
                                    setIsOpen(false);
                                }}
                                className={`${menuItemClass} mt-1`}
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
                                className={`${menuItemClass} mt-1 hover:bg-red-50`}
                            >
                                <Trash2
                                    width={17}
                                    height={17}
                                    className="text-red-500 shrink-0"
                                />
                                <span className={menuLabelClass}>
                                    Delete
                                </span>
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                entityType="ping"
                entityId={pingId}
                onSuccess={() => setShowReportToast(true)}
            />
        </div>
    );
};

export default PingActionsDropdown;
