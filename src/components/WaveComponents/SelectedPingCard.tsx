import { motion } from "framer-motion";
import { FiX, FiChevronDown } from "react-icons/fi";
import type { Ping } from "../../api/types/index";

interface Props {
    ping: Ping;
    onDeselect: () => void;
}

/**
 * Format timestamp to readable date
 * Example: "May 30, 11:00am"
 */
const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;

    return `${month} ${day}, ${displayHours}:${minutes}${ampm}`;
};

/**
 * SelectedPingCard Component
 * 
 * Displays the selected ping with author information, timestamp, and close button.
 * Includes spring animation on mount and slide-out animation on close.
 */
const SelectedPingCard = ({ ping, onDeselect }: Props) => {
    // Animation variants
    const cardVariants = {
        hidden: {
            y: -20,
            opacity: 0,
            scale: 0.95
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 200,
                damping: 20
            }
        },
        exit: {
            y: -20,
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.3,
                ease: [0.4, 0, 1, 1] as const
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
        relative p-3 rounded-[10px] 
        bg-[#FFC37B] border border-[#F49B31]
        min-h-[49px]
      "
        >
            {/* Header: Author Info and Close Button */}
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-1">
                    {/* Avatar */}
                    <div className="
            w-6 h-6 rounded-full 
            bg-[#F49B31] 
            flex items-center justify-center 
            text-white text-[10px] font-semibold
            shrink-0
          ">
                        {ping.author
                            ? `${ping.author.firstName[0]}${ping.author.lastName[0]}`.toUpperCase()
                            : "A"
                        }
                    </div>

                    {/* Author Name */}
                    <div className="flex-1">
                        <p className="text-[12px] font-semibold text-[#454545]">
                            {ping.author
                                ? `${ping.author.firstName} ${ping.author.lastName}`
                                : "Anonymous"
                            }
                        </p>
                        <p className="text-[10px] text-[#7D7D7D]">
                            {formatTimestamp(ping.createdAt)}
                        </p>
                    </div>

                    {/* Show More Indicator */}
                    <button
                        type="button"
                        className="text-[10px] text-[#454545] flex items-center gap-1 hover:opacity-70"
                    >
                        Show more
                        <FiChevronDown className="w-3 h-3" />
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={onDeselect}
                    type="button"
                    className="
            w-5 h-5 rounded-full 
            bg-[#454545] hover:bg-[#000000]
            text-white 
            flex items-center justify-center
            transition-colors duration-200
            shrink-0
          "
                    aria-label="Deselect ping"
                >
                    <FiX className="w-3 h-3" />
                </button>
            </div>

            {/* Ping Title */}
            <h4 className="text-[14px] font-semibold text-[#000000] line-clamp-2">
                {ping.title}
            </h4>

            {/* Category Badge (if available) */}
            {ping.category && (
                <div className="mt-2">
                    <span className="
            inline-block text-[10px] font-medium 
            px-2 py-1 rounded-xl 
            bg-[#F49B31] text-white
          ">
                        {ping.category.name}
                    </span>
                </div>
            )}
        </motion.div>
    );
};

export default SelectedPingCard;
