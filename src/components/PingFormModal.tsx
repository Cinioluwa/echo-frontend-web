import { useState, useEffect, useRef, type ReactNode } from "react";
import { FaLink } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import Toggle from "./Toggle";
import { v4 as uuidv4 } from "uuid";
import PostSuccessModal from "./PostSuccessModal";
import { pingService, waveService, uploadService } from "../api/services";
import { useDebounce } from "../hooks";
import type { Ping } from "../api/types/index";
import { usePingsStore, useWavesStore } from "../stores";

// Wave Components
import WaveWarningBanner from "./WaveComponents/WaveWarningBanner";
import PingSearchInput from "./WaveComponents/PingSearchInput";
import PingSearchDropdown from "./WaveComponents/PingSearchDropdown";
import SelectedPingCard from "./WaveComponents/SelectedPingCard";

// Shared Components
import { HorizontalCategorySelector } from "./shared";

// Animation variants
import { tabVariants as importedTabVariants } from "./WaveComponents/animations";

interface Props {
  children?: ReactNode;
  setPingFormDetails?: React.Dispatch<React.SetStateAction<PingFormDetails[]>>;
  setPingForm: () => void;
  formSegment: "ping" | "wave";
  setFormSegment: () => void;
  onPingCreated?: () => void;
  onWaveCreated?: () => void;
}

export interface PingFormDetails {
  cat: string;
  catId: number;
  formSegment: string;
  anonymous: boolean;
  pingDesc: string;
  hashtag: string;
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

interface WaveData {
  selectedPing: Ping | null;
  solution: string;
  searchQuery: string;
  photos: File[];
}

type WaveFlowState =
  | "initial-search"
  | "searching"
  | "ping-selected"
  | "ready-to-submit";

const PingFormModal = ({
  children,
  setPingFormDetails,
  setPingForm,
  setFormSegment,
  formSegment,
  onPingCreated,
  onWaveCreated,
}: Props) => {
  // Active tab state
  const [activeTab, setActiveTab] = useState<"ping" | "wave">(formSegment);

  // Ping form state
  const [pingData, setPingData] = useState<PingData>({
    title: "",
    description: "",
    categoryId: 0,
    categoryName: "",
    anonymous: false,
    photos: [],
  });

  // Wave form state
  const [waveData, setWaveData] = useState<WaveData>({
    selectedPing: null,
    solution: "",
    searchQuery: "",
    photos: [],
  });

  // Wave flow state machine
  const [waveFlowState, setWaveFlowState] = useState<WaveFlowState>("initial-search");

  // Search functionality
  const [searchResults, setSearchResults] = useState<Ping[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const debouncedSearch = useDebounce(waveData.searchQuery, 300);

  // UI state
  const [postSuccessModal, setPostSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for file inputs and dropdown container
  const pingPhotoInputRef = useRef<HTMLInputElement>(null);
  const wavePhotoInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Legacy state for compatibility
  const [pingFormData, setPingFormData] = useState<PingFormDetails>({
    cat: "",
    catId: 0,
    anonymous: false,
    pingDesc: "",
    hashtag: "",
    pingTitle: "",
    formSegment: "ping",
    createdAt: "",
    id: "",
  });

  // Sync activeTab with formSegment prop
  useEffect(() => {
    setActiveTab(formSegment);
  }, [formSegment]);

  // Handle clicks outside search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    };

    if (showSearchDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchDropdown]);

  // Debounced ping search for Wave flow
  useEffect(() => {
    const fetchPings = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        setWaveFlowState("initial-search");
        return;
      }

      setIsSearching(true);
      setWaveFlowState("searching");

      try {
        const response = await pingService.searchPings(
          debouncedSearch,
          { limit: 10 }
        );

        setSearchResults(response.data);
        setShowSearchDropdown(true);
      } catch (error) {
        console.error("Error searching pings:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    if (activeTab === "wave" && !waveData.selectedPing) {
      fetchPings();
    }
  }, [debouncedSearch, activeTab, waveData.selectedPing]);

  // Update wave flow state based on data
  useEffect(() => {
    if (waveData.selectedPing) {
      if (waveData.solution.trim()) {
        setWaveFlowState("ready-to-submit");
      } else {
        setWaveFlowState("ping-selected");
      }
    }
  }, [waveData.selectedPing, waveData.solution]);

  // Tab switching handler
  const handleTabSwitch = (newTab: "ping" | "wave") => {
    setActiveTab(newTab);
    setFormSegment();
    setErrors({});

    // Reset appropriate form data
    if (newTab === "ping") {
      resetWaveData();
    } else {
      resetPingData();
    }
  };

  // Reset functions
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

  const resetWaveData = () => {
    setWaveData({
      selectedPing: null,
      solution: "",
      searchQuery: "",
      photos: [],
    });
    setSearchResults([]);
    setShowSearchDropdown(false);
    setWaveFlowState("initial-search");
  };

  // Ping selection handlers
  const handleSelectPing = (ping: Ping) => {
    setWaveData((prev) => ({ ...prev, selectedPing: ping, searchQuery: "" }));
    setShowSearchDropdown(false);
    setWaveFlowState("ping-selected");
  };

  const handleDeselectPing = () => {
    setWaveData((prev) => ({ ...prev, selectedPing: null }));
    setWaveFlowState("initial-search");
  };

  const handleCreatePingFromWave = () => {
    // Switch to Ping tab to create a new ping
    handleTabSwitch("ping");
  };

  // Photo handling functions
  const handlePingPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = pingData.photos.length + newFiles.length;

    if (totalFiles > 5) {
      alert("You can only upload up to 5 photos");
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

  const handleWavePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = waveData.photos.length + newFiles.length;

    if (totalFiles > 5) {
      alert("You can only upload up to 5 photos");
      return;
    }

    setWaveData((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles] }));

    // Reset input
    if (wavePhotoInputRef.current) {
      wavePhotoInputRef.current.value = "";
    }
  };

  const handleRemoveWavePhoto = (indexToRemove: number) => {
    setWaveData((prev) => ({
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

    if (!pingData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!pingData.categoryId || pingData.categoryId === 0) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateWaveForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!waveData.selectedPing) {
      newErrors.ping = "Please select a ping to link your wave to";
    }

    if (!waveData.solution.trim()) {
      newErrors.solution = "Solution is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handlers
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
      } catch (err: any) {
        setUploadError("Photo upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const createdPing = await pingService.createPing({
        title: pingData.title.trim(),
        content: pingData.description.trim(),
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
        hashtag: "",
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

      setPingFormData(newPingFormDetails);
      setPostSuccessModal(true);
      resetPingData();
    } catch (err: any) {
      setUploadError(err.response?.data?.error || "Failed to create ping. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaveSubmit = async () => {
    if (!validateWaveForm()) {
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(null);
    setUploadError(null);

    let mediaIds: number[] = [];
    if (waveData.photos.length > 0) {
      try {
        setUploadProgress(0);
        const uploaded = await uploadService.uploadFiles(waveData.photos, "wave");
        mediaIds = uploaded.map((m) => m.id);
        setUploadProgress(100);
      } catch (err: any) {
        setUploadError("Photo upload failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const createdWave = await waveService.proposeWave({
        solution: waveData.solution.trim(),
        pingId: String(waveData.selectedPing!.id),
        mediaIds, // Backend must support this field for wave uploads
      });

      useWavesStore.getState().addWave(createdWave);

      if (onWaveCreated) {
        onWaveCreated();
      }

      setPingFormData({
        ...pingFormData,
        formSegment: "wave",
      });
      setPostSuccessModal(true);
      resetWaveData();
    } catch (err: any) {
      setUploadError(err.response?.data?.error || "Failed to propose wave. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render functions for form sections
  const renderPingForm = () => {
    return (
      <motion.div
        key="ping-form"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full flex flex-col gap-5"
      >
        {/* Anonymous Toggle */}
        <Toggle
          checked={pingData.anonymous}
          onChange={() =>
            setPingData((prev) => ({ ...prev, anonymous: !prev.anonymous }))
          }
        />

        {/* Form Fields */}
        <div className="w-full flex flex-col gap-5">
          {/* Title */}
          <div className="flex px-[15px] py-[11px] border border-black rounded-[10px] focus-within:border-[#F49B31] focus-within:border-2 transition-all duration-200">
            <label htmlFor="pingTitle" className="font-medium">
              Title:
            </label>
            <input
              type="text"
              id="pingTitle"
              name="pingTitle"
              placeholder="name, header..."
              className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1 bg-transparent"
              onChange={(e) =>
                setPingData((prev) => ({ ...prev, title: e.target.value }))
              }
              value={pingData.title}
              autoComplete="off"
            />
          </div>
          {errors.title && <p className="text-red-500 text-xs -mt-3">{errors.title}</p>}

          {/* Description */}
          <div className="flex px-[15px] py-[11px] border border-black rounded-[10px] focus-within:border-[#F49B31] focus-within:border-2 transition-all duration-200">
            <label htmlFor="pingDescription" className="font-medium">
              Description:
            </label>
            <input
              type="text"
              name="pingDescription"
              id="pingDescription"
              placeholder="What's the issue?"
              autoComplete="off"
              onChange={(e) =>
                setPingData((prev) => ({ ...prev, description: e.target.value }))
              }
              value={pingData.description}
              className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1 bg-transparent"
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-xs -mt-3">{errors.description}</p>
          )}


        </div>

        {/* Category Selector */}
        <div className="overflow-x-auto">
          <HorizontalCategorySelector
            selectedCategoryId={pingData.categoryId}
            onSelectCategory={(catId, catName) =>
              setPingData((prev) => ({
                ...prev,
                categoryId: catId,
                categoryName: catName,
              }))
            }
          />
        </div>
        {errors.category && <p className="text-red-500 text-xs -mt-3">{errors.category}</p>}

        {/* Hidden Photo Input */}
        <input
          ref={pingPhotoInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePingPhotoChange}
          className="hidden"
        />

        {/* Photo Thumbnails Display */}
        {pingData.photos.length > 0 && (
          <div className="flex items-center gap-2">
            {pingData.photos.slice(0, 3).map((photo, index) => (
              <div
                key={index}
                className="relative group w-16 h-16 rounded-xs overflow-hidden border border-[#7D7D7D]"
              >
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePingPhoto(index)}
                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <span className="text-xs font-bold">×</span>
                </button>
              </div>
            ))}
            {pingData.photos.length > 3 && (
              <div className="flex items-center justify-center w-16 h-16 rounded-xs bg-[#F49B31] text-white font-semibold text-sm border border-[#F49B31]">
                +{pingData.photos.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Upload Progress/Error */}
        {uploadProgress !== null && (
          <div className="w-full text-xs text-gray-500">Uploading photos... {uploadProgress}%</div>
        )}
        {uploadError && (
          <div className="w-full text-xs text-red-500">{uploadError}</div>
        )}
        {/* Action Buttons */}
        <div className="w-full flex justify-between items-center">
          <button
            type="button"
            onClick={() => pingPhotoInputRef.current?.click()}
            className="cursor-pointer"
          >
            <FaLink fontSize={30} color="#F49B31" />
          </button>
          <div className="flex items-center">
            <button
              type="button"
              onClick={handlePingSubmit}
              disabled={isSubmitting}
              className="px-[30px] py-[5px] text-white rounded-xl bg-[#F49B31] hover:bg-[#d88429] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={setPingForm}
          className="px-[30px] py-[5px] text-[#F49B31] border border-[#F49B31] rounded-xl bg-transparent hover:bg-[#FEF5EA] transition-all duration-300"
        >
          Cancel
        </button>
      </motion.div>
    );
  };

  const renderWaveForm = () => {
    return (
      <motion.div
        key="wave-form"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full flex flex-col gap-5"
      >
        {/* Warning Banner */}
        <WaveWarningBanner />

        {/* Ping Search or Selected Ping */}
        {!waveData.selectedPing ? (
          <div className="relative" ref={searchContainerRef}>
            <PingSearchInput
              value={waveData.searchQuery}
              onChange={(value) => {
                setWaveData((prev) => ({ ...prev, searchQuery: value }));
                // Show dropdown when user has typed enough characters
                setShowSearchDropdown(value.length >= 2);
              }}
              onFocus={() => {
                // Show dropdown on focus if there's already a valid search query
                if (waveData.searchQuery.length >= 2) {
                  setShowSearchDropdown(true);
                }
              }}
              placeholder="Search for the ping..."
            />

            {/* Search Dropdown */}
            <PingSearchDropdown
              searchQuery={waveData.searchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
              onSelectPing={handleSelectPing}
              onCreatePing={handleCreatePingFromWave}
              isVisible={showSearchDropdown}
            />
          </div>
        ) : (
          <SelectedPingCard
            ping={waveData.selectedPing}
            onDeselect={handleDeselectPing}
          />
        )}
        {errors.ping && <p className="text-red-500 text-xs -mt-3">{errors.ping}</p>}

        {/* Solution Input - Only enabled when ping is selected */}
        <div
          className={`flex flex-col px-[15px] py-[11px] border border-black rounded-[10px] focus-within:border-[#F49B31] focus-within:border-2 transition-all duration-200 ${!waveData.selectedPing ? "opacity-50 cursor-not-allowed bg-gray-50" : ""
            }`}
        >
          <label htmlFor="solution" className="font-medium mb-2">
            {waveData.selectedPing ? "Proposing a Wave" : "Solution:"}
          </label>
          <textarea
            id="solution"
            name="solution"
            placeholder="Describe your solution..."
            disabled={!waveData.selectedPing}
            onChange={(e) =>
              setWaveData((prev) => ({ ...prev, solution: e.target.value }))
            }
            value={waveData.solution}
            className="text-[12px] text-[#454545] outline-0 bg-transparent resize-none min-h-[100px]"
          />
        </div>
        {errors.solution && (
          <p className="text-red-500 text-xs -mt-3">{errors.solution}</p>
        )}

        {/* Hidden Photo Input - Only when ping is selected */}
        {waveData.selectedPing && (
          <>
            <input
              ref={wavePhotoInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleWavePhotoChange}
              className="hidden"
            />

            {/* Photo Thumbnails Display */}
            {waveData.photos.length > 0 && (
              <div className="flex items-center gap-2">
                {waveData.photos.slice(0, 3).map((photo, index) => (
                  <div
                    key={index}
                    className="relative group w-16 h-16 rounded-xs overflow-hidden border border-[#7D7D7D]"
                  >
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveWavePhoto(index)}
                      className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <span className="text-xs font-bold">×</span>
                    </button>
                  </div>
                ))}
                {waveData.photos.length > 3 && (
                  <div className="flex items-center justify-center w-16 h-16 rounded-xs bg-[#F49B31] text-white font-semibold text-sm border border-[#F49B31]">
                    +{waveData.photos.length - 3}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Upload Progress/Error */}
        {uploadProgress !== null && (
          <div className="w-full text-xs text-gray-500">Uploading photos... {uploadProgress}%</div>
        )}
        {uploadError && (
          <div className="w-full text-xs text-red-500">{uploadError}</div>
        )}
        {/* Action Buttons */}
        <div className="w-full flex justify-between items-center">
          <button
            type="button"
            onClick={() => waveData.selectedPing && wavePhotoInputRef.current?.click()}
            disabled={!waveData.selectedPing}
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaLink fontSize={30} color="#F49B31" />
          </button>
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={handleWaveSubmit}
              disabled={isSubmitting || waveFlowState !== "ready-to-submit"}
              className={`px-[30px] py-[5px] text-white rounded-xl bg-[#F49B31] transition-all duration-300 disabled:cursor-not-allowed ${waveFlowState === "ready-to-submit"
                ? "opacity-100 hover:bg-[#d88429]"
                : "opacity-50"
                }`}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={setPingForm}
          className="px-[30px] py-[5px] text-[#F49B31] border border-[#F49B31] rounded-xl bg-transparent hover:bg-[#FEF5EA] transition-all duration-300"
        >
          Cancel
        </button>
      </motion.div>
    );
  };

  // Success modal check
  if (postSuccessModal) {
    return (
      <PostSuccessModal
        formSegment={activeTab}
        setPostSuccessModal={() => {
          setPostSuccessModal(false);
          setPingForm();
        }}
      />
    );
  }

  // Use imported animation variants for tabs
  const tabVariants = importedTabVariants;

  return (
    <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
      <div className="mx-5 shadow-2xl max-w-[480px] rounded-4xl px-[25px] py-2.5 md:p-[30px] bg-white gap-4 overflow-hidden text-[32px] font-poppins flex flex-col items-center">
        {/* Modal Title */}
        <h2 className="font-semibold text-center text-[20px] md:text-[32px]">
          What Kind of Post?
        </h2>

        {/* Tab Selector */}
        <div className="flex rounded-[25px] text-[16px] overflow-hidden border-2 border-black">
          <motion.button
            variants={tabVariants}
            animate={activeTab === "ping" ? "active" : "inactive"}
            onClick={() => handleTabSwitch("ping")}
            className="inline-block rounded-l-[23px] border-r-2 border-black py-6 px-6 cursor-pointer sm:py-4 sm:px-8"
            type="button"
          >
            Ping
          </motion.button>
          <motion.button
            variants={tabVariants}
            animate={activeTab === "wave" ? "active" : "inactive"}
            onClick={() => handleTabSwitch("wave")}
            className="inline-block rounded-r-[23px] cursor-pointer py-6 px-6 sm:py-4 sm:px-8"
            type="button"
          >
            Wave
          </motion.button>
        </div>

        {/* Form Content */}
        <div className="w-full text-[14px]">
          <AnimatePresence mode="wait">
            {activeTab === "ping" ? renderPingForm() : renderWaveForm()}
          </AnimatePresence>
        </div>

        {children}
      </div>
    </div>
  );
};

export default PingFormModal;
