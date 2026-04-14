
import { useEffect, useState } from "react";
import type { User } from "../api/types/index";
import ProfileBadge from "../components/ProfileBadge";
import ProfileDataField from "../components/ProfileDataField";
import UserProfileSidePanel from "../components/UserProfileSidePanel";
import profileImage from "/assets/images/profileImage.jpeg";
import ProfileLayout from "../components/ProfileLayout";
import userService from "../api/services/user.service";
import uploadService from "../api/services/upload.service";
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await userService.getMe();
        setUser(data);
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
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Profile picture upload handler
  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const res = await uploadService.uploadProfilePicture(file);
      setUser((prev) => prev ? { ...prev, profilePicture: res.user.profilePictureUrl } : prev);
    } catch (err) {
      setUploadError("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  // Anonymous picture upload handler
  const handleAnonPictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAnonPicture(true);
    setAnonPictureError("");
    try {
      const picUrl = await uploadService.uploadAnonProfilePicture(file);
      setAnonProfilePicture(picUrl);

      // Update preferences with the new picture URL
      const updatedPrefs = await userService.updateMyPreferences({
        anonymousAliasProfilePicture: picUrl,
      });

      // Update the user state if needed
      if (user?.userPreference) {
        setUser({
          ...user,
          userPreference: updatedPrefs,
        });
      }
    } catch (err) {
      setAnonPictureError("Failed to upload anonymous picture");
      console.error("Anonymous picture upload error:", err);
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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update alias";
      setAliasError(errorMsg);
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
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update name";
      setNameChangeError(errorMsg);
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
    <div className="overflow-scroll h-screen">
      <ProfileLayout />
      <main className="mt-3 mx-auto h-full p-4 md:p-10">
        <div className="flex md:border rounded-[15px] border-[#FFC37B] p-5 flex-col lg:flex-row gap-0 md:gap-12">
          {/* SIDE PANEL COMPONENT */}
          <UserProfileSidePanel pages={pages} />
          {/* FORM CONTENT */}
          <div className="flex-1 md:border-l overflow-scroll md:border-orange-200 md:pl-12 pt-4 md:pt-0">
            <h2 className="text-xl mb-6">Profile Picture</h2>
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : user ? (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
                  <div className="relative">
                    <img
                      src={user.profilePicture || profileImage}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                      alt="Profile"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="px-5 py-2 bg-white border border-orange-200 rounded-lg text-sm shadow-sm hover:border-orange-300 transition cursor-pointer inline-block">
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
                <div className="space-y-6 mt-8 pt-8 border-t border-gray-200">
                  <h2 className="text-xl mb-6">Name Information</h2>

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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
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
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {nameChangeSaving ? "Saving..." : "Save Name"}
                        </button>
                        <button
                          onClick={handleCancelEditName}
                          disabled={nameChangeSaving}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition disabled:opacity-50"
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
                        className="px-4 py-2 bg-white border border-orange-200 rounded-lg text-sm hover:border-orange-300 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400"
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
                <div className="space-y-6 mt-8 pt-8 border-t border-gray-200">
                  <h2 className="text-xl mb-6">Anonymous Identity</h2>

                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 lg:items-center">
                    {/* Left: Picture and Change Button */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center shrink-0">
                      <div className="relative">
                        <img
                          src={anonProfilePicture || profileImage}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                          alt="Anonymous Profile"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="px-5 py-2 bg-white border border-orange-200 rounded-lg text-sm shadow-sm hover:border-orange-300 transition cursor-pointer inline-block">
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
                            className="w-full px-5 py-3 border border-gray-300 rounded-[9px] focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 text-base"
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
                              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {aliasSaving ? "Saving..." : "Save Alias"}
                            </button>
                            <button
                              onClick={handleCancelEditAlias}
                              disabled={aliasSaving}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm hover:bg-gray-300 transition disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="space-y-3">
                          <div className="bg-orange-50 border border-orange-300 rounded-[9px] px-5 py-3">
                            <p className="text-base text-black font-poppins">{alias || "Not set"}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Your alias can be changed every 30 days
                          </p>
                          <button
                            onClick={() => setEditingAlias(true)}
                            className="px-4 py-2 bg-white border border-orange-200 rounded-lg text-sm hover:border-orange-300 transition"
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
