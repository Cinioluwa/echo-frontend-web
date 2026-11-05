import { X } from "lucide-react";
import formatTimeAgo from "../../utils/formatTimeAgo";

interface Props {
    authorName: string;
    timestamp: string;
    onClose: () => void;
}

const PingHeader = ({ authorName, timestamp, onClose }: Props) => {
    return (
        <div className="flex items-center justify-between w-full">
            {/* User info */}
            <div className="flex items-center gap-2.5">
                {/* Avatar placeholder */}
                <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-semibold">
                        {authorName.charAt(0).toUpperCase()}
                    </span>
                </div>

                {/* User details */}
                <div className="flex flex-col items-start">
                    <p className="text-sm font-semibold text-[#63637B]">{authorName}</p>
                    <p className="text-xs text-[#9191A8]">
                        published Ping · {formatTimeAgo(timestamp)}
                    </p>
                </div>
            </div>

            {/* Close button */}
            <button
                onClick={onClose}
                className="w-[35px] h-[35px] flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
            >
                <X className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );
};

export default PingHeader;
