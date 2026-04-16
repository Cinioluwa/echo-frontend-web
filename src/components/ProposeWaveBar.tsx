/**
 * ProposeWaveBar
 * Figma ref: 4792:11909
 * Phase: 10
 *
 * Collapsible bar for proposing a wave on a ping.
 * Default state: compact input bar
 * Active state: expanded with attach icon and propose button
 * Smooth animated transitions between states
 * Collapses only when clicking outside the form
 * Supports file uploads (images, videos, documents)
 */
import { useState, useRef, useEffect } from "react";
import { useAuthStore, useWavesStore } from "../stores";
import { waveService, uploadService } from "../api/services";
import type { Wave } from "../api/types";
import UserAvatar from "./UserAvatar";

const waveIcon = "/assets/icon/wave.svg";
const attachIcon = "/assets/icon/attach-circle.svg";

interface Props {
  pingId: string;
  pingTitle?: string;
  pingCreatedAt?: string;
  onWaveProposed?: (createdWave: Wave) => void;
}

interface UploadedFile {
  id: number;
  url: string;
  filename: string;
  mimeType: string;
  size?: number;
}

const ProposeWaveBar = ({ pingId, onWaveProposed }: Props) => {
  const [solution, setSolution] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuthStore();

  const getErrorMessage = (err: any): string => {
    // Check for detailed validation errors from backend
    if (
      err.response?.data?.details &&
      Array.isArray(err.response.data.details)
    ) {
      const messages = err.response.data.details
        .map((detail: any) => detail.message)
        .filter(Boolean);
      if (messages.length > 0) {
        return messages.join(". ");
      }
    }

    // Fall back to top-level error message
    if (err.response?.data?.error) {
      return err.response.data.error;
    }

    // Default error message
    return "Failed to propose wave. Please try again.";
  };

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isActive]);

  const handleFocus = () => {
    setIsActive(true);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSolution(e.target.value);
    // Dynamic auto-resize
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const media = await uploadService.uploadFiles(files, "wave");
      setUploadedFiles((prev) => [...prev, ...media]);
    } catch (err: any) {
      console.error("File upload failed:", err);
      setError(
        err.response?.data?.error || "Failed to upload files. Please try again."
      );
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeFile = (fileId: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!solution.trim()) {
      setError("Please enter a solution");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const mediaIds = uploadedFiles.map((f) => f.id);
      const createdWave = await waveService.createWaveForPing(
        pingId,
        solution.trim(),
        mediaIds.length > 0 ? mediaIds : undefined,
      );
      useWavesStore.getState().addWave(createdWave);
      setSolution("");
      setUploadedFiles([]);
      setIsActive(false);
      onWaveProposed?.(createdWave);
    } catch (err: any) {
      console.error("Failed to propose wave:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-white rounded-[16px] md:rounded-[25px] mb-4 md:mb-5 p-2 md:p-2.5 flex items-start gap-2 md:gap-[13px] w-full max-w-full transition-all duration-300"
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        disabled={isUploading || isSubmitting}
        className="hidden"
        accept="image/*,video/*,.pdf"
      />

      {/* Avatar */}
      <div className="shrink-0 size-[38px] md:size-[50px] flex items-center justify-center mt-1 md:mt-1.5">
        <UserAvatar user={user} size="md" responsive bgColor="bg-[#ffc37b]" />
      </div>

      {/* Main input container */}
      <div className="flex-1 min-w-0 transition-all duration-300">
        {/* Input area - animates height and content */}
        <div className="w-full bg-[#fefefe] border-2 border-[#ffc37b] rounded-[16px] md:rounded-[20px] overflow-hidden transition-all duration-300">
          {/* Expanded state: textarea with controls */}
          <div
            className={`flex flex-col transition-all duration-300 ${isActive
              ? "max-h-[600px] opacity-100 px-3 md:px-4 pt-3 pb-2 md:pt-4 md:pb-2.5"
              : "max-h-0 opacity-0 overflow-hidden"
              }`}
          >
            {/* Textarea - expands when active */}
            <textarea
              ref={textareaRef}
              value={solution}
              onChange={handleChange}
              placeholder="What's your solution?"
              className="flex-1 w-full bg-[#fefefe] border-0 px-0 py-0 text-[13px] md:text-[14px] leading-[1.5] text-black outline-none resize-none font-['Poppins',sans-serif] font-medium placeholder:text-[#9e9e9e] placeholder:font-medium min-h-[80px] md:min-h-[100px] overflow-hidden focus:ring-0"
              rows={3}
              disabled={isSubmitting || isUploading}
            />

            {/* Uploaded files preview */}
            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 pb-2 border-b border-[#ffc37b]">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-1 bg-[#fff9f0] px-2.5 py-1 rounded-lg text-xs text-[#454545]"
                  >
                    <span className="truncate max-w-[150px]">
                      {file.filename}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      disabled={isSubmitting}
                      className="shrink-0 text-[#ffc37b] hover:text-[#F49B31] transition-colors"
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Controls row: attach icon + button */}
            <div className="mt-1.5 md:mt-2 flex items-center justify-between gap-2">
              {/* Attach icon button */}
              <button
                type="button"
                onClick={handleAttachClick}
                disabled={isSubmitting || isUploading}
                className="shrink-0 size-6 md:size-[30px] flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-50"
                title="Attach file"
              >
                <img
                  src={attachIcon}
                  alt="Attach"
                  className="size-6 md:size-[30px]"
                />
              </button>

              {/* Propose button */}
              <button
                type="submit"
                disabled={isSubmitting || isUploading || !solution.trim()}
                className="bg-[#fef5ea] border border-black rounded-[16px] md:rounded-[20px] px-2 md:px-2.5 py-1 md:py-1.5 flex items-center gap-1 md:gap-[5px] cursor-pointer hover:bg-[#f9eedb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 self-end"
              >
                {/* Wave icon */}
                <img src={waveIcon} alt="Wave" className="size-5 md:size-6" />
                <span className="font-['Baloo_Bhai_2',sans-serif] font-bold text-[12px] md:text-[14px] text-black uppercase whitespace-nowrap">
                  {isUploading
                    ? "Uploading..."
                    : isSubmitting
                      ? "Proposing..."
                      : "Propose a Wave"}
                </span>
              </button>
            </div>
          </div>

          {/* Compact state: simple textarea */}
          <textarea
            value={solution}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder="What's your solution?"
            className={`w-full bg-[#fefefe] border-0 px-3 md:px-4 py-2 md:py-2.5 text-[13px] md:text-[14px] leading-[1.35] text-black outline-none resize-none font-['Poppins',sans-serif] font-medium placeholder:text-[#9e9e9e] placeholder:font-medium focus:ring-0 transition-all duration-300 ${isActive
              ? "max-h-0 opacity-0 overflow-hidden pointer-events-none py-0"
              : "max-h-[44px] md:max-h-[50px] opacity-100"
              }`}
            rows={1}
            disabled={isSubmitting || isUploading}
          />
        </div>
      </div>

      {/* Error message - displayed when active */}
      {error && isActive && (
        <p className="text-red-500 text-xs px-5 py-1 w-full basis-full">{error}</p>
      )}
    </form>
  );
};

export default ProposeWaveBar;
