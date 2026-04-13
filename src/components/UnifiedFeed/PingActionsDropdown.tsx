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

interface PingActionsDropdownProps {
    pingId: number;
    isOwner: boolean;
    onDelete: (e: React.MouseEvent) => void;
}

const PingActionsDropdown = ({
    pingId,
    isOwner,
    onDelete,
}: PingActionsDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

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
        const url = `${window.location.origin}/feed/${pingId}`;
        navigator.clipboard.writeText(url);
        setIsOpen(false);
        // Optional: Show toast notification here
    };

    const handleReport = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implement report functionality
        setIsOpen(false);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(e);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
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
                className="w-[31px] h-8 rounded-full flex items-center justify-center hover:bg-[#FFC37BAB] transition-colors cursor-pointer"
            >
                <motion.div
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <MoreVertical
                        width={16}
                        height={16}
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
                        className="absolute right-0 top-full mt-2 bg-white rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] py-5 px-[15px] min-w-[220px] z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Copy link */}
                        <button
                            onClick={handleCopyLink}
                            className="w-full flex gap-[15px] items-center py-[7.5px] px-0 hover:bg-gray-50 rounded-[5px] transition-colors text-left"
                        >
                            <Link2 width={30} height={30} className="text-black shrink-0" />
                            <span className="font-['Poppins',sans-serif] font-medium text-[18px] text-black">
                                Copy link
                            </span>
                        </button>

                        {/* Report */}
                        <button
                            onClick={handleReport}
                            className="w-full flex gap-[15px] items-center py-[7.5px] px-0 hover:bg-gray-50 rounded-[5px] transition-colors text-left mt-[15px]"
                        >
                            <Flag width={30} height={30} className="text-black shrink-0" />
                            <span className="font-['Poppins',sans-serif] font-medium text-[18px] text-black">
                                Report
                            </span>
                        </button>

                        {/* Delete - only if owner */}
                        {isOwner && (
                            <button
                                onClick={handleDelete}
                                className="w-full flex gap-[15px] items-center py-[7.5px] px-0 hover:bg-red-50 rounded-[5px] transition-colors text-left mt-[15px]"
                            >
                                <Trash2
                                    width={30}
                                    height={30}
                                    className="text-red-500 shrink-0"
                                />
                                <span className="font-['Poppins',sans-serif] font-medium text-[18px] text-black">
                                    Delete
                                </span>
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PingActionsDropdown;
