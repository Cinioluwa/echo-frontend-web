import React, { useState, Suspense } from "react";
import FollowUpFilterTabs from "./FollowUpFilterTabs";
import FollowUpList from "./FollowUpList";
import type { FollowUpItem as FollowUpItemType, FilterType } from "./types";

interface FollowUpProps { }

// Mock data for follow-up items
const mockFollowUpItems: FollowUpItemType[] = [
    {
        id: "1",
        title: "The wifi is too slow in library",
        category: "General",
        author: {
            name: "Temiloluwa Anokoya",
            avatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Temiloluwa",
            timestamp: "Feb 28, 10:24 pm",
        },
        description:
            "Use WIFI boosters to increase the bandwidth and frequency of the wave being transmitted so that more users can easily connect to the network.",
        status: "approved",
        waveCount: 192,
        actions: {
            primary: {
                label: "Mark as Completed",
                onClick: () => console.log("Mark as completed"),
                variant: "orange",
            },
            secondary: {
                label: "Mark as Implementing",
                onClick: () => console.log("Mark as implementing"),
                variant: "outline-orange",
            },
        },
    },
    {
        id: "2",
        title: "The wifi is too slow in library",
        category: "General",
        author: {
            name: "Temiloluwa Anokoya",
            avatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Temiloluwa2",
            timestamp: "Feb 28, 10:24 pm",
        },
        description:
            "Use WIFI boosters to increase the bandwidth and frequency of the wave being transmitted so that more users can easily connect to the network.",
        status: "under-review",
        waveCount: 192,
        actions: {
            primary: {
                label: "Approve",
                onClick: () => console.log("Approve"),
                variant: "orange",
            },
            secondary: {
                label: "Reject",
                onClick: () => console.log("Reject"),
                variant: "red",
            },
        },
    },
    {
        id: "3",
        title: "The wifi is too slow in library",
        category: "General",
        author: {
            name: "Temiloluwa Anokoya",
            avatar:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Temiloluwa3",
            timestamp: "Feb 28, 10:24 pm",
        },
        description:
            "Use WIFI boosters to increase the bandwidth and frequency of the wave being transmitted so that more users can easily connect to the network.",
        status: "approved",
        waveCount: 192,
        actions: {
            primary: {
                label: "Mark as Completed",
                onClick: () => console.log("Mark as completed"),
                variant: "orange",
            },
            secondary: {
                label: "Mark as Implementing",
                onClick: () => console.log("Mark as implementing"),
                variant: "outline-orange",
            },
        },
    },
];

const FollowUp: React.FC<FollowUpProps> = () => {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    const [isLoading, setIsLoading] = useState(false);

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    };

    return (
        <div className="flex flex-col gap-6 items-start px-6 py-8 relative w-full">
            {/* Header */}
            <div className="flex flex-col gap-2 items-start relative w-full">
                <h1 className="font-poppins font-bold text-[32px] leading-normal text-black">
                    Follow Up
                </h1>
                <p className="font-poppins font-medium text-[16px] leading-normal text-[#8b8e8d]">
                    Tasks that need your attention to keep the community moving forward
                </p>
            </div>

            {/* Filter tabs */}
            <div className="w-full">
                <FollowUpFilterTabs
                    activeFilter={activeFilter}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Follow-up list */}
            <Suspense
                fallback={
                    <div className="flex items-center justify-center w-full h-[500px]">
                        <div className="text-center">
                            <div className="animate-spin w-12 h-12 border-4 border-[#f49b31] border-t-transparent rounded-full mx-auto mb-4" />
                            <p className="text-[#8b8e8d] font-medium">Loading...</p>
                        </div>
                    </div>
                }
            >
                <div className="w-full">
                    <FollowUpList items={mockFollowUpItems} isLoading={isLoading} />
                </div>
            </Suspense>
        </div>
    );
};

export default FollowUp;
