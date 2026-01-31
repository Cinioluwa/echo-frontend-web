import { useState } from "react";
import PingFormModal from "../../components/PingFormModal";
import WaveFormModal from "../../components/WaveFormModal";
import AdminOverviewLayout from "../Components/AdminOverviewLayout";
import PlatformMetrics from "../Components/PlatformMetrics";
import AdminChart from "../Components/AdminChart";
import AnnouncementModal from "../Components/AnnouncementModal";

const Overview = () => {
  const [waveForm, setWaveForm] = useState(false);
  const [formSegment, setFormSegment] = useState("ping");
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
        setFormSegment={setFormSegment}
        setForm={setWaveForm}
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

      {announcement && <AnnouncementModal setAnnouncementModal={setAnnouncement}/>}


      {formSegment === "ping" && (
        <div className={`${waveForm ? "" : "hidden"}`}>
          <PingFormModal
            formSegment={formSegment}
            setFormSegment={() => setFormSegment("wave")}
            setPingForm={() => setWaveForm(!waveForm)}
          >
            <button
              onClick={() => setWaveForm(!waveForm)}
              className="text-[13px] underline cursor-pointer"
            >
              cancel
            </button>
          </PingFormModal>
        </div>
      )}
      {formSegment === "wave" && (
        <div className={`${waveForm ? "" : "hidden"}`}>
          <WaveFormModal
            formSegment={formSegment}
            setFormSegment={() => setFormSegment("ping")}
            setWaveForm={() => setWaveForm(!waveForm)}
          >
            <button
              onClick={() => setWaveForm(!waveForm)}
              className="text-[13px] underline cursor-pointer"
            >
              cancel
            </button>
          </WaveFormModal>
        </div>
      )}
    </>
  );
};

export default Overview;
