import { useState } from "react";
import ProfileLayout from "../../components/ProfileLayout";
import Toggle from "../../components/Toggle";
import AdminProfileSidePanel from "../../components/admin/AdminProfileSidePanel";

const pages = {
  profile: false,
  account: false,
  notification: true,
  privacy: false,
};

interface NotificationPreferences {
  waveStatusUpdated: boolean;
  officialResponse: boolean;
  announcement: boolean;
  commentSurge: boolean;
  pingCreated: boolean;
  commentReply: boolean;
}

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

  // Handle toggle changes
  const handleToggle = async (field: keyof NotificationPreferences): Promise<void> => {
    const updated = { ...preferences, [field]: !preferences[field] };
    setPreferences(updated);

    try {
      setSaving(field);
      // TODO: Replace with actual API call when backend endpoint is ready
      // await userService.updateNotificationPreferences({ [field]: updated[field] });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaving(null);
    } catch (err: any) {
      console.error(`Failed to save ${String(field)}:`, err);
      // Revert on error
      setPreferences(preferences);
      setSaving(null);
    }
  };

  return (
    <div className="overflow-scroll h-screen">
      <ProfileLayout feedPath="/admin/feed" />
      <main className="mt-3 mx-auto h-full p-4 md:p-10">
        <div className="flex md:border rounded-[15px] border-[#FFC37B] p-5 flex-col lg:flex-row gap-0 md:gap-12">
          {/* SIDE PANEL COMPONENT */}
          <AdminProfileSidePanel pages={pages} />

          {/* FORM CONTENT */}
          <div className="flex-1 mb-80 md:border-l border-orange-200 md:pl-12 pt-4 md:pt-0">
            <div className="mb-6">
              <h2 className="text-xl text-[#4A3728] mb-1">Notification</h2>
              <p className="text-[#7D7D7D]">
                Manage how communication is made with you
              </p>
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
