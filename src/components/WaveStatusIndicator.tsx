/**
 * WaveStatusIndicator Component
 * 
 * Displays the status of a wave (solution) with a colored indicator dot and text label.
 * Supports multiple status types including Top 3 ranking, submission states, and approval states.
 * 
 * Based on backend Wave status field values:
 * - POSTED → Posted
 * - UNDER_REVIEW → Under Review
 * - APPROVED → Approved  
 * - REJECTED → Rejected
 * - Top 3: Determined by rank (1-3)
 */

interface WaveStatusIndicatorProps {
    status?: "POSTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
    rank?: number; // For Top 3 display (1, 2, or 3)
    className?: string;
}

type StatusConfig = {
    label: string;
    dotColor: string;
    bgColor?: string;
};

const WaveStatusIndicator = ({ status, rank, className = "" }: WaveStatusIndicatorProps) => {
    // Determine which status to display - Top 3 takes priority
    const getStatusConfig = (): StatusConfig | null => {
        // Top 3 ranking takes priority over status
        if (rank && rank >= 1 && rank <= 3) {
            // Different colors for different ranks
            let dotColor = "bg-[#DDE23B]"; // Default yellow for Top 3
            if (rank === 1) dotColor = "bg-[#FFD700]"; // Gold
            else if (rank === 2) dotColor = "bg-[#C0C0C0]"; // Silver
            else if (rank === 3) dotColor = "bg-[#DDE23B]"; // Yellow/lime

            return {
                label: `Top ${rank}`,
                dotColor,
            };
        }

        // Map backend status values to display config
        switch (status) {
            case "POSTED":
                return {
                    label: "Posted",
                    dotColor: "bg-[#FFA500]", // Orange
                };
            case "UNDER_REVIEW":
                return {
                    label: "Under Review",
                    dotColor: "bg-[#98C93C]", // Yellow-green
                };
            case "APPROVED":
                return {
                    label: "Approved",
                    dotColor: "bg-[#4CAF50]", // Green
                };
            case "REJECTED":
                return {
                    label: "Rejected",
                    dotColor: "bg-[#F44336]", // Red
                };
            default:
                return null;
        }
    };

    const config = getStatusConfig();

    // Don't render if no valid status or rank
    if (!config) return null;

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-[15px] py-[7px] border border-[#626665] rounded-[23px] ${className}`}
        >
            {/* Colored status dot */}
            <span className={`w-[5px] h-[5px] rounded-full ${config.dotColor}`} />

            {/* Status label */}
            <span className="text-[11px] font-medium text-black whitespace-nowrap">
                {config.label}
            </span>
        </div>
    );
};

export default WaveStatusIndicator;
