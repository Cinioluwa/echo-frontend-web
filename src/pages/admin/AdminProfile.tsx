import { useEffect, useState, useRef } from "react";
import type { User } from "../../api/types/index";
import ProfileLayout from "../../components/ProfileLayout";
import AdminProfileSidePanel from "../../components/admin/AdminProfileSidePanel";
import profileImage from "/assets/images/profileImage.jpeg";
import ProfileBadge from "../../components/ProfileBadge";
import ProfileDataField from "../../components/ProfileDataField";
import userService from "../../api/services/user.service";
import uploadService from "../../api/services/upload.service";
import {
  getNameChangeStatus,
  hasNameChanged,
} from "../../utils/nameChangeUtil";

const pages = {
  profile: true,
  account: false,
  notification: false,
};

const AdminProfile = () => {
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const userData = await userService.getMe();
        setUser(userData);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);

        // Calculate name change status
        const status = getNameChangeStatus(
          userData.createdAt,
          userData.lastNameChangeAt
        );
        setNameChangeStatus(status);
      } catch (err) {
        setError("Failed to load admin profile. Please try again.");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle profile picture upload
  const handlePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      setUploadError("Only JPG, PNG, GIF, or WebP files are allowed");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const response = await uploadService.uploadProfilePicture(file);
      // Update user with new profile picture URL
      setUser((prev) =>
        prev
          ? {
            ...prev,
            profilePicture: response.user?.profilePictureUrl || response.profilePictureUrl,
          }
          : prev
      );
    } catch (err) {
      setUploadError("Failed to upload profile picture. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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

  // Trigger file input on button click
  const handleChangeButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="overflow-scroll h-screen">
      <ProfileLayout />
      <main className="mt-3 mx-auto h-full p-4 md:p-10">
        <div className="flex md:border rounded-[15px] border-[#FFC37B] p-5 flex-col lg:flex-row gap-0 md:gap-12">
          {/* SIDE PANEL COMPONENT */}
          <AdminProfileSidePanel pages={pages} />

          {/* FORM CONTENT */}
          <div className="flex-1 md:border-l overflow-scroll mb-40 md:border-orange-200 md:pl-12 pt-4 md:pt-0">
            <h2 className="text-xl mb-6">Profile Picture</h2>

            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading profile...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : user ? (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
                  <div className="relative">
                    <img
                      src={user.profilePicture || profileImage}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">Uploading...</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <button
                      onClick={handleChangeButtonClick}
                      disabled={uploading}
                      className="px-5 py-2 bg-white border border-orange-200 rounded-lg text-sm shadow-sm hover:border-orange-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? "Uploading..." : "Change Picture"}
                    </button>
                    <p className="text-[11px] text-gray-400 mt-2 font-medium">
                      JPG, PNG or GIF. Max size 5MB
                    </p>
                    {uploadError && (
                      <p className="text-[11px] text-red-500 mt-2">{uploadError}</p>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <ProfileBadge role={user.role} />
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handlePictureChange}
                  className="hidden"
                  aria-label="Upload profile picture"
                />

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
                            : "You can change your name anytime")
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
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
