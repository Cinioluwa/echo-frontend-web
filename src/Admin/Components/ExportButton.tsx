/**
 * Export Pings Button Component
 * Allow admins to export pings data as CSV
 */

import { useState } from "react";
import { analyticsService } from "../../api";

export const ExportPingsButton = () => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        try {
            setLoading(true);
            const blob = await analyticsService.exportPings();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `pings-export-${new Date().toISOString()}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            alert('Pings exported successfully!');
        } catch (error: any) {
            console.error('Failed to export pings:', error);
            alert('Failed to export pings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#F49B31] text-white rounded-lg hover:bg-[#d88429] transition disabled:opacity-50"
        >
            {loading ? (
                <>
                    <span className="animate-spin">⏳</span>
                    Exporting...
                </>
            ) : (
                <>
                    <span>📥</span>
                    Export CSV
                </>
            )}
        </button>
    );
};
