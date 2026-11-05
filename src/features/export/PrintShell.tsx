import { useEffect, useRef, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../stores";
import { openExportChannel } from "./channel";
import { formatAbsolute } from "./format";
import "./print.css";

interface PrintShellProps {
    /** Repeated in the page footer, e.g. the ping title or "Soundboard". */
    footerTitle: string;
    filename: string;
    status: "loading" | "error" | "ready";
    errorMessage?: string;
    children: ReactNode;
}

const cssString = (text: string) =>
    `"${text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/[\r\n]+/g, " ").slice(0, 90)}"`;

const waitForImages = () =>
    Promise.all(
        Array.from(document.images)
            .filter((img) => !img.complete)
            .map((img) => new Promise<void>((resolve) => {
                img.addEventListener("load", () => resolve(), { once: true });
                img.addEventListener("error", () => resolve(), { once: true });
            })),
    );

/**
 * Page chrome for an export: header, footer title, and the print lifecycle
 * (set the file name as the title, wait for fonts/images, report back, open the print dialog once).
 */
const PrintShell = ({ footerTitle, filename, status, errorMessage, children }: PrintShellProps) => {
    const [params] = useSearchParams();
    const requestId = params.get("rid");
    const user = useAuthStore((s) => s.user);
    const printedRef = useRef(false);
    const reportedRef = useRef(false);

    useEffect(() => {
        if (status === "ready") document.title = filename;
    }, [status, filename]);

    useEffect(() => {
        if (status === "loading" || reportedRef.current) return;
        reportedRef.current = true;
        const channel = openExportChannel();
        if (requestId) {
            channel.postMessage({
                requestId,
                status: status === "ready" ? "ready" : "error",
                message: errorMessage,
            });
        }
        channel.close();

        if (status === "error") {
            if (requestId) window.close();
            return;
        }
        if (printedRef.current) return;
        printedRef.current = true;
        void (async () => {
            await document.fonts.ready;
            await waitForImages();
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            window.print();
        })();
    }, [status, requestId, errorMessage]);

    const adminName = user ? `${user.firstName} ${user.lastName}`.trim() : "Admin";

    return (
        <div className="ep-root">
            <style>{`@page { @bottom-left { content: ${cssString(footerTitle)}; font-family: "Poppins", sans-serif; font-size: 8pt; color: #854f0b; } }`}</style>
            {status === "loading" && <div className="ep-state">Preparing your export…</div>}
            {status === "error" && (
                <div className="ep-state ep-state--error" role="alert">
                    {errorMessage || "Export failed. Please try again."}
                </div>
            )}
            {status === "ready" && (
                <>
                    <div className="ep-toolbar">
                        <span>Choose “Save as PDF” in the print dialog. Suggested file name: {filename}</span>
                        <button type="button" onClick={() => window.print()}>
                            Save as PDF
                        </button>
                    </div>
                    <div className="ep-page">
                        <header className="ep-header">
                            <div>
                                <img src="/echo-logo-coloured.svg" alt="Echo" />
                                {user?.organization?.name && <p className="ep-institution">{user.organization.name}</p>}
                            </div>
                            <p className="ep-generated">
                                Generated on {formatAbsolute(new Date())}
                                <br />
                                by {adminName}
                            </p>
                        </header>
                        {children}
                    </div>
                </>
            )}
        </div>
    );
};

export default PrintShell;
