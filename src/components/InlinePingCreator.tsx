/**
 * InlinePingCreator
 * Figma ref: 3843:8597 (desktop 3 variants), 3912:9408 (mobile 3 variants)
 * Phase: 2
 *
 * Expandable inline form that replaces the modal-first ping creation approach.
 * State 1 — Collapsed: avatar + "What's the problem?" clickable bar
 * State 2 — Expanded: title + body inputs + category dropdown + attach + Post button
 * Matches PingFormModal structure with simple photo display (no grid layouts)
 */

import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from "react";
import { useAuthStore, usePingsStore } from "../stores";
import { pingService, uploadService, categoryService } from "../api/services";
import UserAvatar from "./UserAvatar";
import { ChevronDown, Trash2 } from "lucide-react";
import { FaLink } from "react-icons/fa6";
import type { CategoryData } from "../api/types/index";
import OptionalPingContext, {
  type OptionalPingContextValue,
} from "./OptionalPingContext";
import institutionAdminService, {
  type RepresentativeBody,
} from "../api/services/institutionAdmin.service";

type ExpansionState = "collapsed" | "expanded";

export interface InlinePingCreatorHandle {
  expand: () => void;
}

interface PingData {
  title: string;
  description: string;
  categoryId: number;
  categoryName: string;
  anonymous: boolean;
  photos: File[];
  context: OptionalPingContextValue;
}

const InlinePingCreator = forwardRef<InlinePingCreatorHandle>((_, ref) => {
  const user = useAuthStore((state) => state.user);
  const [state, setState] = useState<ExpansionState>("collapsed");

  // Ping form state
  const [pingData, setPingData] = useState<PingData>({
    title: "",
    description: "",
    categoryId: 0,
    categoryName: "",
    anonymous: false,
    photos: [],
    context: { targetDepartmentId: null, targetLevel: null, targetHall: "", targetBodyId: null },
  });

  // UI state
  const [isPosting, setIsPosting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  // Permissions & members-only ping state
  const isAdmin =
    user?.role === "LEADER" ||
    user?.role === "SUPER_ADMIN" ||
    (user?.role as string) === "ADMIN";
  const userRepBodyId = user?.representativeProfile?.bodyId;
  const isRep = Boolean(userRepBodyId && user?.representativeProfile?.isActive);
  const canPostMembersOnly = isAdmin || isRep;

  const [isMembersOnly, setIsMembersOnly] = useState(false);
  const [visibilityBodyId, setVisibilityBodyId] = useState<number | null>(
    userRepBodyId ?? null
  );
  const [availableBodies, setAvailableBodies] = useState<RepresentativeBody[]>([]);

  useEffect(() => {
    if (canPostMembersOnly) {
      if (isAdmin) {
        institutionAdminService
          .getBodies()
          .then((bodies) => {
            setAvailableBodies(bodies);
            if (bodies.length > 0 && !visibilityBodyId) {
              setVisibilityBodyId(bodies[0].id);
            }
          })
          .catch((err) =>
            console.error("Failed to load bodies for members-only ping", err)
          );
      } else if (isRep && userRepBodyId) {
        const repBody = user?.representativeProfile?.body;
        setAvailableBodies([
          {
            id: userRepBodyId,
            name: (repBody as any)?.name || "My Representative Body",
            slug: (repBody as any)?.slug || "body",
          },
        ]);
        setVisibilityBodyId(userRepBodyId);
      }
    }
  }, [canPostMembersOnly, isAdmin, isRep, userRepBodyId, user?.representativeProfile?.body]);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const postMenuRef = useRef<HTMLDivElement>(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
      if (
        postMenuRef.current &&
        !postMenuRef.current.contains(event.target as Node)
      ) {
        setShowPostMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Expose expand method to parent components
  useImperativeHandle(ref, () => ({
    expand: () => setState("expanded"),
  }));

  // Handlers
  const handleCollapsedClick = () => {
    setState("expanded");
  };

  const handleCancel = () => {
    setState("collapsed");
    setPingData({
      title: "",
      description: "",
      categoryId: 0,
      categoryName: "",
      anonymous: false,
      photos: [],
      context: { targetDepartmentId: null, targetLevel: null, targetHall: "" },
    });
    setErrors({});
    setUploadError(null);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = pingData.photos.length + newFiles.length;

    if (totalFiles > 3) {
      setUploadError("You can only upload up to 3 photos");
      return;
    }

    setPingData((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles] }));
    setUploadError(null);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPingData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!pingData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!pingData.categoryId || pingData.categoryId === 0) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsPosting(true);
    setUploadError(null);

    let mediaIds: number[] = [];
    // Upload photos if any
    if (pingData.photos.length > 0) {
      try {
        const uploaded = await uploadService.uploadFiles(pingData.photos, "ping");
        mediaIds = uploaded.map((m) => m.id);
      } catch (err: any) {
        const errMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Photo upload failed. Please try again.";
        setUploadError(errMsg);
        setIsPosting(false);
        return;
      }
    }

    try {
      const createdPing = await pingService.createPing({
        title: pingData.title.trim(),
        content: pingData.description.trim() || undefined,
        categoryId: pingData.categoryId,
        isAnonymous: pingData.anonymous,
        mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
        ...(isMembersOnly && (visibilityBodyId || pingData.context.targetBodyId)
          ? {
              isMembersOnly: true,
              visibilityBodyId: Number(visibilityBodyId || pingData.context.targetBodyId),
            }
          : {}),
        ...(pingData.context.targetBodyId
          ? {
              targetBodyId: Number(pingData.context.targetBodyId),
              assignedToBodyId: Number(pingData.context.targetBodyId),
            }
          : {}),
        ...(pingData.context.targetDepartmentId
          ? { targetDepartmentId: pingData.context.targetDepartmentId }
          : {}),
        ...(pingData.context.targetLevel
          ? { targetLevel: pingData.context.targetLevel }
          : {}),
        ...(pingData.context.targetHall.trim()
          ? { targetHall: pingData.context.targetHall.trim() }
          : {}),
      });

      usePingsStore.getState().addPing(createdPing);
      window.dispatchEvent(
        new CustomEvent("echo:ping-created", { detail: createdPing })
      );
      handleCancel();
    } catch (err: any) {
      setUploadError("Failed to submit. Please try again.");
      console.error("Failed to create ping:", err);
    } finally {
      setIsPosting(false);
    }
  };

  /* ─── Collapsed State ─────────────────────────────────── */
  if (state === "collapsed") {
    return (
      <div
        className="bg-white rounded-[10px] px-3 md:px-5 py-3 md:py-[15px] flex items-center gap-2 md:gap-[13px] cursor-pointer w-full"
        onClick={handleCollapsedClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCollapsedClick();
        }}
      >
        <UserAvatar user={user} size="lg" responsive bgColor="bg-[#FFC37B]" />
        <div className="flex-1 h-11 md:h-[50px] border-2 border-[#FFC37B] rounded-2xl md:rounded-[20px] flex items-center pl-4 md:pl-[27px]">
          <span className="font-['Poppins',sans-serif] font-medium text-[13px] md:text-[14px] text-[#9e9e9e] select-none">
            What's the problem?
          </span>
        </div>
      </div>
    );
  }

  /* ─── Expanded State ─────────────────────────────────── */
  return (
    <div className="w-full flex gap-2 md:gap-3 bg-white rounded-[10px] px-3 md:px-5 py-3 md:py-[15px]">
      {/* Left Column: Avatar */}
      <div className="shrink-0">
        <UserAvatar user={user} size="lg" responsive />
      </div>

      {/* Right Column: Form Content */}
      <div className="flex flex-col gap-3 flex-1 overflow-visible">
        {/* Category Dropdown */}
        <div className="relative" ref={categoryDropdownRef}>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-1 px-3 md:px-4 py-1.5 border-2 border-[#F49B31] rounded-full bg-white hover:bg-[#FEF5EA] transition-colors duration-200 text-[13px] md:text-[14px] font-medium text-[#454545]"
          >
            {pingData.categoryId
              ? categories.find((c) => c.id === pingData.categoryId)?.name ||
              "Select Category"
              : "Select Category"}
            <ChevronDown size={16} className="text-[#F49B31]" />
          </button>

          {/* Dropdown Menu */}
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border-2 border-[#F49B31] rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto scrollbar-subtle-rounded">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setPingData((prev) => ({
                      ...prev,
                      categoryId: cat.id,
                      categoryName: cat.name,
                    }));
                    setShowCategoryDropdown(false);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.category;
                      return newErrors;
                    });
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#FEF5EA] transition-colors text-sm text-[#454545]"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <OptionalPingContext
          value={pingData.context}
          onChange={(context) => {
            setPingData((prev) => ({ ...prev, context }));
            if (context.targetBodyId) {
              setVisibilityBodyId(context.targetBodyId);
            }
          }}
        />

        {/* Members-Only Discussion Toggle (Visible to Reps & Admins) */}
        {canPostMembersOnly && (
          <div className="flex items-center justify-between rounded-xl bg-[#FEF5EA] border border-[#ffd7a8] p-3 text-xs font-poppins">
            <div>
              <span className="font-semibold text-[#212121] block">
                🔒 Members-Only Discussion
              </span>
              <span className="text-[#8b8e8d] text-[11px] block mt-0.5">
                {isMembersOnly
                  ? `Restricted to enrolled members and executives of ${
                      availableBodies.find((b) => b.id === (pingData.context.targetBodyId || visibilityBodyId))?.name || "the selected body"
                    }.`
                  : "Unchecked: Public discussion (past attendees & all students can view)."}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isMembersOnly}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsMembersOnly(checked);
                  if (checked) {
                    const bodyId = pingData.context.targetBodyId || visibilityBodyId || availableBodies[0]?.id;
                    if (bodyId) {
                      setVisibilityBodyId(bodyId);
                      setPingData((prev) => ({
                        ...prev,
                        context: { ...prev.context, targetBodyId: bodyId },
                      }));
                    }
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F49B31]"></div>
            </label>
          </div>
        )}

        {errors.category && (
          <p className="text-red-500 text-xs">{errors.category}</p>
        )}

        {/* Title Input */}
        <div className="flex px-4 md:px-[27px] py-2.5 md:py-3 border-2 border-[#FFC37B] rounded-2xl md:rounded-[20px] focus-within:border-[#F49B31] focus-within:shadow-md transition-all duration-200 bg-white w-full min-h-11 md:h-[50px]">
          <input
            type="text"
            placeholder="Title*"
            className="text-[13px] md:text-[14px] text-[#454545] outline-0 flex-1 bg-transparent placeholder:text-[#9e9e9e]"
            onChange={(e) =>
              setPingData((prev) => ({ ...prev, title: e.target.value }))
            }
            value={pingData.title}
            autoComplete="off"
            spellCheck={false}
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            data-ms-editor="false"
            autoFocus
          />
        </div>
        {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}

        {/* Body/Description Input */}
        <div className="flex px-4 md:px-[27px] py-2.5 md:py-3 border-2 border-[#FFC37B] rounded-2xl md:rounded-[20px] focus-within:border-[#F49B31] focus-within:shadow-md transition-all duration-200 bg-white min-h-[84px] md:min-h-[100px] w-full">
          <textarea
            placeholder="Body (optional)"
            onChange={(e) =>
              setPingData((prev) => ({ ...prev, description: e.target.value }))
            }
            value={pingData.description}
            className="text-[13px] md:text-[14px] text-[#454545] outline-0 flex-1 bg-transparent resize-none placeholder:text-[#9e9e9e]"
            autoComplete="off"
            spellCheck={false}
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            data-ms-editor="false"
          />
        </div>

        {/* Photo Thumbnails - Simple display (no grid layouts) */}
        {pingData.photos.length > 0 && (
          <div className="w-full">
            <div className="flex items-center gap-2.5 flex-wrap">
              {pingData.photos.map((file, idx) => (
                <div
                  key={idx}
                  className="relative w-[100px] h-[100px] rounded-lg overflow-hidden border-2 border-[#F49B31] shadow-sm group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="w-full text-xs text-red-500">{uploadError}</div>
        )}

        {/* Members-Only Notice */}
        {isMembersOnly && (
          <div className="w-full flex items-center justify-between rounded-lg bg-[#FEF5EA] border border-[#ffd7a8] px-3 py-2 text-xs font-poppins text-[#75420B]">
            <span className="flex items-center gap-1.5 font-medium">
              🔒 Members-Only: Visible only to enrolled members & reps ({availableBodies.find((b) => b.id === visibilityBodyId)?.name || "Body"})
            </span>
            <button
              type="button"
              onClick={() => setIsMembersOnly(false)}
              className="text-[11px] underline text-[#F49B31] hover:text-[#d88429]"
            >
              Make Public
            </button>
          </div>
        )}

        {/* Bottom Action Row: Attach + Post Button */}
        <div className="w-full flex justify-between items-center">
          {/* Photo Upload Button */}
          <button
            type="button"
            onClick={() =>
              pingData.photos.length < 3 && fileInputRef.current?.click()
            }
            disabled={pingData.photos.length >= 3}
            className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <FaLink className="text-[26px] md:text-[36px]" color="#F49B31" />
          </button>

          {/* Hidden Photo Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoSelect}
            className="hidden"
          />

          {/* Post Button with Dropdown */}
          <div className="relative" ref={postMenuRef}>
            <div className="flex items-center bg-[#FFC37B] rounded-[15px] border-2 border-[#FFC37B] overflow-hidden">
              {/* Post Submit Button - Left side */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPosting}
                className="flex items-center justify-center px-3 md:px-4 py-1.5 md:py-2 bg-[#F49B31] hover:bg-[#d88429] rounded-[13px] font-medium text-[13px] md:text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPosting ? "Posting..." : "Post"}
              </button>

              {/* Dropdown Arrow Button - Right side */}
              <button
                type="button"
                onClick={() => setShowPostMenu(!showPostMenu)}
                className="flex items-center justify-center px-2 py-2 hover:bg-[#f2b866] transition-colors"
              >
                <ChevronDown size={16} className="text-white" />
              </button>
            </div>

            {/* Post Menu Dropdown */}
            {showPostMenu && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-3 z-50 w-max min-w-[220px] border border-[#ffd7a8]">
                <button
                  type="button"
                  onClick={() => {
                    setPingData((prev) => ({
                      ...prev,
                      anonymous: !prev.anonymous,
                    }));
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#FEF5EA] transition-colors w-full text-left text-sm text-black"
                >
                  {/* Anonymous Toggle Switch */}
                  <div
                    className={`w-9 h-5 flex items-center rounded-full transition-colors ${pingData.anonymous ? "bg-[#F49B31]" : "bg-gray-300"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${pingData.anonymous ? "translate-x-[18.5px]" : "translate-x-0"
                        }`}
                    />
                  </div>
                  <span>Post Anonymously</span>
                </button>

                {/* Members-Only Discussion Toggle (Reps & Admins) */}
                {canPostMembersOnly && (
                  <div className="mt-2 pt-2 border-t border-[#ffd7a8]/40">
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = !isMembersOnly;
                        setIsMembersOnly(nextVal);
                        if (nextVal && !visibilityBodyId && availableBodies.length > 0) {
                          setVisibilityBodyId(availableBodies[0].id);
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#FEF5EA] transition-colors w-full text-left text-sm text-black"
                    >
                      <div
                        className={`w-9 h-5 flex items-center rounded-full transition-colors ${isMembersOnly ? "bg-[#F49B31]" : "bg-gray-300"}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${isMembersOnly ? "translate-x-[18.5px]" : "translate-x-0"}`}
                        />
                      </div>
                      <span className="font-medium text-xs">Members-Only Discussion</span>
                    </button>

                    {isMembersOnly && availableBodies.length > 1 && (
                      <div className="mt-2 px-3">
                        <label className="block text-[11px] text-[#8b8e8d] mb-1 font-poppins">
                          Target Body:
                        </label>
                        <select
                          value={visibilityBodyId ?? ""}
                          onChange={(e) => setVisibilityBodyId(Number(e.target.value))}
                          className="w-full text-xs rounded-lg border border-[#ffd7a8] bg-[#FEF5EA]/30 p-1.5 focus:border-[#F49B31] focus:outline-none"
                        >
                          {availableBodies.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cancel link */}
        <button
          type="button"
          onClick={handleCancel}
          className="font-['Poppins',sans-serif] text-[13px] text-[#F49B31] cursor-pointer hover:underline text-left w-fit"
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

InlinePingCreator.displayName = "InlinePingCreator";

export default InlinePingCreator;
