/**
 * WaveStatusIndicator Component
 * 
 * Displays the status of a wave (solution) with a colored indicator dot and text label.
 * Updated according to TAG_AND_STATUS_HIERARCHY.md to support all Wave statuses.
 * 
 * Supported statuses (map directly from Wave.status):
 * - POSTED → Posted (Grey)
 * - UNDER_REVIEW → Under Review (Green)
 * - APPROVED → Approved (Green)
 * - IN_PROGRESS → In Progress (Amber)
 * - REJECTED → Rejected (Red)
 * - COMPLETED → Completed (Orange)
 * 
 * Note: Community Pick badge is calculated separately and shown via WaveCard,
 * not through this component.
 */
import type { Wave } from "../api/types";

interface WaveStatusIndicatorProps {
    wave?: Wave;
    status?: Wave["status"];
    className?: string;
}

type StatusConfig = {
    label: string;
    dotColor: string;
};

/**
 * Get status configuration based on Wave status value
 */
const getStatusConfig = (status?: Wave["status"]): StatusConfig | null => {
    if (!status) return null;

    // Map backend Wave.status values to display configuration
    switch (status) {
        case "POSTED":
            return {
                label: "Posted",
                dotColor: "#A09F9F", // Grey
            };
        case "UNDER_REVIEW":
            return {
                label: "Under Review",
                dotColor: "#4CAF50", // Green
            };
        case "APPROVED":
            return {
                label: "Approved",
                dotColor: "#4CAF50", // Green
            };
        case "REJECTED":
            return {
                label: "Rejected",
                dotColor: "#FF6B6B", // Red
            };
        case "IN_PROGRESS":
            return {
                label: "In Progress",
                dotColor: "#F49B31", // Amber
            };
        case "COMPLETED":
            return {
                label: "Completed",
                dotColor: "#F49B31", // Orange (same as Amber in spec)
            };
        // "ON_HOLD" or other unsupported values
        default:
            return null;
    }
};

const WaveStatusIndicator = ({
    wave,
    status,
    className = "",
}: WaveStatusIndicatorProps) => {
    const statusValue = wave?.status || status;
    const config = getStatusConfig(statusValue);

    // Don't render if no valid status
    if (!config) return null;

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-[15px] py-[7px] border border-[#626665] rounded-[23px] ${className}`}
        >
            {/* Colored status dot */}
            <span
                className="w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: config.dotColor }}
            />

            {/* Status label */}
            <span className="text-[11px] font-medium text-black whitespace-nowrap">
                {config.label}
            </span>
        </div>
    );
};

export default WaveStatusIndicator;
