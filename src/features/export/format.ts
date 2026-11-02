const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Absolute date, e.g. "24 Oct 2026". */
export const formatAbsoluteDate = (value: string | Date): string => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Unknown date";
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

/** Absolute date and 24h time, e.g. "24 Oct 2026, 22:32". */
export const formatAbsolute = (value: string | Date): string => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Unknown date";
    return `${formatAbsoluteDate(d)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const isoDate = (d: Date = new Date()): string =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const slugify = (text: string, maxLength = 40): string =>
    text
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, maxLength)
        .replace(/-+$/g, "") || "ping";

export const pingFilename = (title: string, date: Date = new Date()) =>
    `echo-ping-${slugify(title)}-${isoDate(date)}.pdf`;

export const soundboardFilename = (date: Date = new Date()) => `echo-soundboard-${isoDate(date)}.pdf`;

export const daysBetween = (from: string | Date, to: string | Date = new Date()): number =>
    Math.max(0, Math.floor((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000));
