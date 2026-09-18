import { useState, useEffect } from "react";
import ProfileLayout from "../../components/ProfileLayout";
import Toggle from "../../components/Toggle";
import AdminProfileSidePanel from "../../components/admin/AdminProfileSidePanel";
import { notificationService } from "../../api/services";
import type { NotificationPreferences } from "../../api/services/notification.service";

const pages = {
  profile: false,
  account: false,
  notification: true,
  privacy: false,
};

const AdminNotification = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    waveStatusUpdated: true,
    officialResponse: true,
    announcement: true,
    commentSurge: false,
    pingCreated: true,
    commentReply: true,
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notification preferences on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    notificationService.getPreferences()
      .then((data) => {
        if (!mounted) return;
        setPreferences(data);
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

  // Handle toggle changes
  const handleToggle = async (field: keyof NotificationPreferences): Promise<void> => {
    const updated = { ...preferences, [field]: !preferences[field] };
    setPreferences(updated);

    try {
      setSaving(field);
      setError(null);
      const newPrefs = await notificationService.updatePreferences(updated);
      setPreferences(newPrefs);
    } catch (err: any) {
      console.error(`Failed to save ${String(field)}:`, err);
      // Revert on error
      setPreferences(preferences);
      setError(err instanceof Error ? err.message : "Failed to save preference");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="overflow-scroll h-screen flex justify-center items-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#f49b31] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="overflow-scroll h-screen">
      <ProfileLayout />
      <main className="mt-3 mx-auto h-full p-4 md:p-10">
        <div className="flex md:border rounded-[15px] border-[#FFC37B] p-5 flex-col lg:flex-row gap-0 md:gap-12">
          {/* SIDE PANEL COMPONENT */}
          <AdminProfileSidePanel pages={pages} />

          {/* FORM CONTENT */}
          <div className="flex-1 mb-80 md:border-l border-orange-200 md:pl-12 pt-4 md:pt-0">
            <div className="mb-6">
              <h2 className="text-xl text-[#4A3728] mb-1">Notification</h2>
              <p className="text-[#7D7D7D] mb-2">
                Manage how communication is made with you
              </p>
              {error && (
                  <p className="text-sm text-red-500 mb-2">{error}</p>
              )}
            </div>

            {/* Toggle Options Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Notify when a wave (solution) status is updated
                </span>
                <Toggle
                  checked={preferences.waveStatusUpdated}
                  onChange={() => handleToggle("waveStatusUpdated")}
                  disabled={saving === "waveStatusUpdated"}
                />
              </div>

              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Notify when an official response is posted to my ping
                </span>
                <Toggle
                  checked={preferences.officialResponse}
                  onChange={() => handleToggle("officialResponse")}
                  disabled={saving === "officialResponse"}
                />
              </div>

              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Notify when announcements are posted
                </span>
                <Toggle
                  checked={preferences.announcement}
                  onChange={() => handleToggle("announcement")}
                  disabled={saving === "announcement"}
                />
              </div>

              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Notify when my comments receive surges (likes)
                </span>
                <Toggle
                  checked={preferences.commentSurge}
                  onChange={() => handleToggle("commentSurge")}
                  disabled={saving === "commentSurge"}
                />
              </div>

              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Notify when new pings are created in my organization
                </span>
                <Toggle
                  checked={preferences.pingCreated}
                  onChange={() => handleToggle("pingCreated")}
                  disabled={saving === "pingCreated"}
                />
              </div>

              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Notify when someone replies to my comment
                </span>
                <Toggle
                  checked={preferences.commentReply}
                  onChange={() => handleToggle("commentReply")}
                  disabled={saving === "commentReply"}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminNotification;
