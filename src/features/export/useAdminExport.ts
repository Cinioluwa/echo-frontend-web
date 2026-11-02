import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createElement } from "react";
import { useAuthStore } from "../../stores";
import { ToastContainer, type ToastItem } from "../../components/shared/Toast";
import { exportUrl, openExportChannel, type ExportKind, type ExportMessage } from "./channel";

const TIMEOUT_MS = 45_000;

/** Same admin test AdminRoute uses for full admin access. */
export const useCanExport = () => {
    const role = useAuthStore((s) => s.user?.role);
    return role === "ADMIN" || role === "SUPER_ADMIN";
};

/**
 * Opens the print route in a new tab and tracks it until the tab reports that data has
 * loaded (and the print dialog is opening) or failed.
 */
export const useAdminExport = (kind: ExportKind, pingId?: string | number) => {
    const canExport = useCanExport();
    const [exporting, setExporting] = useState(false);
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const cleanupRef = useRef<(() => void) | null>(null);

    useEffect(() => () => cleanupRef.current?.(), []);

    const fail = useCallback(() => {
        setToasts((prev) => [...prev, { id: `${Date.now()}`, variant: "export-failed", duration: 5000 }]);
    }, []);

    const startExport = useCallback(() => {
        if (!canExport || exporting) return;
        if (kind === "ping" && !pingId) return;

        const requestId = crypto.randomUUID();
        const channel = openExportChannel();
        const timeout = { id: 0 };

        const finish = () => {
            window.clearTimeout(timeout.id);
            channel.close();
            cleanupRef.current = null;
            setExporting(false);
        };

        channel.onmessage = (event: MessageEvent<ExportMessage>) => {
            if (event.data?.requestId !== requestId) return;
            finish();
            if (event.data.status === "error") fail();
        };

        setExporting(true);
        const tab = window.open(exportUrl(kind, requestId, pingId), "_blank");
        if (!tab) {
            finish();
            fail();
            return;
        }
        cleanupRef.current = finish;
        timeout.id = window.setTimeout(() => {
            finish();
            fail();
        }, TIMEOUT_MS);
    }, [canExport, exporting, kind, pingId, fail]);

    const toastNode: ReactNode = createElement(ToastContainer, {
        toasts,
        position: "top-center",
        onDismiss: (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    });

    return { canExport, exporting, startExport, toastNode };
};
