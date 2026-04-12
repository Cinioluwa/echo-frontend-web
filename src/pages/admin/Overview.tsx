import { useState } from "react";
import PingFormModal from "../../components/PingFormModal";
import AdminOverviewLayout from "../../components/admin/AdminOverviewLayout";
import PlatformMetrics from "../../components/admin/PlatformMetrics";
import AdminChart from "../../components/admin/AdminChart";
import AnnouncementModal from "../../components/admin/AnnouncementModal";

const Overview = () => {
  const [showPingForm, setShowPingForm] = useState(false);
  const [announcement, setAnnouncement] = useState(false);


  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState({
    feedActive: false,
    overviewActive: true,
    followUpActive: false,
  });

  return (
    <>
      <AdminOverviewLayout
        setAnnouncementModal={setAnnouncement}
        heading="Overview"
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className=" mr-2.5 ml-2.5 mt-5 md:mr-[46px] h-[calc(100vh-155px)]  md:ml-[350px] md:mt-[155px]">
        <div className="overflow-auto [scrollbar-width:none]">
          <PlatformMetrics />
        </div>
        <div className="p-2  pt-8 text-[14px] pr-8 bg-white rounded-2xl  mt-7 max-w-[900px]">
          <div className="m-6 mb-10 mt-0 flex gap-4">
            <p className="font-semibold">Total Users</p>
            <p className="text-[#00000066]">Waves</p>
            <p className="text-[#00000066]">Surges</p>
            <p className="text-[#00000066]">|</p>
            <div className="flex text-[12px] items-center gap-1">
              <span className="w-1.5 h-1.5 inline-block rounded-full bg-[#000000]"></span>{" "}
              This year
            </div>
            <div className="flex text-[12px] items-center gap-1">
              <span className="w-1.5 h-1.5 inline-block rounded-full bg-[#AEC7ED]"></span>{" "}
              Last year
            </div>
          </div>

          <AdminChart />
        </div>
      </main>

      {announcement && <AnnouncementModal setAnnouncementModal={setAnnouncement} />}

      {showPingForm && (
        <PingFormModal
          setPingForm={() => setShowPingForm(false)}
          onPingCreated={() => setShowPingForm(false)}
        />
      )}
    </>
  );
};

export default Overview;
