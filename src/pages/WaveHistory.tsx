import WaveCard from "../components/WaveHistory/WaveCard";
import { type Pages } from "../components/SideBar";
import { useState } from "react";
import Layout from "../components/Layout";
import PingFormModal from "../components/PingFormModal";
import WaveFormModal from "../components/WaveFormModal";

const WaveHistory = () => {
  const [waveForm, setWaveForm] = useState(false);
  const [formSegment, setFormSegment] = useState("ping");

  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState({
    streamActive: false,
    historyActive: true,
    soundBoardActive: false,
  } as Pages);

  const [activePosts, setActivePosts] = useState({
    all: true,
    waves: false,
    pings: false,
  });

  return (
    <div className=" h-full">
      <Layout
        heading="History"
        setFormSegment={setFormSegment}
        setForm={setWaveForm}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className=" mr-2.5 ml-2.5 mt-5 md:mr-[46px] h-[calc(100vh-155px)]   md:ml-[350px] md:mt-[155px]">
        <div className=" h-full overflow-auto [scrollbar-width:none]">
          <div className="flex gap-[15px] mb-4">
            <div
              onClick={() =>
                setActivePosts({ all: true, waves: false, pings: false })
              }
              className={`${activePosts.all ? "text-white bg-[#F49B31]" : "bg-[#FFC37B]"} p-4 rounded-[18px] w-[100px] flex items-center cursor-pointer justify-center border border-[#7B7B79] h-10`}
            >
              All
            </div>
            <div
              onClick={() =>
                setActivePosts({ all: false, waves: true, pings: false })
              }
              className={` ${activePosts.waves ? "bg-[#F49B31] text-white" : "bg-[#FFC37B]"} p-4 rounded-[18px] w-[100px] cursor-pointer flex items-center justify-center border border-[#7B7B79] h-10`}
            >
              Waves
            </div>
            <div
              onClick={() =>
                setActivePosts({ all: false, waves: false, pings: true })
              }
              className={` ${activePosts.pings ? "bg-[#F49B31] text-white" : "bg-[#FFC37B]"} p-4 rounded-[18px] w-[100px] flex cursor-pointer items-center justify-center border border-[#7B7B79] h-10`}
            >
              Pings
            </div>
          </div>

          <div className="mb-[22px] flex md:block flex-col items-center">
            <h2 className=" md:mb-[22px] text-[25px] font-semibold">
              Yesterday
            </h2>
            <WaveCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment.
            "
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus."
            />
          </div>
          <div className="mb-[22px] flex md:block flex-col items-center">
            <h2 className=" md:mb-[22px] text-[25px] font-semibold">
              25th May 2025
            </h2>
            <WaveCard
              waveText="The current library facilities are outdated and insufficient to meet the needs of the growing student population. Many students find it challenging to locate necessary resources, and the study areas are often overcrowded. Upgrading the library facilities — including expanding the collection of books and digital resources, increasing seating capacity, and enhancing the study environment — will greatly benefit students and support their academic success.
            "
              waveTitle="Upgrade Library Facilities and Resources
            "
            />
          </div>
          <div className="mb-[22px] flex md:block flex-col items-center">
            <h2 className=" md:mb-[22px] text-[25px] font-semibold">
              25th May 2025
            </h2>
            <WaveCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
            />
          </div>
          <div className="mb-[22px] flex  md:block flex-col items-center">
            <h2 className="md:mb-[22px]  text-[25px] font-semibold">
              25th May 2025
            </h2>
            <WaveCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
            />
          </div>
          <div className="mb-[22px] flex md:block flex-col items-center">
            <h2 className="md:mb-[22px] text-[25px] font-semibold">
              25th May 2025
            </h2>
            <WaveCard
              waveText="The current library facilities are outdated and insufficient to meet the needs of the growing student population. Many students find it challenging to locate necessary resources, and the study areas are often overcrowded. Upgrading the library facilities — including expanding the collection of books and digital resources, increasing seating capacity, and enhancing the study environment — will greatly benefit students and support their academic success."
              waveTitle="Upgrade Library Facilities and Resources"
            />
          </div>
        </div>
      </main>

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
    </div>
  );
};

export default WaveHistory;
