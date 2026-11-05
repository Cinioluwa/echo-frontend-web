import React from "react";

interface ModerationCardProps {
    label: string;
    count: number;
    subtitle: string;
}

const ModerationCard: React.FC<ModerationCardProps> = ({ label, count, subtitle }) => {
    return (
        <div className="bg-[var(--echo-surface)] border-[0.5px] border-[var(--echo-border-ffc37b)] rounded-xl p-6 flex flex-col gap-1 flex-1 min-w-0">
            <p className="font-poppins font-medium text-[15px] text-[var(--echo-text-f49b31)]">
                {label}
            </p>
            <div className="flex items-center justify-center">
                <p className="font-poppins font-semibold text-[35px] text-[var(--echo-text-primary)] leading-10">
                    {count}
                </p>
            </div>
            <p className="font-poppins font-medium text-[10px] text-[var(--echo-text-primary)]">
                {subtitle}
            </p>
        </div>
    );
};

export default ModerationCard;
