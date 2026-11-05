import React, { useEffect, useId, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

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
    PROPOSED: {
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
    description?: string;
}

const BadgeTooltip: React.FC<BadgeTooltipProps> = ({
    badgeKey,
    children,
    className = "",
    description,
}) => {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const tooltipRef = useRef<HTMLSpanElement>(null);
    const id = useId();
    const info = BADGE_DESCRIPTIONS[badgeKey];

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const tooltipWidth = 220;
        const tooltipHeight = 110;

        const spaceBelow = window.innerHeight - rect.bottom;
        const shouldFlipUp = spaceBelow < tooltipHeight && rect.top > tooltipHeight;

        const top = shouldFlipUp ? rect.top - tooltipHeight - 8 : rect.bottom + 8;
        const left = Math.max(12, Math.min(window.innerWidth - tooltipWidth - 12, rect.right - tooltipWidth));

        setCoords({ top, left });
    }, []);

    useEffect(() => {
        if (!open) return;
        updatePosition();

        const onDown = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                triggerRef.current && !triggerRef.current.contains(target) &&
                tooltipRef.current && !tooltipRef.current.contains(target)
            ) {
                setOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        const handleScrollOrResize = () => setOpen(false);

        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);

        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
            window.removeEventListener("scroll", handleScrollOrResize, true);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [open, updatePosition]);

    if (!info) return <>{children}</>;

    return (
        <span className={`inline-flex ${className}`}>
            <button
                ref={triggerRef}
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
            {open && coords && createPortal(
                <span
                    ref={tooltipRef}
                    id={id}
                    role="dialog"
                    onClick={(e) => e.stopPropagation()}
                    style={{ top: coords.top, left: coords.left }}
                    className="fixed z-[9999] flex w-[220px] flex-col gap-1 rounded-[12px] border border-[#F49B31] bg-[#FEFEFE] p-3 text-left shadow-lg pointer-events-auto"
                >
                    <span className="font-poppins text-[13px] font-semibold text-[#171717]">{info.title}</span>
                    <span className="font-poppins text-[12px] font-medium leading-snug text-[#626665]">
                        {description ?? info.description}
                    </span>
                </span>,
                document.body
            )}
        </span>
    );
};

export default BadgeTooltip;
