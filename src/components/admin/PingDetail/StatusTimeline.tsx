import React from "react";
import type { StatusEvent } from "./types";

interface StatusTimelineProps {
    events: StatusEvent[];
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ events }) => {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--echo-border-f49b31)] bg-[var(--echo-surface)] p-[21px]">
            <h3 className="font-poppins text-[18px] font-semibold text-[var(--echo-text-primary)]">Status Timeline</h3>
            <div className="flex flex-col">
                {events.map((event, idx) => (
                    <div
                        key={idx}
                        className={`flex items-center gap-3 py-2 ${idx < events.length - 1 ? "border-b-[0.5px] border-[var(--echo-border-ffc37b)]" : ""}`}
                    >
                        <div className="h-[27px] w-[7px] shrink-0 rounded-full bg-[var(--echo-accent)]" />
                        <div className="flex flex-col">
                            <p className="font-poppins text-[10px] font-medium text-[var(--echo-text-primary)]">{event.status}</p>
                            <p className="font-poppins text-[8px] text-[var(--echo-text-454545)]">{event.timestamp}</p>
                            {event.description && (
                                <p className="font-poppins text-[8px] text-[var(--echo-text-454545)]">{event.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusTimeline;
