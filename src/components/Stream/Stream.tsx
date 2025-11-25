import SideBar from "../SideBar";
import PageTitleBar from "../PageTitleBar";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { categoryImages } from "../CategoryImages";
import NavBar from "../NavBar";
import WaveFormModal, { type WaveFormDetails } from "../WaveFormModal";
import PingFormModal, { type PingFormDetails } from "../PingFormModal";
import type { proposedWaveDetails } from "../ProposeWaveModal";
import StreamCard from "./StreamCard";

const Stream = () => {
  const [waveForm, setWaveForm] = useState(false);
  const [formSegment, setFormSegment] = useState("wave");
  const [pingFormDetails, setPingFormDetails] = useState<PingFormDetails[]>([]);

  // FETCH (proposedWaveDetails - Contains the PingDetails(PingTitle and TimeStamp)) FROM SERVER:
  const [proposedWaveDetails, setProposedWaveDetails] = useState<
    proposedWaveDetails[]
  >([]);

  // FETCHED (waveFormDetails) FROM SERVER (MAPPED INTO STREAMCARD, Simulated with WaveFormModal module.):
  const [waveFormDetails, setWaveFormDetails] = useState<WaveFormDetails[]>([]);

  return (
    <div className="h-full">
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar />
        </nav>
        <PageTitleBar heading="Sound Board">
          <button
            onClick={() => {
              setWaveForm(!waveForm);
              setFormSegment("wave");
            }}
            className="flex cursor-pointer justify-center text-[13px] items-center gap-[7px] text-white transition-colors ease-in-out duration-300 rounded-[40px] hover:bg-[#d88429]
 bg-[#F49B31] py-2.5 px-[15px] text-center"
          >
            <FaPlus fontSize={20} />
            Create a wave
          </button>
        </PageTitleBar>
      </header>
      <aside className="hidden md:block [scrollbar-width:none]  overflow-y-auto   px-10 fixed h-[calc(100vh-155px)] w-[350px] left-0 bottom-0 whitespace-nowrap ">
        <SideBar />
      </aside>
      <main className="mr-2.5 ml-2.5 mt-5 flex flex-col md:mr-[46px] h-[calc(100vh-155px)]  md:ml-[350px]   md:mt-[155px]">



        {/* MAP WAVEFORM DETAILS INTO SOUNDBOARD CARDS */}
        <div className="flex-1 [scrollbar-width:none] h-full overflow-auto">
          {waveFormDetails.map((details) => (
            <div className="mb-[22px] " key={details.id}>
              <StreamCard
                waveText={details.solution}
                waveTitle={details.waveTitle}
                image={categoryImages[details.cat]}
                category={details.cat}
                timeStamp={details.createdAt}
              />
            </div>
          ))}


{/* HARD CODED */}
          <div className="mb-[22px]">
            <StreamCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment.
            "
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
              image={categoryImages.General}
              category="General"
              timeStamp="feb 29, 09:30 pm"
            />
          </div>

          <div className="mb-[22px]">
            <StreamCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              image={categoryImages.General}
              timeStamp="feb 29, 09:30 pm"
            />
          </div>
          <div className="mb-[22px]">
            <StreamCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              timeStamp="feb 29, 09:30 pm"
              image={categoryImages.General}
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
            setPingFormDetails={(details) => setPingFormDetails(details)}
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
            setWaveFormDetails={(details) => setWaveFormDetails(details)}
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

export default Stream;
