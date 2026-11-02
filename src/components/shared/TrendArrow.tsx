import React from "react";

export type TrendDirection = "up" | "down";

interface TrendArrowProps {
    direction: TrendDirection;
    size?: number;
    className?: string;
}

const ARROW_URL = "url(/assets/icon/back-arrow.svg)";

/** The "Go back" arrow, rotated to point up or down and tinted with the surrounding text colour. */
const TrendArrow: React.FC<TrendArrowProps> = ({ direction, size = 12, className = "" }) => (
    <span
        aria-hidden="true"
        className={`inline-block shrink-0 bg-current ${className}`}
        style={{
            width: size,
            height: size,
            WebkitMask: `${ARROW_URL} center / contain no-repeat`,
            mask: `${ARROW_URL} center / contain no-repeat`,
            transform: direction === "up" ? "rotate(90deg)" : "rotate(-90deg)",
        }}
    />
);

export default TrendArrow;
