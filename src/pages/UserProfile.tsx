
import { useEffect, useState } from "react";
import type { User } from "../api/types/index";
import ProfileBadge from "../components/ProfileBadge";
import ProfileDataField from "../components/ProfileDataField";
import UserProfileSidePanel from "../components/UserProfileSidePanel";
import profileImage from "/assets/images/profileImage.jpeg";
import ProfileLayout from "../components/ProfileLayout";
import userService from "../api/services/user.service";
import uploadService from "../api/services/upload.service";

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

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await userService.getMe();
        setUser(data);
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

export default UserProfile;
