import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { TrendingUp, MessageSquare, Radio, CheckCircle2, ArrowLeft, Send } from "lucide-react";
import { categoryImages } from "../../CategoryImages";
import KPICard from "./KPICard";
import CommentsPanel from "./CommentsPanel";
import StatusTimeline from "./StatusTimeline";
import RelatedPings from "./RelatedPings";
import type { Author, PingComment, StatusEvent, RelatedPing } from "./types";
import { motion } from "framer-motion";

export type AdminBadgeType =
    | "SURGING_NOW"
    | "RISING_QUICKLY"
    | "LONG_OVERDUE"
    | "HIGH_DISCUSSION"
    | "WIDESPREAD"
    | "NEEDS_ATTENTION"
    | "SOLUTION_READY";

interface BadgeConfig {
    label: string;
    bgColor: string;
    textColor: string;
    icon: React.ReactNode;
}

const badgeConfigs: Record<AdminBadgeType, BadgeConfig> = {
    SURGING_NOW: {
        label: "Surging now",
        bgColor: "#ffd7d7",
        textColor: "#b01212",
        icon: <img src="/assets/icon/red-surge.svg" alt="Red lighting Icon" className="w-3 h-3" />
    },
    RISING_QUICKLY: {
        label: "Rising quickly",
        bgColor: "#ffd6a5",
        textColor: "#a3651e",
        icon: <TrendingUp className="w-3.5 h-3.5" />
    },
    LONG_OVERDUE: {
        label: "Long overdue",
        bgColor: "#f7c8b2",
        textColor: "#b04712",
        icon: <img src="/assets/icon/time-alert.svg" alt="Clock alert Icon" className="w-3 h-3" />
    },
    HIGH_DISCUSSION: {
        label: "High discussion",
        bgColor: "#ead9ff",
        textColor: "#531ea3",
        icon: <MessageSquare className="w-3.5 h-3.5" />
    },
    WIDESPREAD: {
        label: "Widespread",
        bgColor: "#b5d0ff",
        textColor: "#0035ac",
        icon: <Radio className="w-3.5 h-3.5" />
    },
    NEEDS_ATTENTION: {
        label: "Needs Attention",
        bgColor: "#cacaca",
        textColor: "#454545",
        icon: <img src="/assets/icon/alert.svg" alt="Alert Icon" className="w-3 h-3" />
    },
    SOLUTION_READY: {
        label: "Solution Ready",
        bgColor: "#b2ffcc",
        textColor: "#067647",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />
    }
};

interface PingDetailData {
    id: string;
    title: string;
    content: string;
    category: {
        name: string;
    };
    author: Author;
    badges: string[];
    mediaUrl?: string;
    surgeCount: number;
    surgeDelta?: string;
    surgeDeltaIcon?: string;
    unresolvedFor: string;
    comments: PingComment[];
    statusEvents: StatusEvent[];
    relatedPings: RelatedPing[];
}

interface AdminPingDetailProps {
    pingId?: string;
    ping?: PingDetailData;
}

// Mock data registry indexable by pingId
const mockPings: Record<string, PingDetailData> = {
    "1": {
        id: "1",
        title: "The wifi is too slow in library",
        content: "Many students struggle with poor WiFi connectivity in certain areas on campus, which hinders their ability to access online resources, complete assignments and participate in online discussions.",
        category: { name: "General" },
        author: {
            name: "Felix Oluwapelumi",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            timestamp: "Feb 29, 09:30 pm",
        },
        badges: ["SURGING_NOW", "LONG_OVERDUE"],
        mediaUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&h=450&fit=crop",
        surgeCount: 264,
        surgeDelta: "+28 today",
        surgeDeltaIcon: "↑",
        unresolvedFor: "12 days",
        comments: [
            {
                id: "1",
                author: "Ikomo Israel",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ikomo",
                text: "This school just wants us to suffer abeg. Simple wifi they cannot provide...",
                likes: 3,
                replies: 1,
            },
            {
                id: "2",
                author: "Simon Ty",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Simon",
                text: "Looks like we do quick connect...",
                likes: 2,
                replies: 4,
            },
        ],
        statusEvents: [
            {
                status: "Ping Posted",
                timestamp: "Feb 28, 10:24pm",
            },
            {
                status: "First Wave Proposed",
                timestamp: "Feb 28 - by Friday",
            },
            {
                status: "Surges cross 500",
                timestamp: "Feb 28 - 2 days after posting",
            },
            {
                status: "Acknowledged by Admin",
                timestamp: "Feb 28 - Pending Resolution",
            },
        ],
        relatedPings: [
            {
                id: "1",
                category: "Chapel",
                title: "Chapel will is slow",
                waveCount: 205,
            },
            {
                id: "2",
                category: "Hall",
                title: "The wifi in hall is not working",
                waveCount: 139,
            },
            {
                id: "3",
                category: "Academic",
                title: "Wifi working in EB",
                waveCount: 87,
            },
        ]
    },
    "2": {
        id: "2",
        title: "No water in the halls since Monday",
        content: "Deborah Hall has been without running water for over three days now. It is getting extremely difficult for students to maintain basic hygiene and clean their rooms.",
        category: { name: "Hall" },
        author: {
            name: "Felix Oluwapelumi",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            timestamp: "Feb 28, 08:15 am",
        },
        badges: ["RISING_QUICKLY", "NEEDS_ATTENTION"],
        mediaUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&h=450&fit=crop",
        surgeCount: 187,
        surgeDelta: "+15 today",
        surgeDeltaIcon: "↑",
        unresolvedFor: "3 days",
        comments: [
            {
                id: "1",
                author: "Deborah Alao",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deborah",
                text: "No water since Monday! This is unacceptable. How do we bath or flush?",
                likes: 12,
                replies: 2,
            }
        ],
        statusEvents: [
            {
                status: "Ping Posted",
                timestamp: "Feb 28, 08:15am",
            },
            {
                status: "Assigned to Maintenance",
                timestamp: "Feb 28, 02:00pm",
            }
        ],
        relatedPings: [
            {
                id: "4",
                category: "Hall",
                title: "Leaking pipe in Daniel Hall",
                waveCount: 45,
            }
        ]
    },
    "3": {
        id: "3",
        title: "Shuttles to EIE library",
        content: "We need more shuttle buses running to the EIE building during peak hours. The lines are too long and students are missing classes.",
        category: { name: "Welfare" },
        author: {
            name: "Felix Oluwapelumi",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            timestamp: "Feb 27, 02:45 pm",
        },
        badges: ["WIDESPREAD", "SOLUTION_READY"],
        mediaUrl: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=800&h=450&fit=crop",
        surgeCount: 95,
        surgeDelta: "+5 today",
        surgeDeltaIcon: "↑",
        unresolvedFor: "5 days",
        comments: [
            {
                id: "1",
                author: "Joshua Daniels",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joshua",
                text: "Yes please, the sun is too hot to stand in that shuttle line for 30 minutes.",
                likes: 8,
                replies: 0,
            }
        ],
        statusEvents: [
            {
                status: "Ping Posted",
                timestamp: "Feb 27, 02:45pm",
            },
            {
                status: "Solution Proposed",
                timestamp: "Feb 28, 10:00am",
            }
        ],
        relatedPings: [
            {
                id: "5",
                category: "Welfare",
                title: "Shuttle bus fares increase",
                waveCount: 120,
            }
        ]
    }
};

const iconVariants = {
    initial: {
        filter: "grayscale(1) brightness(1)",
        willChange: "filter"
    },
    hover: {
        filter: "grayscale(1) brightness(1.5)",
        transition: {
            duration: 0.1,
        }
    }
};

const responseVariants = {
    initial: {
        height: 50,
    },
    active: {
        height: 90,
        transition: {
            duration: 0.1,
        },
    }
};

const resposeButtonVariants = {
    initial: {
        opacity: 0,
        scale: 0.95,
        pointerEvents: 'none'
    },
    active: {
        opacity: 1,
        scale: 1,
        pointerEvents: 'auto',
        transition: {
            duration: 0.1,
            delay: 0.05
        }
    }
};
const AdminPingDetail: React.FC<AdminPingDetailProps> = ({ pingId: propPingId, ping: propPing }) => {
    const routeParams = useParams<{ pingId: string }>();
    const pingId = propPingId || routeParams.pingId;

    const [isResponseActive, setIsResponseActive] = useState(false);

    // Resolve ping data dynamically
    const pingData = propPing || (pingId ? mockPings[pingId] : null) || mockPings["1"];

    const handleGoBack = () => {
        window.history.back();
    };

    // Category name and icon lookup
    const categoryName = pingData.category?.name || "General";
    const categoryIcon = categoryImages[categoryName] || categoryImages.General;

    const handleResponseHover = () => {
        setIsResponseActive(true);
    };
    const handleResponseLeave = (e: MouseEvent) => {
        if (!e.target) return setIsResponseActive(true)
        if (e.target === document.activeElement) return
        setIsResponseActive(false)
    };

    const handleResponseFocus = () => {
        setIsResponseActive(true);
    };

    const handleResponseFocusOut = () => {
        setIsResponseActive(false);
    };

    return (
        <div className="m-0 md:ms-[230px] flex flex-col gap-4 sm:gap-6 items-start px-3 sm:px-6 py-6 sm:py-8 relative">
            {/* Header */}
            <div className="flex items-center justify-between w-full mb-2">
                <h1 className="font-poppins font-semibold text-[24px] sm:text-[28px] leading-normal text-black">
                    Ping Details
                </h1>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full">
                {/* Left/Center Section - Feed */}
                <div className="flex-1 flex flex-col gap-4 sm:gap-6">
                    {/* Navigation Bar */}
                    <div className="flex items-center justify-between w-full">
                        <button
                            onClick={handleGoBack}
                            className="bg-white hover:bg-[#fef5ea] border border-[#e0e0e0] rounded-[20px] px-4 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2 transition-colors"
                        >
                            <ArrowLeft color="black" size={20} />
                            <p className="font-poppins font-semibold text-[12px] sm:text-[13px] text-black">
                                Go back
                            </p>
                        </button>
                        {/* Export Button */}
                        <motion.button
                            className="border border-[#f49b31] rounded-lg px-3 sm:px-[15px] py-2 sm:py-[9px] flex items-center gap-1 sm:gap-2 hover:bg-[#F49B31] text-[#f49b31] hover:text-white transition-colors text-xs sm:text-[12px]"
                            whileHover="hover"
                        >
                            <motion.img src="/assets/icon/Export.svg" alt="Export Icon" className="w-[13px] h-[13px]" variants={iconVariants} />
                            <span className="font-medium hidden sm:inline">
                                Export
                            </span>
                        </motion.button>
                    </div>

                    {/* Ping Card */}
                    <div className="bg-white rounded-[10px] p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#e0e0e0]">
                            <img
                                src={pingData.author.avatar}
                                alt={pingData.author.name}
                                className="w-[45px] sm:w-[53px] h-[45px] sm:h-[53px] rounded-full object-cover shrink-0"
                            />
                            <div className="flex-1 flex flex-col gap-1">
                                <p className="font-poppins font-semibold text-[13px] sm:text-[15px] text-black">
                                    {pingData.author.name}
                                </p>
                                <p className="font-poppins font-medium text-[11px] sm:text-[13px] text-[#8b8e8d]">
                                    {pingData.author.timestamp}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                {pingData.badges?.map((badgeKey: string) => {
                                    const badge = badgeConfigs[badgeKey as AdminBadgeType];
                                    if (!badge) return null;
                                    return (
                                        <span
                                            key={badgeKey}
                                            className="flex items-center gap-[7.5px] rounded-[28.75px] px-[15px] py-1 font-poppins font-medium text-[10px] sm:text-[11px] whitespace-nowrap transition-all"
                                            style={{ backgroundColor: badge.bgColor, color: badge.textColor }}
                                        >
                                            {badge.icon} {badge.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-2">
                            {categoryIcon ? (
                                <img src={categoryIcon} alt={categoryName} className="w-[14px] h-[14px] object-contain" />
                            ) : (
                                <span>📁</span>
                            )}
                            <p className="font-poppins font-medium text-[12px] sm:text-[14px] text-[#626665]">
                                {categoryName}
                            </p>
                        </div>

                        {/* Title */}
                        <h2 className="font-poppins font-semibold text-[15px] sm:text-[16px] text-black">
                            {pingData.title}
                        </h2>

                        {/* Body */}
                        <p className="font-poppins font-medium text-[12px] sm:text-[14px] text-[#626665] text-justify leading-relaxed">
                            {pingData.content}
                        </p>

                        {/* Image */}
                        {pingData.mediaUrl && (
                            <div className="bg-black rounded-lg overflow-hidden aspect-video">
                                <img
                                    src={pingData.mediaUrl}
                                    alt="Ping content"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Official Response Section */}
                    <div className="bg-white rounded-[10px] p-4 sm:p-5 flex flex-col gap-3">
                        <h3 className="font-poppins font-semibold text-[14px] sm:text-[16px] text-black">
                            Official Response
                        </h3>
                        <div
                            className="relative flex flex-col gap-2 overflow-hidden "
                        >
                            <motion.textarea
                                variants={responseVariants}
                                onHoverStart={handleResponseHover}
                                onHoverEnd={handleResponseLeave}
                                onFocus={handleResponseFocus}
                                onBlur={handleResponseFocusOut}
                                animate={isResponseActive ? "active" : "initial"}
                                placeholder="Post an update visible to all students"
                                className="h-[50px] resize-none border border-[#ffc37b] rounded-[20px] ps-4 pe-[170px] py-3  font-poppins font-medium text-[12px] sm:text-[14px] placeholder-[#9e9e9e] "
                            />
                            <motion.button
                                variants={resposeButtonVariants}
                                animate={isResponseActive ? "active" : "initial"}
                                className="absolute right-1 bottom-1 bg-[#fef5ea] hover:bg-[#fef0e0] border border-[#f49b31] rounded-[20px] px-4 py-2 flex items-center justify-center gap-2 font-poppins font-bold text-[11px] sm:text-[12px] uppercase text-[#f49b31]"
                            >
                                <Send /> Post response
                            </motion.button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <KPICard
                            icon="⚡"
                            label="Surge count"
                            value={pingData.surgeCount}
                            delta={pingData.surgeDelta}
                            deltaIcon={pingData.surgeDeltaIcon}
                        />
                        <KPICard
                            icon=""
                            label="Unresolved For"
                            value={pingData.unresolvedFor}
                        />
                    </div>
                </div>

                {/* Right Section - Sidebar */}
                <div className="w-full lg:w-[320px] sm:w-[300px] flex flex-col gap-3 sm:gap-4">
                    <CommentsPanel comments={pingData.comments || []} />
                    <StatusTimeline events={pingData.statusEvents || []} />
                    <RelatedPings pings={pingData.relatedPings || []} />
                </div>
            </div>
        </div>
    );
};

export default AdminPingDetail;
