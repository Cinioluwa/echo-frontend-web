import { useEffect, useState, useRef } from "react";
import type { User } from "../../api/types/index";
import ProfileLayout from "../../components/ProfileLayout";
import AdminProfileSidePanel from "../../components/admin/AdminProfileSidePanel";
import profileImage from "/assets/images/profileImage.jpeg";
import ProfileBadge from "../../components/ProfileBadge";
import ProfileDataField from "../../components/ProfileDataField";
import userService from "../../api/services/user.service";
import uploadService from "../../api/services/upload.service";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const userData = await userService.getMe();
        setUser(userData);
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

                {/* DATA FIELDS (NON-EDITABLE) */}
                <div className="space-y-6">
                  <ProfileDataField
                    label="Name"
                    value={`${user.firstName} ${user.lastName}`}
                    note="Your name cannot be changed"
                  />
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
