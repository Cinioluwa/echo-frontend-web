import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  EyeOff,
  AlertOctagon,
  Frown,
  XCircle,
  Megaphone,
  MoreHorizontal,
  ChevronDown,
  Check,
} from "lucide-react";
import reportService from "../../api/services/report.service";

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: "ping" | "wave" | "comment";
  entityId: number;
  onSuccess?: () => void;
  onReportStatus?: (status: "success" | "error", message?: string) => void;
}

interface OffenseOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  bgClass: string;
  textClass: string;
}

const OFFENSE_OPTIONS: OffenseOption[] = [
  {
    id: "Inappropriate content",
    label: "Inappropriate content",
    icon: EyeOff,
    bgClass: "bg-[#FFD7D7]",
    textClass: "text-[#B01212]",
  },
  {
    id: "Threats",
    label: "Threats",
    icon: AlertOctagon,
    bgClass: "bg-[#FFD7D7]",
    textClass: "text-[#B01212]",
  },
  {
    id: "Harassment",
    label: "Harassment",
    icon: Frown,
    bgClass: "bg-[#FFD6A5]",
    textClass: "text-[#A3651E]",
  },
  {
    id: "Misinformation",
    label: "Misinformation",
    icon: XCircle,
    bgClass: "bg-[#FFD6A5]",
    textClass: "text-[#A3651E]",
  },
  {
    id: "Other",
    label: "Other",
    icon: MoreHorizontal,
    bgClass: "bg-[#CACACA]",
    textClass: "text-[#454545]",
  },
  {
    id: "Spam",
    label: "Spam",
    icon: Megaphone,
    bgClass: "bg-[#FFD6A5]",
    textClass: "text-[#A3651E]",
  },
];

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  onSuccess,
  onReportStatus,
}) => {
  const [reason, setReason] = useState("");
  const [selectedOffenses, setSelectedOffenses] = useState<string[]>([]);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile dropdown when tapping outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(e.target as Node)
      ) {
        setIsMobileDropdownOpen(false);
      }
    };
    if (isMobileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileDropdownOpen]);

  if (!isOpen) return null;

  const handleToggleOffense = (id: string) => {
    setSelectedOffenses((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClose = () => {
    setReason("");
    setSelectedOffenses([]);
    setIsMobileDropdownOpen(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOffenses.length === 0 && !reason.trim()) {
      setError("Please select at least one offense or provide details.");
      return;
    }

    const fullReason = [
      selectedOffenses.length > 0 ? `[${selectedOffenses.join(", ")}]` : "",
      reason.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    try {
      setLoading(true);
      setError(null);
      await reportService.submitReport({
        [`${entityType}Id`]: entityId,
        reason: fullReason,
      });
      if (onReportStatus) onReportStatus("success");
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to submit report";
      setError(msg);
      if (onReportStatus) onReportStatus("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div
        className="bg-white rounded-[20px] p-5 sm:p-7 w-full max-w-[500px] shadow-2xl border border-black/10 relative flex flex-col gap-4 sm:gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header: Flag Icon + Title ─── */}
        <div className="flex flex-col items-center gap-2">
          {/* Orange Flag Icon matching Figma Vector #5829:18952 */}
          <svg
            width="42"
            height="60"
            viewBox="0 0 52 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[34px] h-[48px] sm:w-[42px] sm:h-[60px]"
          >
            <path
              d="M5 65V41M5 41V11M5 41L12.412 39.5177C17.3636 38.5274 22.4963 38.9984 27.1847 40.874C32.2655 42.9062 37.8572 43.2857 43.166 41.9585L43.8092 41.7977C45.6845 41.3288 47 39.644 47 37.7111V15.6101C47 13.2684 44.7995 11.5502 42.5276 12.1181C37.634 13.3415 32.4791 12.9917 27.7958 11.1183L27.1847 10.8739C22.4963 8.99852 17.3636 8.52728 12.412 9.51761L5 11M5 11V5"
              stroke="#F49B31"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </svg>
          <h2
            id="report-modal-title"
            className="text-[22px] sm:text-[28px] font-['Poppins',sans-serif] font-semibold text-[#000000] text-center tracking-tight"
          >
            Report the User?
          </h2>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-['Inter',sans-serif]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          {/* ─── Offense Box ─── */}
          <div className="border border-[#626665] rounded-[10px] p-3 sm:p-4 bg-white flex flex-col gap-2.5">
            {/* Desktop Layout: static 2-column grid of options */}
            <div className="hidden sm:block">
              <span className="block font-['Poppins',sans-serif] font-semibold text-[14px] text-black mb-3">
                Offense:
              </span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {OFFENSE_OPTIONS.map((opt) => {
                  const isChecked = selectedOffenses.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 cursor-pointer select-none group"
                    >
                      {/* Custom Checkbox */}
                      <div
                        className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
                          isChecked
                            ? "bg-[#F49B31] border-[#F49B31] text-white"
                            : "border-black/40 bg-white group-hover:border-black/60"
                        }`}
                      >
                        {isChecked && (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => handleToggleOffense(opt.id)}
                      />

                      {/* Violation Badge */}
                      <div
                        className={`${opt.bgClass} ${opt.textClass} px-3 py-1 rounded-[28.75px] font-['Poppins',sans-serif] font-medium text-[13px] flex items-center gap-1.5 shrink-0 transition-transform group-hover:scale-[1.02]`}
                      >
                        <opt.icon className="w-4 h-4 shrink-0" />
                        <span>{opt.label}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Mobile Layout: Expandable Dropdown with listed options when closed */}
            <div className="sm:hidden flex flex-col gap-2" ref={mobileDropdownRef}>
              <div className="flex items-center justify-between">
                <span className="font-['Poppins',sans-serif] font-semibold text-[13px] text-black">
                  Offense:
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs text-[#626665] font-['Poppins',sans-serif] hover:text-black transition-colors cursor-pointer py-0.5 px-1.5 rounded"
                >
                  <span>
                    {selectedOffenses.length === 0
                      ? "Select options"
                      : `${selectedOffenses.length} selected`}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMobileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Listed-out selected options when collapsed */}
              {!isMobileDropdownOpen && selectedOffenses.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {selectedOffenses.map((id) => {
                    const opt = OFFENSE_OPTIONS.find((o) => o.id === id);
                    if (!opt) return null;
                    return (
                      <div
                        key={opt.id}
                        className={`${opt.bgClass} ${opt.textClass} px-2.5 py-0.5 rounded-[28.75px] font-['Poppins',sans-serif] font-medium text-[11px] flex items-center gap-1 shrink-0`}
                      >
                        <opt.icon className="w-3 h-3 shrink-0" />
                        <span>{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Expanded Dropdown Options list */}
              {isMobileDropdownOpen && (
                <div className="flex flex-col gap-1.5 pt-2 border-t border-black/10 mt-1 max-h-[190px] overflow-y-auto">
                  {OFFENSE_OPTIONS.map((opt) => {
                    const isChecked = selectedOffenses.includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        className="flex items-center justify-between p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
                              isChecked
                                ? "bg-[#F49B31] border-[#F49B31] text-white"
                                : "border-black/40 bg-white"
                            }`}
                          >
                            {isChecked && (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            )}
                          </div>
                          <div
                            className={`${opt.bgClass} ${opt.textClass} px-2.5 py-0.5 rounded-[28.75px] font-['Poppins',sans-serif] font-medium text-[12px] flex items-center gap-1.5`}
                          >
                            <opt.icon className="w-3.5 h-3.5 shrink-0" />
                            <span>{opt.label}</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() => handleToggleOffense(opt.id)}
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ─── Description Box ─── */}
          <div className="border border-[#626665] rounded-[10px] px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 bg-white focus-within:border-black transition-colors">
            <span className="font-['Poppins',sans-serif] font-semibold text-[13px] sm:text-[14px] text-black shrink-0 sm:pt-0.5">
              Description :
            </span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onFocus={() => setIsMobileDropdownOpen(false)}
              placeholder="“Add more details or context (optional)”"
              rows={2}
              className="w-full bg-transparent outline-none text-xs sm:text-sm text-[#060B13] placeholder:italic placeholder:text-[#7D7D7D] resize-none font-['Poppins',sans-serif] min-h-[46px] leading-relaxed"
              disabled={loading}
            />
          </div>

          {/* ─── Action Buttons ─── */}
          <div className="flex items-center gap-[15px] w-full pt-1">
            <button
              type="submit"
              disabled={
                loading ||
                (selectedOffenses.length === 0 && !reason.trim())
              }
              className="flex-1 h-[47px] bg-[#F49B31] text-white hover:bg-[#d88429] font-['Poppins',sans-serif] font-medium text-[14px] rounded-[12.75px] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Report"
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 h-[47px] bg-[#FEF5EA] border-[1.5px] border-[#F49B31] text-[#F49B31] hover:bg-[#FDEBD0] font-['Poppins',sans-serif] font-medium text-[14px] rounded-[12.75px] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default ReportModal;
