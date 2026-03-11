/**
 * PingDetail
 * Figma ref: Right frame in 3643:8353 (desktop), middle frame in 4170:11821 (mobile)
 * Phase: 3 (placeholder created in Phase 1 for routing)
 *
 * TODO: Phase 3 — Full implementation with:
 * - Back button to feed
 * - ProposeWaveBar
 * - Full ping card content
 * - Wave proposals list
 * - CommentsPanel
 */
import { useParams } from "react-router-dom";

const PingDetail = () => {
    const { pingId } = useParams<{ pingId: string }>();

    return (
        <div>
            <h1 className="text-[22px] font-semibold mb-4">Ping Detail</h1>
            <p className="text-gray-500 text-sm">
                Viewing ping #{pingId} — full detail view coming in Phase 3.
            </p>
            {/* TODO: Phase 3 — Back button, ProposeWaveBar, full ping card, waves, comments */}
        </div>
    );
};

export default PingDetail;
