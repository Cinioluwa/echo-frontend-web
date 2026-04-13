/**
 * Toast — Acknowledgement toast notifications
 * Figma ref: 3878:9112 (ping posted), 3878:9115 (wave posted), 4167:11818 (ping deleted)
 * Phase: 5
 *
 * Three variants:
 *  - "ping"    → "Ping Posted Successfully"  (orange bg #ffc37b, dark text)
 *  - "wave"    → "Wave Posted Successfully"  (orange bg #ffc37b, dark text)
 *  - "deleted" → "Ping Deleted!"             (red bg #eb5050, white text)
 *
 * Auto-dismisses after `duration` ms (default 3000).
 * Mount via ToastProvider or render directly and control visibility from parent.
 */

import { useEffect, useState } from "react";

export type ToastVariant = "ping" | "wave" | "deleted" | "copied";

interface ToastProps {
    variant: ToastVariant;
    /** Auto-dismiss delay in ms. Default: 3000. Pass 0 to disable auto-dismiss. */
    duration?: number;
    onDismiss?: () => void;
}

const TOAST_CONFIG: Record<
    ToastVariant,
    { message: string; bg: string; textColor: string; iconBg: string }
> = {
    ping: {
        message: "Ping Posted Successfully",
        bg: "bg-[#ffc37b]",
        textColor: "text-[#454545]",
        iconBg: "bg-[#f49b31]",
    },
    wave: {
        message: "Wave Posted Successfully",
        bg: "bg-[#ffc37b]",
        textColor: "text-[#454545]",
        iconBg: "bg-[#f49b31]",
    },
    deleted: {
        message: "Ping Deleted!",
        bg: "bg-[#eb5050]",
        textColor: "text-white",
        iconBg: "bg-[#c83030]",
    },
    copied: {
        message: "Link copied to clipboard",
        bg: "bg-[#ffc37b]",
        textColor: "text-[#454545]",
        iconBg: "bg-[#f49b31]",
    },
};

const Toast = ({ variant, duration = 3000, onDismiss }: ToastProps) => {
    const [visible, setVisible] = useState(true);
    const config = TOAST_CONFIG[variant];

    useEffect(() => {
        if (duration <= 0) return;
        const timer = setTimeout(() => {
            setVisible(false);
            onDismiss?.();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onDismiss]);

    if (!visible) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className={`
        ${config.bg} flex gap-2 items-center overflow-hidden
        px-[11px] py-2.5 rounded-[15px]
        font-poppins shadow-lg
      `}
        >
            {/* Icon circle */}
            <div
                className={`${config.iconBg} rounded-full shrink-0 w-[30px] h-[30px] flex items-center justify-center mix-blend-luminosity`}
            >
                {variant === "deleted" ? (
                    /* Trash icon for deleted */
                    <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M13 4H3M6 4V3C6 2.73478 6.10536 2.48043 6.29289 2.29289C6.48043 2.10536 6.73478 2 7 2H9C9.26522 2 9.51957 2.10536 9.70711 2.29289C9.89464 2.48043 10 2.73478 10 3V4M5.5 7L5.75 12M10.5 7L10.25 12M8 7V12M3 4L3.75 13C3.75 13.1989 3.82902 13.3897 3.96967 13.5303C4.11032 13.671 4.30109 13.75 4.5 13.75H11.5C11.6989 13.75 11.8897 13.671 12.0303 13.5303C12.171 13.3897 12.25 13.1989 12.25 13L13 4"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : variant === "copied" ? (
                    /* Link/copy icon for copied */
                    <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M6.5 2H4C3.44772 2 3 2.44772 3 3V4M6.5 2H10C10.5523 2 11 2.44772 11 3V11C11 11.5523 10.5523 12 10 12H3C2.44772 12 2 11.5523 2 11V6.5M6.5 2H6C5.44772 2 5 2.44772 5 3V5M12 5H8C7.44772 5 7 5.44772 7 6V14C7 14.5523 7.44772 15 8 15H14C14.5523 15 15 14.5523 15 14V6C15 5.44772 14.5523 5 14 5Z"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : (
                    /* Check/tick icon for posted */
                    <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M13.5 4.5L6.5 11.5L3 8"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>

            {/* Message */}
            <p className={`font-medium text-[16px] leading-normal whitespace-nowrap ${config.textColor}`}>
                {config.message}
            </p>
        </div>
    );
};

export default Toast;

/**
 * ToastContainer — renders toasts at a fixed position on screen.
 * Usage:
 *   <ToastContainer toasts={[{ id: '1', variant: 'ping' }]} onDismiss={(id) => removeToast(id)} />
 */
export interface ToastItem {
    id: string;
    variant: ToastVariant;
    duration?: number;
}

interface ToastContainerProps {
    toasts: ToastItem[];
    onDismiss: (id: string) => void;
    position?: "bottom-center" | "top-center";
}

export const ToastContainer = ({
    toasts,
    onDismiss,
    position = "bottom-center",
}: ToastContainerProps) => {
    const positionClass =
        position === "top-center"
            ? "top-6"
            : "bottom-6";

    if (toasts.length === 0) return null;

    return (
        <div
            className={`fixed left-1/2 -translate-x-1/2 ${positionClass} z-100 flex flex-col gap-2 items-center`}
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    variant={toast.variant}
                    duration={toast.duration}
                    onDismiss={() => onDismiss(toast.id)}
                />
            ))}
        </div>
    );
};
