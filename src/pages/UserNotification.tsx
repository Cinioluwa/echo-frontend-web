import UserProfileSidePanel from "../components/UserProfileSidePanel";
import ProfileLayout from "../components/ProfileLayout";
import Toggle from "../components/Toggle";
import { useState, useEffect } from "react";
import { usePushNotifications } from "../hooks";
import { notificationService } from "../api/services";
import type { NotificationPreferences } from "../api/services/notification.service";

const pages = {
  profile: false,
  account: false,
  notification: true,
  privacy: false,
};


const initialState: NotificationPreferences = {
  waveStatusUpdated: false,
  officialResponse: false,
  announcement: false,
  commentSurge: false,
  pingCreated: false,
  newWaveOnPing: false,
  newCommentOnPost: false,
  pingSurgedMilestone: false,
  commentReply: false,
};

const UserNotification = () => {
  const [prefs, setPrefs] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { subscribe } = usePushNotifications();
  const [pushStatus, setPushStatus] = useState<"Checking..." | "Enabled ✓" | "Click to enable">("Checking...");

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setPushStatus("Enabled ✓");
      } else if (Notification.permission === "denied") {
        setPushStatus("Checking..."); // You could say "Blocked" here
      } else {
        setPushStatus("Click to enable");
      }
    }
  }, []);

  const handlePushEnable = async () => {
    try {
      await subscribe();
      if (Notification.permission === "granted") {
        setPushStatus("Enabled ✓");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch notification preferences on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    notificationService.getPreferences()
      .then((data) => {
        if (!mounted) return;
        setPrefs(data);
      })
      .catch((err: any) => {
        if (!mounted) return;
        const errorMsg = err instanceof Error ? err.message : "Failed to load notification preferences";
        setError(errorMsg);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Handler for toggles
  const handleToggle = (key: keyof NotificationPreferences) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setSaving(true);
    setSuccess("");
    setError("");
    notificationService.updatePreferences(updated)
      .then((data) => {
        setPrefs(data);
        setSuccess("Preferences saved");
      })
      .catch((err: any) => {
        const errorMsg = err instanceof Error ? err.message : "Failed to save preferences";
        setError(errorMsg);
        setPrefs((prev) => ({ ...prev, [key]: !prev[key] })); // revert
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="overflow-scroll h-screen">
      <ProfileLayout />
      <main className="mt-3 mx-auto h-full p-4 md:p-10">
        <div className="flex md:border rounded-[15px] border-[#FFC37B] p-5 flex-col lg:flex-row gap-0 md:gap-12">
          <UserProfileSidePanel pages={pages} />
          <div className="flex-1 mb-80 md:border-l border-orange-200 md:pl-12 pt-4 md:pt-0">
            <div className="mb-6">
              <h2 className="text-xl text-[#4A3728] mb-1">Notification</h2>
              <p className="text-[#7D7D7D]">Manage how communication is made with you</p>
            </div>
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading preferences...</div>
            ) : (
              <>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {success && <div className="text-green-600 mb-2">{success}</div>}
                {/* Notification Toggles */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                    <span className="text-[#4A3728] text-base">Wave status updated</span>
                    <Toggle
                      checked={prefs.waveStatusUpdated}
                      onChange={() => handleToggle("waveStatusUpdated")}
                    />
                  </div>
                  <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                    <span className="text-[#4A3728] text-base">Official response notifications</span>
                    <Toggle
                      checked={prefs.officialResponse}
                      onChange={() => handleToggle("officialResponse")}
                    />
                  </div>
                  <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                    <span className="text-[#4A3728] text-base">Announcement notifications</span>
                    <Toggle
                      checked={prefs.announcement}
                      onChange={() => handleToggle("announcement")}
                    />
                  </div>
                  <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                    <span className="text-[#4A3728] text-base">Comment surge notifications</span>
                    <Toggle
                      checked={prefs.commentSurge}
                      onChange={() => handleToggle("commentSurge")}
                    />
                  </div>
                  <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                    <span className="text-[#4A3728] text-base">Ping created notifications</span>
                    <Toggle
                      checked={prefs.pingCreated}
                      onChange={() => handleToggle("pingCreated")}
                    />
                  </div>
                  <h3 className="text-lg text-[#4A3728] mt-6 font-semibold">Social Notifications</h3>
                  <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                    <span className="text-[#4A3728] text-base">New wave on your ping</span>
                    <Toggle
                      checked={prefs.newWaveOnPing}
                      onChange={() => handleToggle("newWaveOnPing")}
                    />
                  </div>
                  <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                    <span className="text-[#4A3728] text-base">New comment on your post</span>
                    <Toggle
                      checked={prefs.newCommentOnPost}
                      onChange={() => handleToggle("newCommentOnPost")}
                    />
                  </div>
                  <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                    <span className="text-[#4A3728] text-base">Ping surged milestone</span>
                    <Toggle
                      checked={prefs.pingSurgedMilestone}
                      onChange={() => handleToggle("pingSurgedMilestone")}
                    />
                  </div>
                  <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                    <span className="text-[#4A3728] text-base">Comment reply</span>
                    <Toggle
                      checked={prefs.commentReply}
                      onChange={() => handleToggle("commentReply")}
                    />
                  </div>

                  <h3 className="text-lg text-[#4A3728] mt-6 font-semibold">System Settings</h3>
                  <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                    <span className="text-[#4A3728] text-base">Browser Push Notifications</span>
                    <button
                      onClick={handlePushEnable}
                      disabled={pushStatus === "Enabled ✓" || pushStatus === "Checking..."}
                      className="px-4 py-2 bg-[#F49B31] text-white rounded-[25px] text-sm font-medium disabled:opacity-50 transition-colors"
                    >
                      {pushStatus}
                    </button>
                  </div>
                </div>
                {saving && <div className="text-gray-400 mt-2">Saving...</div>}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserNotification;
