import { useState, useRef, type ReactNode, useEffect } from "react";
import { FaLink } from "react-icons/fa6";
import { ChevronDown, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import PostSuccessModal from "./PostSuccessModal";
import { pingService, uploadService, categoryService } from "../api/services";
import { usePingsStore } from "../stores";
import UserAvatar from "./UserAvatar";
import { useAuthStore } from "../stores";
import type { CategoryData } from "../api/types/index";
import { checkPingContent } from "../utils/contentModeration";

interface Props {
  children?: ReactNode;
  setPingFormDetails?: React.Dispatch<React.SetStateAction<PingFormDetails[]>>;
  setPingForm: () => void;
  onPingCreated?: () => void;
}

export interface PingFormDetails {
  cat: string;
  catId: number;
  formSegment: "ping";
  anonymous: boolean;
  pingDesc: string;
  pingTitle: string;
  createdAt: string;
  id: string;
  status?: string;
}

// Internal state types
interface PingData {
  title: string;
  description: string;
  categoryId: number;
  categoryName: string;
  anonymous: boolean;
  photos: File[];
}

const getErrorMessage = (err: any): string => {
  // Check for detailed validation errors from backend
  if (err.response?.data?.details && Array.isArray(err.response.data.details)) {
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
  return "Failed to submit. Please try again.";
};

const PingFormModal = ({
  children,
  setPingFormDetails,
  setPingForm,
  onPingCreated,
}: Props) => {
  // Ping form state
  const [pingData, setPingData] = useState<PingData>({
    title: "",
    description: "",
    categoryId: 0,
    categoryName: "",
    anonymous: false,
    photos: [],
  });

  // UI state
  const [postSuccessModal, setPostSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  // Refs for file inputs and dropdowns
  const pingPhotoInputRef = useRef<HTMLInputElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const postMenuRef = useRef<HTMLDivElement>(null);

  // Get current user for avatar
  const user = useAuthStore((state) => state.user);

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

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setPingForm();
    }
  };

  // Photo handling functions
  const handlePingPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = pingData.photos.length + newFiles.length;

    if (totalFiles > 3) {
      setUploadError("You can only upload up to 3 photos");
      return;
    }

    setPingData((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles] }));

    // Reset input
    if (pingPhotoInputRef.current) {
      pingPhotoInputRef.current.value = "";
    }
  };

  const handleRemovePingPhoto = (indexToRemove: number) => {
    setPingData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Validation functions
  const validatePingForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!pingData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!pingData.categoryId || pingData.categoryId === 0) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return false;

    // Content moderation check
    const moderation = checkPingContent(pingData.title, pingData.description);
    if (!moderation.passed) {
      setUploadError(moderation.reason);
      return false;
    }

    return true;
  };

  // Submit handler
  const handlePingSubmit = async () => {
    if (!validatePingForm()) {
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(null);
    setUploadError(null);

    let mediaIds: number[] = [];
    // Upload photos if any
    if (pingData.photos.length > 0) {
      try {
        // Show progress UI (simulate for now, can be improved with axios onUploadProgress)
        setUploadProgress(0);
        const uploaded = await uploadService.uploadFiles(pingData.photos, "ping");
        mediaIds = uploaded.map((m) => m.id);
        setUploadProgress(100);
      } catch {
        setUploadError("Photo upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const createdPing = await pingService.createPing({
        title: pingData.title.trim(),
        content: pingData.description.trim() || undefined,
        categoryId: pingData.categoryId,
        isAnonymous: pingData.anonymous,
        mediaIds,
      });

      usePingsStore.getState().addPing(createdPing);

      const newPingFormDetails: PingFormDetails = {
        cat: pingData.categoryName.trim(),
        catId: pingData.categoryId,
        formSegment: "ping",
        anonymous: pingData.anonymous,
        pingTitle: pingData.title.trim(),
        pingDesc: pingData.description.trim(),
        id: uuidv4(),
        createdAt: new Date()
          .toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .toLowerCase(),
      };

      if (setPingFormDetails) {
        setPingFormDetails((prev) => [newPingFormDetails, ...prev]);
      }

      if (onPingCreated) {
        onPingCreated();
      }

      setPostSuccessModal(true);
      resetPingData();
    } catch (err: any) {
      setUploadError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset function
  const resetPingData = () => {
    setPingData({
      title: "",
      description: "",
      categoryId: 0,
      categoryName: "",
      anonymous: false,
      photos: [],
    });
  };

  // Render ping form
  const renderPingForm = () => {
    return (
      <div className="w-full flex gap-3">
        {/* Left Column: Avatar */}
        <div className="shrink-0 hidden md:block">
          <UserAvatar user={user} size="lg" responsive={false} />
        </div>
        <div className="shrink-0 block md:hidden">
          <UserAvatar user={user} size="md" responsive={false} />
        </div>

        {/* Right Column: Form Content */}
        <div className="flex flex-col gap-2 md:gap-3 flex-1 overflow-visible">
          {/* Category Dropdown */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-1 px-4 py-1.5 border-2 border-[#F49B31] rounded-full bg-white hover:bg-[#FEF5EA] transition-colors duration-200 text-[14px] font-medium text-[#454545]"
            >
              {pingData.categoryId
                ? categories.find((c) => c.id === pingData.categoryId)?.name ||
                "Select Category"
                : "Select Category"}
              <ChevronDown size={16} className="text-[#F49B31]" />
            </button>

            {/* Dropdown Menu - reduced height and scrollable */}
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

          {errors.category && (
            <p className="text-red-500 text-xs">{errors.category}</p>
          )}

          {/* Title Input */}
          <div className="flex px-4 md:px-[27px] py-1.5 md:py-3 border-2 border-[#FFC37B] rounded-[20px] focus-within:border-[#F49B31] focus-within:shadow-md transition-all duration-200 bg-white w-full h-[36px] md:h-[50px]">
            <input
              type="text"
              id="pingTitle"
              placeholder="Title*"
              className="text-[14px] text-black font-['Poppins',sans-serif] font-medium outline-0 flex-1 bg-transparent placeholder:text-[#9e9e9e] placeholder:font-medium"
              onChange={(e) =>
                setPingData((prev) => ({ ...prev, title: e.target.value }))
              }
              value={pingData.title}
              autoComplete="off"
            />
          </div>
          {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}

          {/* Body/Description Input */}
          <div className="flex px-4 md:px-[27px] py-1.5 md:py-3 border-2 border-[#FFC37B] rounded-[20px] focus-within:border-[#F49B31] focus-within:shadow-md transition-all duration-200 bg-white min-h-[50px] md:min-h-[100px] w-full">
            <textarea
              name="pingDescription"
              id="pingDescription"
              placeholder="Body (optional)"
              onChange={(e) =>
                setPingData((prev) => ({ ...prev, description: e.target.value }))
              }
              value={pingData.description}
              className="text-[14px] text-black font-['Poppins',sans-serif] font-medium outline-0 flex-1 bg-transparent resize-none placeholder:text-[#9e9e9e] placeholder:font-medium"
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description}</p>
          )}

          {/* Photo Gallery - Constrained to max-height, no overflow */}
          {pingData.photos.length > 0 && (
            <div className="w-full max-h-[140px] md:max-h-[200px]">
              {pingData.photos.length === 1 ? (
                // Single photo - full width, constrained height
                <div className="relative group w-full h-[140px] md:h-[200px] rounded-lg overflow-hidden border-2 border-[#F49B31] shadow-sm">
                  <img
                    src={URL.createObjectURL(pingData.photos[0])}
                    alt="Upload 1"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePingPhoto(0)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : pingData.photos.length === 2 ? (
                // Two photos - side by side, constrained height
                <div className="flex gap-2 h-[140px] md:h-[200px]">
                  <div className="relative group flex-1 rounded-lg overflow-hidden border-2 border-[#F49B31] shadow-sm">
                    <img
                      src={URL.createObjectURL(pingData.photos[0])}
                      alt="Upload 1"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePingPhoto(0)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="relative group flex-1 rounded-lg overflow-hidden border-2 border-[#F49B31] shadow-sm">
                    <img
                      src={URL.createObjectURL(pingData.photos[1])}
                      alt="Upload 2"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePingPhoto(1)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                // Three photos - 1 large on left, 2 stacked on right, constrained height
                <div className="flex gap-2 h-[140px] md:h-[200px]">
                  {/* Large photo on left */}
                  <div className="relative group flex-1 rounded-lg overflow-hidden border-2 border-[#F49B31] shadow-sm">
                    <img
                      src={URL.createObjectURL(pingData.photos[0])}
                      alt="Upload 1"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePingPhoto(0)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Two stacked photos on right */}
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="relative group flex-1 rounded-lg overflow-hidden border-2 border-[#F49B31] shadow-sm">
                      <img
                        src={URL.createObjectURL(pingData.photos[1])}
                        alt="Upload 2"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePingPhoto(1)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="relative group flex-1 rounded-lg overflow-hidden border-2 border-[#F49B31] shadow-sm">
                      <img
                        src={URL.createObjectURL(pingData.photos[2])}
                        alt="Upload 3"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePingPhoto(2)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Progress/Error */}
          {uploadProgress !== null && (
            <div className="w-full text-xs text-gray-500">
              Uploading photos... {uploadProgress}%
            </div>
          )}
          {uploadError && (
            <div className="w-full text-xs text-red-500">{uploadError}</div>
          )}

          {/* Bottom Action Row: Link Icon + Post Button */}
          <div className="w-full flex justify-between items-center\">
            {/* Photo Upload Button */}
            <button
              type="button"
              onClick={() =>
                pingData.photos.length < 3 && pingPhotoInputRef.current?.click()
              }
              disabled={pingData.photos.length >= 3}
              className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center justify-center p-2 rounded-full hover:bg-[#FEF5EA]"
            >
              <FaLink className="text-[22px] text-[#F49B31]" />
            </button>

            {/* Post Button - Separate submit and dropdown toggle */}
            <div className="relative" ref={postMenuRef}>
              {/* Wrapper for proper z-stacking */}
              <div className="flex items-center bg-[#FFC37B] rounded-[15px] border-2 border-[#FFC37B] overflow-hidden">
                {/* Post Submit Button - Left side */}
                <button
                  type="button"
                  onClick={handlePingSubmit}
                  disabled={isSubmitting}
                  className="flex items-center justify-center px-4 py-2 bg-[#F49B31] hover:bg-[#d88429] rounded-[13px] font-medium text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Posting..." : "Post"}
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

              {/* Post Menu Dropdown - Fixed positioning to avoid clipping */}
              {showPostMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white  rounded-lg shadow-lg p-3 z-50 w-max">
                  {/* Anonymous Toggle */}
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div
      className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40"
      onClick={handleBackdropClick}
    >
      {/* Hidden Photo Input */}
      <input
        ref={pingPhotoInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePingPhotoChange}
        className="hidden"
      />

      {/* Modal Container - Responsive width */}
      <div
        className="w-full mx-4 md:mx-0 md:w-[770px] shadow-2xl rounded-[10px] px-4 py-4 md:px-6 md:py-6 bg-white gap-2 md:gap-4 overflow-visible font-poppins flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Title */}
        <h2 className="font-semibold text-center text-xl md:text-[30px] text-black w-full">
          Create Ping
        </h2>

        {/* Form Content */}
        <div className="w-full text-[14px]">
          {renderPingForm()}
        </div>

        {children}
      </div>

      {/* Success toast — rendered inside the portal tree to avoid removeChild crash */}
      {postSuccessModal && (
        <PostSuccessModal
          formSegment="ping"
          setPostSuccessModal={() => {
            setPostSuccessModal(false);
            setPingForm();
          }}
        />
      )}
    </div>
  );
};

export default PingFormModal;
