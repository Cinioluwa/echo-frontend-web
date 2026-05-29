import React from "react";
import ModerationItem from "./ModerationItem";
import type { ModerationItem as ModerationItemType } from "./types";

interface ModerationListProps {
    items: ModerationItemType[];
    isLoading?: boolean;
}

const ModerationList: React.FC<ModerationListProps> = ({ items, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-[400px]">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-[#f49b31] border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-[#8b8e8d] font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-[300px]">
                <div className="text-center">
                    <p className="text-[#8b8e8d] font-medium text-lg">
                        No moderation items found
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 sm:gap-6 w-full max-h-[600px] overflow-y-auto pr-2">
            {items.map((item) => (
                <ModerationItem key={item.id} item={item} />
            ))}
        </div>
    );
};

export default ModerationList;
