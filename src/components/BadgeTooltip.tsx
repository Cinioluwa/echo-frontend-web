import React, { useEffect, useId, useRef, useState } from "react";

export const BADGE_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
    OPEN: {
        title: "Open",
        description:
            "This ping has been posted but has not received any official action yet, such as an acknowledgement or an official response.",
    },
    TOP_3: {
        title: "Top 3",
        description: "One of the three most surged pings this week.",
    },
    ACKNOWLEDGED: {
        title: "Acknowledged",
        description: "An official has seen this ping and confirmed they are looking into it.",
    },
    RESOLVED: {
        title: "Resolved",
        description: "The student who posted this ping has confirmed the issue is resolved.",
    },
    COMMUNITY_PICK: {
        title: "Community Pick",
        description: "The wave the community has surged the most for this ping.",
    },
    ALTERNATIVE: {
        title: "Alternative",
        description: "The second most surged wave for this ping.",
    },
    POSTED: {
        title: "Proposed",
        description: "A solution suggested by the community that is waiting to be reviewed.",
    },
    UNDER_REVIEW: {
        title: "Under Review",
        description: "Leadership is currently evaluating this wave.",
    },
    APPROVED: {
        title: "Approved",
        description: "Leadership has approved this wave and agreed to act on it.",
    },
    IN_PROGRESS: {
        title: "In Progress",
        description: "Work on this wave has started. Change is on the way.",
    },
    REJECTED: {
        title: "Rejected",
        description: "Leadership decided not to move forward with this wave.",
    },
    COMPLETED: {
        title: "Completed",
        description: "This wave has been fully implemented.",
    },
};

interface BadgeTooltipProps {
    badgeKey: string;
    children: React.ReactNode;
    className?: string;
}

const BadgeTooltip: React.FC<BadgeTooltipProps> = ({ badgeKey, children, className = "" }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    const id = useId();
    const info = BADGE_DESCRIPTIONS[badgeKey];

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    if (!info) return <>{children}</>;

    return (
        <span ref={ref} className={`relative inline-flex ${className}`}>
            <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={open ? id : undefined}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setOpen((v) => !v);
                }}
                className="inline-flex cursor-pointer bg-transparent p-0 border-0"
            >
                {children}
            </button>
            {open && (
                <span
                    id={id}
                    role="dialog"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full z-50 mt-2 flex w-[220px] flex-col gap-1 rounded-[12px] border border-[#F49B31] bg-[#FEFEFE] p-3 text-left shadow-lg"
                >
                    <span className="font-poppins text-[13px] font-semibold text-[#171717]">{info.title}</span>
                    <span className="font-poppins text-[12px] font-medium leading-snug text-[#626665]">
                        {info.description}
                    </span>
                </span>
            )}
        </span>
    );
};

export default BadgeTooltip;
