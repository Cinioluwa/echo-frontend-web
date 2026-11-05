import React from "react";
import type { StatusEvent } from "./types";

interface StatusTimelineProps {
    events: StatusEvent[];
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ events }) => {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[#f49b31] bg-white p-[21px]">
            <h3 className="font-poppins text-[18px] font-semibold text-black">Status Timeline</h3>
            <div className="flex flex-col">
                {events.map((event, idx) => (
                    <div
                        key={idx}
                        className={`flex items-center gap-3 py-2 ${idx < events.length - 1 ? "border-b-[0.5px] border-[#ffc37b]" : ""}`}
                    >
                        <div className="h-[27px] w-[7px] shrink-0 rounded-full bg-[#f49b31]" />
                        <div className="flex flex-col">
                            <p className="font-poppins text-[10px] font-medium text-black">{event.status}</p>
                            <p className="font-poppins text-[8px] text-[#454545]">{event.timestamp}</p>
                            {event.description && (
                                <p className="font-poppins text-[8px] text-[#454545]">{event.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusTimeline;
