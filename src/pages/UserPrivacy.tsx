import { HiOutlineCheckBadge } from "react-icons/hi2";
import Toggle from "../components/Toggle";
import UserProfileSidePanel from "../components/UserProfileSidePanel";
import ProfileLayout from "../components/ProfileLayout";
import { useState, useEffect } from "react";
import userService from "../api/services/user.service";
import type { UserPreference } from "../api/types";
import { getErrorMessage } from "../utils/networkUtils";

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
  const [updatingField, setUpdatingField] = useState<
    "commentAnonymously" | "pingAnonymously" | null
  >(null);

  // Fetch user preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        setError(null);
        const preferences = await userService.getMyPreferences();
        setUserPreference(preferences);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
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

    const previousPreference = userPreference;

    try {
      setUpdateMessage(null);
      setUpdatingField(field);

      setUserPreference({
        ...userPreference,
        [field]: value,
      });

      const updatedPreference = await userService.updateMyPreferences({
        [field]: value,
      });
      setUserPreference(updatedPreference);
      setUpdateMessage({
        type: "success",
        text: "Privacy preference saved.",
      });
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (err: unknown) {
      setUserPreference(previousPreference);
      setUpdateMessage({
        type: "error",
        text: getErrorMessage(err),
      });
      console.error("Error updating preference:", err);
    } finally {
      setUpdatingField(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEF5EA]">
      <ProfileLayout />
      <main className="mt-1 mx-auto h-full w-full max-w-[1200px] p-4 md:p-10 pt-2 md:pt-2 pb-16 md:pb-20">
        <div className="flex border border-[#F4E3C9] rounded-[20px] bg-white p-4 md:p-7 flex-col lg:flex-row gap-4 lg:gap-8 shadow-sm">
          {/* SIDE PANEL COMPONENT */}

          <UserProfileSidePanel pages={pages} />

          {/* FORM CONTENT */}
          <div className="flex-1 min-w-0 mb-20 lg:border-l border-[#F4E3C9] lg:pl-8 pt-4 lg:pt-0">
            <h2 className="text-lg md:text-xl text-[#4A3728] mb-4 md:mb-6 font-semibold">Email Verification</h2>

            {/* Verified Status Banner */}
            <div className="mb-6 md:mb-8 p-4 md:p-6 bg-[#FEF5EA] border border-[#F4E3C9] rounded-2xl flex items-start gap-4">
              <HiOutlineCheckBadge
              className="text-[#F49B31] mt-0.5 md:mt-1 shrink-0"
                size={22}
              />
              <div>
              <h3 className="text-[#4A3728] text-sm md:text-base font-semibold">Email Verified</h3>
              <p className="text-[#6B6259] text-xs md:text-sm mt-0.5 md:mt-1">
                  Your email has been verified. You can now enjoy the full
                  features of ECHO
                </p>
              </div>
            </div>

            {/* Loading Message */}
            {loading && (
              <div className="mb-6 md:mb-8 p-4 md:p-6 bg-[#FEF5EA] border border-[#FFCD71] rounded-2xl">
                <h3 className="text-[#926B3D] text-sm md:text-base font-semibold">Loading preferences</h3>
                <p className="text-[#926B3D]/80 text-xs md:text-sm mt-0.5 md:mt-1">
                  Fetching your privacy settings...
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && !loading && (
              <div className="mb-6 md:mb-8 p-4 md:p-6 bg-[#FEE2E2] border border-[#EF4444] rounded-2xl">
                <h3 className="text-[#991B1B] text-sm md:text-base font-semibold">Could not load preferences</h3>
                <p className="text-[#991B1B]/70 text-xs md:text-sm mt-0.5 md:mt-1">{error}</p>
              </div>
            )}

            {/* Update Success Message */}
            {updateMessage && updateMessage.type === "success" && (
              <div className="mb-8 p-4 md:p-6 bg-[#FEF5EA] border border-[#F4E3C9] rounded-2xl flex items-start gap-4">
                <div>
                  <h3 className="text-[#4A3728] text-base font-semibold">Success</h3>
                  <p className="text-[#6B6259] text-sm mt-1">
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
                    disabled={updatingField !== null}
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
                    disabled={updatingField !== null}
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
