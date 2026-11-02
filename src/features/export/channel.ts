const CHANNEL_NAME = "echo-pdf-export";

export type ExportKind = "ping" | "soundboard";

export interface ExportMessage {
    requestId: string;
    status: "ready" | "error";
    message?: string;
}

export const openExportChannel = () => new BroadcastChannel(CHANNEL_NAME);

export const exportUrl = (kind: ExportKind, requestId: string, pingId?: string | number) =>
    kind === "ping"
        ? `/print/ping/${pingId}?rid=${requestId}`
        : `/print/soundboard?rid=${requestId}`;
