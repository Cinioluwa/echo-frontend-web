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

const AdminNotification = () => {
  const [AdminNotification, setAdminNotification] = useState({
    emailUpdates: false,
    newPingInSpace: false,
    newWaveProposed: false,
    pingSurgeMilestone: false,
    memberJoinRequest: false,
  });

  console.log(AdminNotification);

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
              <p className="text-[#7D7D7D]">
                Manage how communication is made with you
              </p>
            </div>
            {/* Verified Status Banner */}
            <div className="mb-4 p-6 border border-orange-200 justify-between rounded-2xl flex items-center gap-4">
              <div>
                <h3 className="text-base">Email Notification</h3>
                <p className="text-sm mt-2 text-[#7D7D7D]">
                  You will receieve email updates
                </p>
              </div>
              <Toggle
                checked={AdminNotification.emailUpdates}
                onChange={(checked) =>
                  setAdminNotification({
                    ...AdminNotification,
                    emailUpdates: checked,
                  })
                }
              />
            </div>

            {/* Toggle Options Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Notify when a new Ping is posted in my institution's space
                </span>
                {/* Custom Tailwind Toggle Switch */}
                <Toggle
                  checked={AdminNotification.newPingInSpace}
                  onChange={(checked) =>
                    setAdminNotification({
                      ...AdminNotification,
                      newPingInSpace: checked,
                    })
                  }
                />
              </div>
              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Notify when a new Wave is proposed on a Ping
                </span>
                {/* Custom Tailwind Toggle Switch */}
                <Toggle
                  checked={AdminNotification.newWaveProposed}
                  onChange={(checked) =>
                    setAdminNotification({
                      ...AdminNotification,
                      newWaveProposed: checked,
                    })
                  }
                />
              </div>
              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Notify when a Ping reaches a surge milestone
                </span>
                {/* Custom Tailwind Toggle Switch */}
                <Toggle
                  checked={AdminNotification.pingSurgeMilestone}
                  onChange={(checked) =>
                    setAdminNotification({
                      ...AdminNotification,
                      pingSurgeMilestone: checked,
                    })
                  }
                />
              </div>
              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Notify when a member requests to join my institution's space
                </span>
                {/* Custom Tailwind Toggle Switch */}
                <Toggle
                  checked={AdminNotification.memberJoinRequest}
                  onChange={(checked) =>
                    setAdminNotification({
                      ...AdminNotification,
                      memberJoinRequest: checked,
                    })
                  }
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
