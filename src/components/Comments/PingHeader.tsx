import { X } from "lucide-react";

interface Props {
    authorName: string;
    timestamp: string;
    onClose: () => void;
}

const PingHeader = ({ authorName, timestamp, onClose }: Props) => {
    // Format timestamp to "X days ago"
    const formatTimestamp = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            if (diffInHours === 0) {
                const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
            }
            return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
        }
        if (diffInDays === 1) return "1 day ago";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
        }
        const months = Math.floor(diffInDays / 30);
        return months === 1 ? "1 month ago" : `${months} months ago`;
    };

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
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#63637B]">{authorName}</p>
                    <p className="text-xs text-[#9191A8]">published Ping</p>
                    <span className="text-[#9191A8]">•</span>
                    <p className="text-xs text-[#9191A8]">
                        {formatTimestamp(timestamp)}
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
