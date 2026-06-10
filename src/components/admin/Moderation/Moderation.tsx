import React, { useState, Suspense } from "react";
import ModerationCard from "./ModerationCard";
import ModerationList from "./ModerationList";
import AdminHeader from "../AdminHeader";
import AdminMobileMenu from "../AdminMobileMenu";
import type { ModerationItem as ModerationItemType } from "./types";

interface ModerationProps { }

// Mock data for moderation items
const mockModerationItems: ModerationItemType[] = [
    {
        id: "1",
        type: "comment",
        subject: "The wifi is too slow in library",
        category: "General",
        author: {
            name: "Isaac Israel",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isaac",
            timestamp: "2mo",
        },
        content:
            "This school just wants us to suffer abeg. Simple wifi they cannot provide...",
        violationType: "misinformation",
        flagCount: 8,
    },
    {
        id: "2",
        type: "wave",
        subject: "The wifi is too slow in library",
        category: "General",
        author: {
            name: "Temiloluwa Anokoya",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Temiloluwa",
            timestamp: "Feb 28, 10:24 pm",
        },
        content: "I'll post your CGPA if my wave is not picked!!!",
        violationType: "threats",
        flagCount: 8,
    },
    {
        id: "3",
        type: "ping",
        subject: "Campus Facilities",
        category: "General",
        author: {
            name: "Felix Oluwapelumi",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            timestamp: "Feb 29, 09:30 pm",
        },
        content:
            "F*ck F*ck F*ck F*ck F*ck F*ck F*ck F*ck UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
        violationType: "inappropriate-content",
        flagCount: 13,
        image:
            "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=300&fit=crop",
    },
];

const Moderation: React.FC<ModerationProps> = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const handleFilterChange = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
    };

    return (
        <>
            <div className="m-0 md:ms-[230px] flex flex-col gap-4 sm:gap-6 items-start px-3 sm:px-6 py-6 sm:py-8 relative">
                {/* Header */}
                <div className="flex flex-col gap-1 sm:gap-2 items-start relative w-full">
                    <h1 className="hidden md:block font-poppins font-semibold text-[24px] sm:text-[28px] leading-normal text-black">
                        Moderation
                    </h1>
                    <AdminHeader title="Moderation" setOpenMenu={setOpenMenu} openMenu={openMenu} />
                    <p className="font-poppins font-medium text-[13px] sm:text-[15px] leading-normal text-[#5e5c58]">
                        Flagged posts from your community awaiting your review
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full">
                    <ModerationCard
                        label="Pending Review"
                        count={4}
                        subtitle="Needs your attention"
                    />
                    <ModerationCard
                        label="Resolved this week"
                        count={11}
                        subtitle="Dismissed or actioned"
                    />
                    <ModerationCard
                        label="Active suspensions"
                        count={2}
                        subtitle="Aliases Suspended"
                    />
                </div>

                {/* Filter and controls */}
                <div className="flex items-center justify-end self-end p-1.5 w-fit gap-1.5 border border-[#f49b31] rounded-lg ">
                    <button
                        onClick={handleFilterChange}
                        className="flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 hover:bg-[#fef5ea] transition-colors"
                    >
                        <img src="/assets/images/filters.svg" alt="filter" className="w-[16px] h-[16px]" />
                        <p className="font-poppins font-medium text-[12px] sm:text-[14px] text-[#b29494] hidden sm:block">
                            Filter
                        </p>
                    </button>
                    {/* <div className="bg-[#ffd7d7] rounded-full px-3 py-1.5 flex items-center gap-2">
                    <img src="/assets/icon/eye-off.svg" alt="eye-off" className="w-[16px] h-[16px]" />
                    <p className="font-poppins font-medium text-[10px] sm:text-[12px] text-[#b01212]">
                        Inappropriate content
                    </p>
                </div> */}
                </div>

                {/* Moderation items list */}
                <Suspense
                    fallback={
                        <div className="flex items-center justify-center w-full h-[400px]">
                            <div className="text-center">
                                <div className="animate-spin w-12 h-12 border-4 border-[#f49b31] border-t-transparent rounded-full mx-auto mb-4" />
                                <p className="text-[#8b8e8d] font-medium">Loading...</p>
                            </div>
                        </div>
                    }
                >
                    <div className="w-full">
                        <ModerationList items={mockModerationItems} isLoading={isLoading} />
                    </div>
                </Suspense>
            </div>
            <AdminMobileMenu setMenu={setOpenMenu} menu={openMenu} />
        </>
    );
};

export default Moderation;
