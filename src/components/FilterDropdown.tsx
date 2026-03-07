import { useState, useRef, useEffect } from "react";
import { IoCheckmark } from "react-icons/io5";

const filterIcon = "/assets/images/filters.svg";

export type FilterOption = "top3" | "underReview" | "submitted" | "new" | "rejected";

interface FilterDropdownProps {
    selectedFilters: FilterOption[];
    onFilterChange: (filters: FilterOption[]) => void;
    className?: string;
}

const FILTER_OPTIONS = [
    { id: "top3" as FilterOption, label: "Top 3" },
    { id: "underReview" as FilterOption, label: "Under Review" },
    { id: "submitted" as FilterOption, label: "Submitted" },
    { id: "new" as FilterOption, label: "New" },
    { id: "rejected" as FilterOption, label: "Rejected" },
];

const FilterDropdown = ({ selectedFilters, onFilterChange, className }: FilterDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleFilterToggle = (filterId: FilterOption) => {
        const newFilters = selectedFilters.includes(filterId)
            ? selectedFilters.filter((f) => f !== filterId)
            : [...selectedFilters, filterId];

        onFilterChange(newFilters);
    };

    const hasActiveFilters = selectedFilters.length > 0;

    const handleReset = () => {
        onFilterChange([]);
    };

    return (
        <div className={`relative ${className || ""}`} ref={dropdownRef}>
            {/* Filter Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 cursor-pointer transition-colors hover:opacity-80"
            >
                <img src={filterIcon} alt="" className="inline" />
                <p className="text-[#B29494] text-[15px] inline">
                    Filters
                    {hasActiveFilters && (
                        <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-[#F49B31] rounded-full">
                            {selectedFilters.length}
                        </span>
                    )}
                </p>
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden w-[220px] z-50">
                    {/* Title */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <p className="text-[#71717a] text-[12px]">Filter courses</p>
                        {hasActiveFilters && (
                            <button
                                onClick={handleReset}
                                className="text-[#F49B31] text-[12px] hover:underline cursor-pointer"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {/* Filter Options */}
                    <div className="pb-2">
                        {FILTER_OPTIONS.map((option) => {
                            const isChecked = selectedFilters.includes(option.id);

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleFilterToggle(option.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    {/* Checkbox */}
                                    <div className="relative shrink-0 w-5 h-5">
                                        <div
                                            className={`w-5 h-5 rounded-md border transition-all ${isChecked
                                                    ? "bg-[#14A155] border-[#14A155]"
                                                    : "bg-transparent border-[#a1a1aa]"
                                                }`}
                                        />
                                        {isChecked && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <IoCheckmark className="text-white text-sm" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <p className="text-[#333] text-[14px] font-normal tracking-[0.15px]">
                                        {option.label}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
