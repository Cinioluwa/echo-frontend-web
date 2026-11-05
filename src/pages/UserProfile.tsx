
import { useEffect, useState } from "react";
import type { User } from "../api/types/index";
import ProfileBadge from "../components/ProfileBadge";
import ProfileDataField from "../components/ProfileDataField";
import UserProfileSidePanel from "../components/UserProfileSidePanel";
import { User as UserIcon } from "lucide-react";
import ProfileLayout from "../components/ProfileLayout";
import userService from "../api/services/user.service";
import uploadService from "../api/services/upload.service";
import { useAuthStore } from "../stores";
import { getErrorMessage } from "../utils/networkUtils";
import {
  getNameChangeStatus,
  hasNameChanged,
} from "../utils/nameChangeUtil";

const pages = {
  profile: true,
  account: false,
  notification: false,
  privacy: false,
};


const UserProfile = () => {
  const authUser = useAuthStore((state) => state.user);
  const updateAuthUser = useAuthStore((state) => state.updateUser);

  const [user, setUser] = useState<User | null>(authUser);
  const [loading, setLoading] = useState(!authUser);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nameChangeError, setNameChangeError] = useState("");
  const [nameChangeSaving, setNameChangeSaving] = useState(false);
  const [nameChangeStatus, setNameChangeStatus] = useState(
    getNameChangeStatus("", undefined)
  );

  // Alias management state
  const [editingAlias, setEditingAlias] = useState(false);
  const [alias, setAlias] = useState("");
  const [aliasSaving, setAliasSaving] = useState(false);
  const [aliasError, setAliasError] = useState("");
  const [uploadingAnonPicture, setUploadingAnonPicture] = useState(false);
  const [anonPictureError, setAnonPictureError] = useState("");
  const [anonProfilePicture, setAnonProfilePicture] = useState("");

  useEffect(() => {
    if (!authUser) return;

    setUser((prev) => prev ?? authUser);
    setFirstName((prev) => prev || authUser.firstName);
    setLastName((prev) => prev || authUser.lastName);
  }, [authUser]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await userService.getMe();
        setUser(data);
        updateAuthUser(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);

        // Calculate name change status
        const status = getNameChangeStatus(
          data.createdAt,
          data.lastNameChangeAt
        );
        setNameChangeStatus(status);

        // Fetch user preferences separately for alias data
        try {
          const prefs = await userService.getMyPreferences();
          setAlias(prefs.anonymousAlias || "");
          setAnonProfilePicture(prefs.anonymousAliasProfilePicture || "");
        } catch (prefsErr) {
          console.warn("Failed to fetch user preferences", prefsErr);
          // Fallback to empty if preferences can't be fetched
          setAlias("");
          setAnonProfilePicture("");
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [updateAuthUser]);

  // Profile picture upload handler
  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Profile image must be 5MB or smaller.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file.");
      return;
    }

    const previousPicture = user?.profilePicture;
    const previewUrl = URL.createObjectURL(file);

    setUser((prev) =>
      prev
        ? {
          ...prev,
          profilePicture: previewUrl,
        }
        : prev,
    );
    updateAuthUser({ profilePicture: previewUrl });

    setUploading(true);
    setUploadError("");

    try {
      const res = await uploadService.uploadProfilePicture(file);
      const uploadedPicture =
        res?.user?.profilePicture || res?.url || previousPicture;

      setUser((prev) =>
        prev
          ? {
            ...prev,
            profilePicture: uploadedPicture,
          }
          : prev,
      );
      updateAuthUser({ profilePicture: uploadedPicture });
    } catch (err: unknown) {
      setUser((prev) =>
        prev
          ? {
            ...prev,
            profilePicture: previousPicture,
          }
          : prev,
      );
      updateAuthUser({ profilePicture: previousPicture });
      setUploadError(getErrorMessage(err));
    } finally {
      setUploading(false);
      URL.revokeObjectURL(previewUrl);

      if (e.target) {
        e.target.value = "";
      }
    }
  };

  // Anonymous picture upload handler
  const handleAnonPictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAnonPicture(true);
    setAnonPictureError("");

    try {
      // Step 1: Upload file to /uploads and get media URL
      const uploadedUrl = await uploadService.uploadAnonProfilePicture(file);

      // Step 2: Persist anonymous alias picture URL in preferences
      const updatedPrefs = await userService.updateAnonymousAliasProfilePicture(
        uploadedUrl,
      );

      setAnonProfilePicture(updatedPrefs.anonymousAliasProfilePicture || "");
      setUser((prev) =>
        prev
          ? {
            ...prev,
            userPreference: updatedPrefs,
          }
          : prev,
      );
    } catch (err: unknown) {
      setAnonPictureError(getErrorMessage(err));
      console.error("Anonymous picture upload error:", err);
    } finally {
      setUploadingAnonPicture(false);
    }
  };

  const handleClearAnonPicture = async () => {
    if (!anonProfilePicture) return;

    setUploadingAnonPicture(true);
    setAnonPictureError("");

    try {
      const updatedPrefs = await userService.updateAnonymousAliasProfilePicture(
        null,
      );

      setAnonProfilePicture("");
      setUser((prev) =>
        prev
          ? {
            ...prev,
            userPreference: updatedPrefs,
          }
          : prev,
      );
    } catch (err: unknown) {
      setAnonPictureError(getErrorMessage(err));
      console.error("Anonymous picture clear error:", err);
    } finally {
      setUploadingAnonPicture(false);
    }
  };

  // Handle alias save
  const handleSaveAlias = async () => {
    if (!alias.trim()) {
      setAliasError("Alias cannot be empty");
      return;
    }

    if (alias.length < 2 || alias.length > 30) {
      setAliasError("Alias must be between 2 and 30 characters");
      return;
    }

    setAliasError("");
    setAliasSaving(true);
    try {
      const updatedPrefs = await userService.updateMyPreferences({
        anonymousAlias: alias.trim(),
      });

      // Update the user state with new preferences
      if (user?.userPreference) {
        setUser({
          ...user,
          userPreference: updatedPrefs,
        });
      }

      // Exit editing mode and reset saving state
      setEditingAlias(false);
      setAliasSaving(false);
    } catch (err: unknown) {
      setAliasError(getErrorMessage(err));
      console.error("Alias update error:", err);
      setAliasSaving(false);
    }
  };

  // Handle cancel alias edit
  const handleCancelEditAlias = () => {
    setAlias(user?.userPreference?.anonymousAlias || "");
    setAliasError("");
    setEditingAlias(false);
  };

  // Handle name change
  const handleSaveName = async () => {
    if (!user) return;

    // Check if name actually changed
    if (
      !hasNameChanged(user.firstName, user.lastName, firstName, lastName)
    ) {
      setEditingName(false);
      return;
    }

    // Validate name fields
    if (!firstName.trim() || !lastName.trim()) {
      setNameChangeError("First name and last name are required");
      return;
    }

    setNameChangeError("");
    setNameChangeSaving(true);

    try {
      const updatedUser = await userService.updateMe({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      setUser(updatedUser);
      setFirstName(updatedUser.firstName);
      setLastName(updatedUser.lastName);

      // Update name change status
      const status = getNameChangeStatus(
        updatedUser.createdAt,
        updatedUser.lastNameChangeAt
      );
      setNameChangeStatus(status);

      setEditingName(false);
    } catch (err: unknown) {
      setNameChangeError(getErrorMessage(err));
      console.error("Name update error:", err);
    } finally {
      setNameChangeSaving(false);
    }
  };

  // Cancel name editing
  const handleCancelEditName = () => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setNameChangeError("");
    }
    setEditingName(false);
  };

  return (
    <div className="min-h-screen bg-[#FEF5EA]">
      <ProfileLayout />
      <main className="mt-1 mx-auto h-full w-full max-w-[1200px] p-4 md:p-10 pt-2 md:pt-2 pb-16 md:pb-20">
        <div className="flex border border-[#F4E3C9] rounded-[20px] bg-white p-4 md:p-7 flex-col lg:flex-row gap-4 lg:gap-8 shadow-sm">
          {/* SIDE PANEL COMPONENT */}
          <UserProfileSidePanel pages={pages} />
          {/* FORM CONTENT */}
          <div className="flex-1 min-w-0 lg:border-l border-[#F4E3C9] overflow-hidden lg:pl-8 lg:pt-0">
            <h2 className="text-lg md:text-xl md:mb-6 mb-4 font-semibold text-[#4A3728]">Profile Information</h2>
            {loading || error ? (
              <div className="space-y-6 animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-4 pt-8 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-10 bg-gray-100 rounded w-full" />
                  <div className="h-10 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ) : user ? (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-8 md:mb-10">
                  <div className="relative">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-sm"
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-300 border-4 border-white shadow-sm flex items-center justify-center">
                        <UserIcon size={40} className="md:size-[48px] text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="px-5 py-2 bg-white border border-[#F4E3C9] rounded-full text-sm shadow-sm hover:bg-[#FEF5EA] transition cursor-pointer inline-block">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePictureChange}
                        disabled={uploading}
                      />
                      {uploading ? "Uploading..." : "Change Picture"}
                    </label>
                    <p className="text-[11px] text-gray-400 mt-2 font-medium">
                      JPG, PNG or GIF. Max size 5MB
                    </p>
                    {uploadError && (
                      <div className="text-xs text-red-500 mt-1">{uploadError}</div>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <ProfileBadge role={user.role || "Member"} />
                  </div>
                </div>

                {/* NAME SECTION (EDITABLE) */}
                <div className="space-y-4 md:space-y-6 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200">
                  <h2 className="text-lg md:text-xl mb-4 md:mb-6 font-semibold text-[#4A3728]">Name Information</h2>

                  {editingName ? (
                    // Editing mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          disabled={nameChangeSaving}
                          className="w-full px-4 py-2 border border-[#F4E3C9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC37B] disabled:bg-[#FEF5EA] text-sm text-[#060B13]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          disabled={nameChangeSaving}
                          className="w-full px-4 py-2 border border-[#F4E3C9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC37B] disabled:bg-[#FEF5EA] text-sm text-[#060B13]"
                        />
                      </div>

                      {/* Cooldown message */}
                      {!nameChangeStatus.canChangeName && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-xs text-yellow-800">
                            ⏱️ {nameChangeStatus.message}
                          </p>
                        </div>
                      )}

                      {nameChangeError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs text-red-800">{nameChangeError}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={handleSaveName}
                          disabled={
                            nameChangeSaving ||
                            !nameChangeStatus.canChangeName ||
                            !firstName.trim() ||
                            !lastName.trim()
                          }
                          className="px-5 py-2 bg-[#F49B31] text-white rounded-full text-sm hover:bg-[#d88429] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {nameChangeSaving ? "Saving..." : "Save Name"}
                        </button>
                        <button
                          onClick={handleCancelEditName}
                          disabled={nameChangeSaving}
                          className="px-5 py-2 bg-[#FEF5EA] text-[#4A3728] rounded-full text-sm hover:bg-[#fae9d4] transition disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="space-y-4">
                      <ProfileDataField
                        label="Name"
                        value={`${user.firstName} ${user.lastName}`}
                        note={nameChangeStatus.canChangeName
                          ? (nameChangeStatus.isInGracePeriod
                            ? "You can change your name during the grace period"
                            : "Your name can be changed every 30 days")
                          : nameChangeStatus.message
                        }
                      />
                      <button
                        onClick={() => setEditingName(true)}
                        disabled={!nameChangeStatus.canChangeName}
                        className="px-5 py-2 bg-white border border-[#F4E3C9] rounded-full text-sm text-[#4A3728] hover:bg-[#FEF5EA] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400"
                      >
                        Edit Name
                      </button>
                      {!nameChangeStatus.canChangeName && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-xs text-yellow-800">
                            ⏱️ {nameChangeStatus.message}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <ProfileDataField
                    label="Primary Email"
                    value={user.email}
                    note="Your email address cannot be changed"
                  />
                </div>

                {/* ANONYMOUS IDENTITY SECTION */}
                <div className="space-y-6 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200">
                  <h2 className="text-lg md:text-xl mb-4 md:mb-6">Anonymous Identity</h2>

                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 lg:items-center">
                    {/* Left: Picture and Change Button */}
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start sm:items-center shrink-0">
                      <div className="relative">
                        {anonProfilePicture ? (
                          <img
                            src={anonProfilePicture}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-sm"
                            alt="Anonymous Profile"
                          />
                        ) : (
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-300 border-4 border-white shadow-sm flex items-center justify-center">
                            <UserIcon size={40} className="md:size-[48px] text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="px-5 py-2 bg-white border border-[#F4E3C9] rounded-full text-sm shadow-sm hover:bg-[#FEF5EA] transition cursor-pointer inline-block">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAnonPictureChange}
                            disabled={uploadingAnonPicture}
                          />
                          {uploadingAnonPicture ? "Uploading..." : "Change Picture"}
                        </label>
                        <p className="text-[11px] text-gray-400 mt-2 font-medium">
                          JPG, PNG or GIF. Max size 5MB
                        </p>
                        <button
                          type="button"
                          onClick={handleClearAnonPicture}
                          disabled={uploadingAnonPicture || !anonProfilePicture}
                          className="text-[11px] text-[#F49B31] mt-1 font-medium hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
                        >
                          Remove picture
                        </button>
                        {anonPictureError && (
                          <div className="text-xs text-red-500 mt-1">{anonPictureError}</div>
                        )}
                      </div>
                    </div>

                    {/* Right: Alias Field */}
                    <div className="flex-1 space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Alias
                      </label>

                      {editingAlias ? (
                        // Editing mode
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            disabled={aliasSaving}
                            className="w-full px-5 py-3 border border-[#F4E3C9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC37B] disabled:bg-[#FEF5EA] text-base text-[#060B13]"
                            placeholder="Enter your alias"
                          />
                          {aliasError && (
                            <div className="text-xs text-red-500">{aliasError}</div>
                          )}
                          <p className="text-xs text-gray-500">
                            Your alias can be changed every 30 days
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveAlias}
                              disabled={aliasSaving || !alias.trim()}
                              className="px-5 py-2 bg-[#F49B31] text-white rounded-full text-sm hover:bg-[#d88429] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {aliasSaving ? "Saving..." : "Save Alias"}
                            </button>
                            <button
                              onClick={handleCancelEditAlias}
                              disabled={aliasSaving}
                              className="px-5 py-2 bg-[#FEF5EA] text-[#4A3728] rounded-full text-sm hover:bg-[#fae9d4] transition disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="space-y-3">
                          <div className="bg-[#FEF5EA] border border-[#F4E3C9] rounded-xl px-5 py-3">
                            <p className="text-base text-[#060B13] font-poppins">{alias || "Not set"}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Your alias can be changed every 30 days
                          </p>
                          <button
                            onClick={() => setEditingAlias(true)}
                            className="px-5 py-2 bg-white border border-[#F4E3C9] rounded-full text-sm text-[#4A3728] hover:bg-[#FEF5EA] transition"
                          >
                            Edit Alias
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
