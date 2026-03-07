import { useState } from "react";
import PingFormModal from "../../components/PingFormModal";
import WaveFormModal from "../../components/WaveFormModal";
import AdminLayout from "../Components/AdminLayout";
import AdminWaveCard from "../Components/AdminWaveCard";
import AdminPingCard from "../Components/AdminPingCard";

// STATIC WAVE DATA USING WAVESTORE- SIMULATING WAVES FROM SERVER.
const proposedWaveDetails = {
  solution:
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae!",
  cat: "Chapel",
  pingTimeStamp: "Oct 8, 11:00 am",
  pingTitle:
    "The power off policy affects students badly. It disrupts study time.",
  createdAt: "Feb 29, 09:30 pm",
  id: "string",
  // BACK-END ATTRIBUTE
};

// STATIC PING DATA USING PINGSTORE- SIMULATING PINGS FROM SERVER.

const pingFormDetails = {
  cat: "Academics",
  pingDesc:
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae!",
  pingTitle: "Enhance the Microphone System in EIE Large Classroom",
  createdAt: "Oct 8, 11:00 am",
  anonymous: true,
  hashtag: "string",
  formSegment: "ping",
  id: "string",
};

const Feed = () => {
  const [waveForm, setWaveForm] = useState(false);
  const [formSegment, setFormSegment] = useState("ping");

  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState({
    feedActive: true,
    overviewActive: false,
    followUpActive: false,
  });

  const [activePosts, setActivePosts] = useState({
    all: true,
    waves: false,
    pings: false,
  });

  return (
    <div className="h-full">
      <AdminLayout
        heading="Admin Feed"
        setFormSegment={setFormSegment}
        setForm={setWaveForm}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className=" mr-2.5 ml-2.5 mt-5 md:mr-[46px] h-[calc(100vh-155px)]   md:ml-[350px] md:mt-[155px]">
        <div className="h-full overflow-auto [scrollbar-width:none]">
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

          {/* MAPPING WAVE AND PING DETAILS INTO ADMIN WAVE CARD */}
          <div className="flex md:block flex-col items-center">
            <div className="mb-[22px]">
              <AdminWaveCard waves={proposedWaveDetails} />
            </div>
            <div className="mb-[22px]">
              <AdminPingCard pings={pingFormDetails} />
            </div>
            <div className="mb-[22px]">
              <AdminWaveCard waves={proposedWaveDetails} />
            </div>
            <div className="mb-[22px]">
              <AdminPingCard pings={pingFormDetails} />
            </div>
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

export default Feed;
