import { FiPlus } from "react-icons/fi";

interface Props {
    onCreatePing: () => void;
}

/**
 * NoPingFoundCard Component
 * 
 * Empty state displayed when search returns no results.
 * Encourages users to create a new Ping if they're the first to identify an issue.
 */
const NoPingFoundCard = ({ onCreatePing }: Props) => {
    return (
        <div className="
      w-full p-6 text-center 
      border border-[#7D7D7D] rounded-[10px] 
      bg-white
    ">
            {/* Empty State Message */}
            <h4 className="text-[16px] font-semibold text-[#454545] mb-2">
                No existing Ping Found
            </h4>

            <p className="text-[12px] text-[#7D7D7D] mb-4">
                Seems like you're the first identifying the issue
            </p>

            {/* Create Ping Button */}
            <button
                onClick={onCreatePing}
                type="button"
                className="
          inline-flex items-center gap-2 
          px-6 py-2.5 
          bg-[#F49B31] hover:bg-[#E08A20] 
          text-white text-[14px] font-semibold 
          rounded-[25px] 
          transition-all duration-200
          hover:scale-105 active:scale-95
          shadow-md hover:shadow-lg
        "
            >
                <FiPlus className="w-4 h-4" />
                Create Ping
            </button>
        </div>
    );
};

export default NoPingFoundCard;
