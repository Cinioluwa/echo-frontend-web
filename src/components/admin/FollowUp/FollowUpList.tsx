import React from "react";
import FollowUpItem from "./FollowUpItem";
import type { FollowUpItem as FollowUpItemType } from "./types";

interface FollowUpListProps {
    items: FollowUpItemType[];
    isLoading?: boolean;
}

const FollowUpList: React.FC<FollowUpListProps> = ({ items, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-[500px]">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-[#f49b31] border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-[#8b8e8d] font-medium">Loading follow-ups...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-[500px]">
                <div className="text-center">
                    <p className="text-[#8b8e8d] font-medium text-[16px]">
                        No follow-ups found
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col gap-[30px] items-start relative shrink-0 w-full"
            data-node-id="5696:15442"
        >
            {items.map((item) => (
                <FollowUpItem key={item.id} item={item} />
            ))}
        </div>
    );
};

export default FollowUpList;
