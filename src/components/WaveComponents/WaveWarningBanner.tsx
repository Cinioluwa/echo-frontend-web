import { FiAlertCircle } from "react-icons/fi";

interface Props {
    className?: string;
}

/**
 * WaveWarningBanner Component
 * 
 * Displays a warning message informing users that a Wave must be linked to an existing Ping.
 * This banner appears at the top of the Wave creation form.
 */
const WaveWarningBanner = ({ className = "" }: Props) => {
    return (
        <div
            className={`bg-[#FEF5EA] flex gap-[3px] items-center p-[5px] rounded-[10px] ${className}`}
            role="alert"
            aria-live="polite"
        >
            <FiAlertCircle className="w-3 h-3 text-[#454545] shrink-0" />
            <p className="font-semibold text-[10px] text-[#454545]">
                You must link a Wave to an existing Ping.
            </p>
        </div>
    );
};

export default WaveWarningBanner;
