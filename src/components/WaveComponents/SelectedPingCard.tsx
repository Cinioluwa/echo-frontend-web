import { motion } from "framer-motion";
import { FiX, FiChevronDown } from "react-icons/fi";
import type { Ping } from "../../api/types/index";
import { selectedPingVariants } from "./animations";
import formatTimeAgo from "../../utils/formatTimeAgo";

interface Props {
    ping: Ping;
    onDeselect: () => void;
}

/**
 * SelectedPingCard Component
 * 
 * Displays the selected ping with author information, timestamp, and close button.
 * Includes spring animation on mount and slide-out animation on close.
 */
const SelectedPingCard = ({ ping, onDeselect }: Props) => {
    return (
        <motion.div
            variants={selectedPingVariants}
            initial="hidden"
            animate="visible"
            className="
        relative p-3 rounded-[10px] 
        bg-[var(--echo-sidebar)] border border-[var(--echo-border-f49b31)]
        min-h-[49px]
      "
        >
            {/* Header: Author Info and Close Button */}
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-1">
                    {/* Avatar */}
                    <div className="
            w-6 h-6 rounded-full 
            bg-[var(--echo-accent)] 
            flex items-center justify-center 
            text-[var(--echo-text-on-accent)] text-[10px] font-semibold
            shrink-0
          ">
                        {ping.author
                            ? `${ping.author.firstName[0]}${ping.author.lastName[0]}`.toUpperCase()
                            : "A"
                        }
                    </div>

                    {/* Author Name */}
                    <div className="flex-1">
                        <p className="text-[12px] font-semibold text-[var(--echo-text-454545)]">
                            {ping.author
                                ? `${ping.author.firstName} ${ping.author.lastName}`
                                : "Anonymous"
                            }
                        </p>
                        <p className="text-[10px] text-[var(--echo-text-7d7d7d)]">
                            {formatTimeAgo(ping.createdAt)}
                        </p>
                    </div>

                    {/* Show More Indicator */}
                    <button
                        type="button"
                        className="text-[10px] text-[var(--echo-text-454545)] flex items-center gap-1 hover:opacity-70"
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
            bg-[var(--echo-bg-454545)] hover:bg-[var(--echo-bg-000000)]
            text-[var(--echo-text-on-accent)] 
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
            <h4 className="text-[14px] font-semibold text-[var(--echo-text-primary)] line-clamp-2">
                {ping.title}
            </h4>

            {/* Category Badge (if available) */}
            {ping.category && (
                <div className="mt-2">
                    <span className="
            inline-block text-[10px] font-medium 
            px-2 py-1 rounded-xl 
            bg-[var(--echo-accent)] text-[var(--echo-text-on-accent)]
          ">
                        {ping.category.name}
                    </span>
                </div>
            )}
        </motion.div>
    );
};

export default SelectedPingCard;
