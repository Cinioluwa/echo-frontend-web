import { HiOutlineCheckBadge } from "react-icons/hi2";
import Toggle from "../components/Toggle";
import UserProfileSidePanel from "../components/UserProfileSidePanel";
import ProfileLayout from "../components/ProfileLayout";
import { useState, useEffect } from "react";
import userService from "../api/services/user.service";
import type { UserPreference } from "../api/types";

const pages = {
  profile: false,
  account: false,
  notification: false,
  privacy: true,
};

const UserPrivacy = () => {
  const [userPreference, setUserPreference] = useState<UserPreference | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch user preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        setError(null);
        const preferences = await userService.getMyPreferences();
        setUserPreference(preferences);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load preferences";
        setError(message);
        console.error("Error fetching preferences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Handle preference updates
  const handlePreferenceUpdate = async (
    field: "commentAnonymously" | "pingAnonymously",
    value: boolean,
  ) => {
    if (!userPreference) return;

    try {
      setUpdateMessage(null);
      const updatedPreference = await userService.updateMyPreferences({
        [field]: value,
      });
      setUserPreference(updatedPreference);
      setUpdateMessage({
        type: "success",
        text: "Preference updated successfully",
      });
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update preference";
      setUpdateMessage({
        type: "error",
        text: message,
      });
      console.error("Error updating preference:", err);
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
          <div className="flex-1 mb-20 md:border-l border-orange-200 md:pl-12 pt-4 md:pt-0">
            <h2 className="text-lg md:text-xl text-[#4A3728] mb-4 md:mb-6 font-semibold">Email Verification</h2>

            {/* Verified Status Banner */}
            <div className="mb-6 md:mb-8 p-4 md:p-6 bg-[#E8F9F1] border border-[#4ADE80] rounded-2xl flex items-start gap-4">
              <HiOutlineCheckBadge
                className="text-[#22C55E] mt-0.5 md:mt-1 shrink-0"
                size={22}
              />
              <div>
                <h3 className="text-[#166534] text-sm md:text-base font-semibold">Email Verified</h3>
                <p className="text-[#166534]/70 text-xs md:text-sm mt-0.5 md:mt-1">
                  Your email has been verified. You can now enjoy the full
                  features of ECHO
                </p>
              </div>
            </div>

            {/* Error Message */}
            {(loading || error) && (
              <div className="mb-6 md:mb-8 p-4 md:p-6 bg-[#FEE2E2] border border-[#EF4444] rounded-2xl flex items-start gap-4 animate-pulse">
                <div>
                  <h3 className="text-[#991B1B] text-sm md:text-base font-semibold">{error ? "Error" : "Loading..."}</h3>
                  <p className="text-[#991B1B]/70 text-xs md:text-sm mt-0.5 md:mt-1">{error || "Fetching your privacy settings..."}</p>
                </div>
              </div>
            )}

            {/* Update Success Message */}
            {updateMessage && updateMessage.type === "success" && (
              <div className="mb-8 p-6 bg-[#DBEAFE] border border-[#3B82F6] rounded-2xl flex items-start gap-4">
                <div>
                  <h3 className="text-[#1E40AF] text-base">Success</h3>
                  <p className="text-[#1E40AF]/70 text-sm mt-1">
                    {updateMessage.text}
                  </p>
                </div>
              </div>
            )}

            {/* Update Error Message */}
            {updateMessage && updateMessage.type === "error" && (
              <div className="mb-8 p-6 bg-[#FEE2E2] border border-[#EF4444] rounded-2xl flex items-start gap-4">
                <div>
                  <h3 className="text-[#991B1B] text-base">Update Failed</h3>
                  <p className="text-[#991B1B]/70 text-sm mt-1">
                    {updateMessage.text}
                  </p>
                </div>
              </div>
            )}

            {/* Toggle Options Section */}
            {userPreference && !loading && (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 md:p-5 bg-transparent border border-orange-200 rounded-2xl">
                  <span className="text-[#4A3728] text-sm md:text-base font-medium">
                    Comment Anonymously
                  </span>
                  <Toggle
                    checked={userPreference.commentAnonymously}
                    onChange={(checked) =>
                      handlePreferenceUpdate("commentAnonymously", checked)
                    }
                    disabled={updateMessage?.type === "error"}
                  />
                </div>
                <div className="flex justify-between items-center p-4 md:p-5 bg-transparent border border-orange-200 rounded-2xl">
                  <span className="text-[#4A3728] text-sm md:text-base font-medium">
                    Post Pings Anonymously
                  </span>
                  <Toggle
                    checked={userPreference.pingAnonymously}
                    onChange={(checked) =>
                      handlePreferenceUpdate("pingAnonymously", checked)
                    }
                    disabled={updateMessage?.type === "error"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPrivacy;
