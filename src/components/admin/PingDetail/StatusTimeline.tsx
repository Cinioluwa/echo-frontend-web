import React from "react";
import type { StatusEvent } from "./types";

interface StatusTimelineProps {
    events: StatusEvent[];
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ events }) => {
    return (
        <div className="bg-[#fef5ea] border border-[#ffc37b] rounded-xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
            <h3 className="font-poppins font-semibold text-[16px] sm:text-[18px] text-black">
                Status Timeline
            </h3>
            <div className="flex flex-col gap-2 sm:gap-3">
                {events.map((event, idx) => (
                    <div key={idx} className="flex gap-2 sm:gap-3 items-start">
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-[#f49b31] rounded-full shrink-0 mt-1 sm:mt-1.5" />
                            {idx < events.length - 1 && (
                                <div className="w-0.5 h-6 sm:h-8 bg-[#ffc37b] my-1" />
                            )}
                        </div>
                        <div className="flex-1 pt-1">
                            <p className="font-poppins font-semibold text-[12px] sm:text-[14px] text-black">
                                {event.status}
                            </p>
                            <p className="font-poppins font-medium text-[10px] sm:text-[12px] text-[#8b8e8d]">
                                {event.timestamp}
                            </p>
                            {event.description && (
                                <p className="font-poppins font-medium text-[10px] sm:text-[11px] text-[#626665] mt-1">
                                    {event.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusTimeline;
