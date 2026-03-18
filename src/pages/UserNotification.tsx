import UserProfileSidePanel from "../components/UserProfileSidePanel";
import ProfileLayout from "../components/ProfileLayout";
import Toggle from "../components/Toggle";
import { useState, useEffect } from "react";
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
};

const UserNotification = () => {
  const [prefs, setPrefs] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
