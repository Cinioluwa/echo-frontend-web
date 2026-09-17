import React, { useState } from "react";
import reportService from "../../api/services/report.service";

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: "ping" | "wave" | "comment";
  entityId: number;
  onSuccess?: () => void;
  onReportStatus?: (status: "success" | "error", message?: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  onSuccess,
  onReportStatus,
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for reporting.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await reportService.submitReport({
        [`${entityType}Id`]: entityId,
        reason: reason.trim(),
      });
      if (onReportStatus) onReportStatus("success");
      if (onSuccess) onSuccess();
      setReason("");
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Failed to submit report";
      setError(msg);
      if (onReportStatus) onReportStatus("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-poppins font-semibold text-[#212121] mb-2">Report Content</h2>
        <p className="text-[#5e5c58] font-poppins text-sm mb-4">
          Please let us know why you are reporting this content. Our moderation team will review it.
        </p>

        {error && (
          <div className="w-full p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-poppins">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for reporting (e.g. Spam, Inappropriate, Harassment)..."
            className="w-full min-h-[120px] p-4 bg-[#fcfcfc] border border-[#e5e5e5] rounded-[15px] font-poppins text-sm text-[#212121] placeholder-[#8b8e8d] focus:outline-none focus:border-[#f49b31] resize-none mb-6"
            required
            disabled={loading}
          />

          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-white border border-[#e5e5e5] rounded-xl font-poppins font-medium text-sm text-[#414141] hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex-1 py-3 px-4 bg-[#f49b31] rounded-xl font-poppins font-medium text-sm text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Submit Report"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
