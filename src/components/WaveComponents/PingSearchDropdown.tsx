import { motion, AnimatePresence } from "framer-motion";
import type { Ping } from "../../api/types/index";
import PingResultCard from "./PingResultCard";
import NoPingFoundCard from "./NoPingFoundCard";
import { dropdownVariants, pingResultCardVariants } from "./animations";

interface Props {
    searchQuery: string;
    searchResults: Ping[];
    isSearching: boolean;
    onSelectPing: (ping: Ping) => void;
    onCreatePing: () => void;
    isVisible: boolean;
}

/**
 * PingSearchDropdown Component
 * 
 * Dropdown that displays search results or empty state.
 * Includes loading state, staggered animations for results, and smooth transitions.
 */
const PingSearchDropdown = ({
    searchQuery,
    searchResults,
    isSearching,
    onSelectPing,
    onCreatePing,
    isVisible,
}: Props) => {
    // Only show dropdown if visible and user has typed at least 2 characters
    const shouldShowDropdown = isVisible && searchQuery.length >= 2;

    return (
        <AnimatePresence>
            {shouldShowDropdown && (
                <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <div className="
            mt-2 p-3 
            border border-[#7D7D7D] rounded-[10px] 
            bg-white shadow-lg
            max-h-[400px] overflow-y-auto
            [scrollbar-width:thin]
          ">{/* Loading State */}
                        {isSearching ? (
                            <div className="text-center py-8">
                                <div className="inline-block w-8 h-8 border-4 border-[#F49B31] border-t-transparent rounded-full animate-spin" />
                                <p className="text-[12px] text-[#7D7D7D] mt-2">Searching...</p>
                            </div>
                        ) : searchResults.length === 0 ? (
                            /* Empty State */
                            <motion.div
                                variants={pingResultCardVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <NoPingFoundCard onCreatePing={onCreatePing} />
                            </motion.div>
                        ) : (
                            /* Search Results */
                            <div className="flex flex-col gap-2">
                                {searchResults.map((ping) => (
                                    <motion.div
                                        key={ping.id}
                                        variants={pingResultCardVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <PingResultCard
                                            ping={ping}
                                            searchQuery={searchQuery}
                                            onClick={onSelectPing}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PingSearchDropdown;
