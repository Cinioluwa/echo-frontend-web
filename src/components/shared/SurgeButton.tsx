/**
 * SurgeButton — Reusable surge/upvote button
 * Figma ref: 3677:10637 (Feed Button variants)
 * Phase: 5
 *
 * Two states:
 *  - Default (surged=false): light yellow bg (#fef5ea), black border, dark text
 *  - Active  (surged=true):  orange bg (#f49b31), white text
 *
 */

import SurgeIcon from "./SurgeIcon";

interface SurgeButtonProps {
    count: number;
    surged?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

const SurgeButton = ({
    count,
    surged = false,
    onClick,
    disabled = false,
    className,
}: SurgeButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-pressed={surged}
            aria-label={`Surge — ${count} surges`}
            className={`
        border border-solid flex gap-[5px] items-center justify-center
        px-2.5 py-[5px] rounded-[15px] transition-colors duration-200
        ${surged
                    ? "bg-[var(--echo-accent)] border-[var(--echo-border-f49b31)] text-[var(--echo-text-on-accent)]"
                    : "bg-[var(--echo-surface-soft)] border-black text-[var(--echo-text-4a504e)]"
                }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className ?? ""}
      `}
        >
            <SurgeIcon
                width={12}
                height={16}
                fill={surged ? "white" : "var(--echo-text-4a504e)"}
                className="shrink-0"
                aria-hidden="true"
            />

            {/* Count */}
            <span className={`font-semibold text-[14px] leading-normal text-right whitespace-nowrap font-poppins ${surged ? "text-[var(--echo-text-on-accent)]" : "text-[var(--echo-text-4a504e)]"}`}>
                {count}
            </span>
        </button>
    );
};

export default SurgeButton;
