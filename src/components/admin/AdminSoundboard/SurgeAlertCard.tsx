import React from "react";
import SurgeIcon from "../../shared/SurgeIcon";

export interface SurgeItem {
    id: string;
    title: string;
    /** Surges gained per hour over the recent window */
    velocity: number;
    category: string;
    onClick?: () => void;
}

interface SurgeAlertCardProps {
    items: SurgeItem[];
    className?: string;
}

const SurgeAlertCard: React.FC<SurgeAlertCardProps> = ({
    items,
    className = "",
}) => {
    const hasSurges = items.length > 0;

    return (
        <div
            className={`min-w-0 min-h-[250px] rounded-xl p-5 flex flex-col gap-[15px] ${hasSurges ? "bg-[var(--echo-accent)] border border-[var(--echo-border-f49b31)]" : "bg-[var(--echo-surface)] border border-[rgba(244,155,49,0.4)]"} ${className}`}
            data-node-id="surge-alert-card"
        >
            {hasSurges ? (
                <>
                    <h3 className="font-poppins text-[var(--echo-text-fef5ea)] font-semibold text-[18px] leading-6 uppercase tracking-[0.6px]">
                        {items.length} surging {items.length === 1 ? "issue needs" : "issues need"} attention
                    </h3>
                    <div className="flex min-w-0 flex-col gap-2.5">
                        {items.map((item, index) => (
                            <button
                                type="button"
                                key={item.id || index}
                                onClick={item.onClick}
                                className="w-full min-w-0 bg-[var(--echo-surface-soft)] rounded-lg px-3 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left hover:bg-[var(--echo-bg-fde8d0)] transition-colors"
                            >
                                <span className="min-w-0 flex-1 text-[var(--echo-text-primary)] font-poppins font-medium text-[14px] leading-[19.5px]">
                                    {item.title}
                                </span>
                                <span className="flex max-w-full flex-wrap gap-2 sm:ml-3 sm:justify-end">
                                    <span
                                        className="bg-[var(--echo-accent)] rounded-[20px] px-2 py-0.5 flex items-center gap-0.5"
                                        title="Surges gained per hour"
                                    >
                                        <span className="text-[var(--echo-text-on-accent)] font-poppins font-medium text-[11px] leading-[16.5px] whitespace-nowrap">+</span>
                                        <SurgeIcon width={8} height={11} fill="var(--echo-text-ffffff)" />
                                        <span className="text-[var(--echo-text-on-accent)] font-poppins font-medium text-[11px] leading-[16.5px] whitespace-nowrap">
                                            {Number(item.velocity.toFixed(1))}/hr
                                        </span>
                                    </span>
                                    <span className="bg-[var(--echo-surface)] border border-[var(--echo-border-f49b31)] rounded-[20px] px-2 py-0.5 flex items-center">
                                        <span className="text-[var(--echo-text-f49b31)] font-poppins font-semibold text-[11px] leading-[16.5px] whitespace-nowrap">
                                            {item.category}
                                        </span>
                                    </span>
                                </span>
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 py-6 text-center">
                    <SurgeIcon width={24} height={32} fill="var(--echo-text-f49b31)" />
                    <p className="font-poppins text-[16px] font-semibold text-[var(--echo-text-primary)]">
                        No Surging Issues.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SurgeAlertCard;
