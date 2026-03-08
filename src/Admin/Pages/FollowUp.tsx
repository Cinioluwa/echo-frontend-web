import { useState } from "react";
import AdminLayout from "../Components/AdminLayout";
import PingFormModal from "../../components/PingFormModal";
import WaveFormModal from "../../components/WaveFormModal";
import AdminWaveCard from "../Components/AdminWaveCard";

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
  status: "rejected" as const,
};

// STATIC PING DATA USING PINGSTORE- SIMULATING PINGS FROM SERVER.

const FollowUp = () => {
  const [waveForm, setWaveForm] = useState(false);
  const [formSegment, setFormSegment] = useState("ping");

  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState({
    feedActive: false,
    overviewActive: false,
    followUpActive: true,
  });

  const [activePosts, setActivePosts] = useState({
    underReview: true,
    approved: false,
    rejected: false,
  });

  return (
    <div>
      <AdminLayout
        heading="Follow Up"
        setFormSegment={setFormSegment}
        setForm={setWaveForm}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className=" mr-2.5 ml-2.5 mt-5 md:mr-[46px] h-[calc(100vh-155px)] md:ml-[350px] md:mt-[155px]">
        <div className=" h-full overflow-auto [scrollbar-width:none]">
          <div className="flex whitespace-nowrap gap-[15px] mb-4">
            <div
              onClick={() =>
                setActivePosts({
                  underReview: true,
                  approved: false,
                  rejected: false,
                })
              }
              className={`${activePosts.underReview ? "text-white bg-[#F49B31]" : "bg-[#FFC37B]"} p-4 rounded-[18px] w-full max-w-[200px] flex items-center cursor-pointer justify-center border border-[#7B7B79] font-semibold h-10`}
            >
              Under Review
            </div>
            <div
              onClick={() =>
                setActivePosts({
                  underReview: false,
                  approved: true,
                  rejected: false,
                })
              }
              className={` ${activePosts.approved ? "bg-[#F49B31] text-white" : "bg-[#FFC37B]"} p-4 rounded-[18px] w-full max-w-[200px] cursor-pointer flex items-center justify-center border border-[#7B7B79] font-semibold h-10`}
            >
              Approved
            </div>
            <div
              onClick={() =>
                setActivePosts({
                  underReview: false,
                  approved: false,
                  rejected: true,
                })
              }
              className={` ${activePosts.rejected ? "bg-[#F49B31] text-white" : "bg-[#FFC37B]"} p-4 rounded-[18px] font-semibold w-full max-w-[200px] flex cursor-pointer items-center justify-center border border-[#7B7B79] h-10`}
            >
              Rejected
            </div>
          </div>
          <div className="flex md:block flex-col items-center">
            <div className="mb-[22px]">
              <AdminWaveCard waves={proposedWaveDetails} />
            </div>
            <div className="mb-[22px]">
              <AdminWaveCard waves={proposedWaveDetails} />
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

export default FollowUp;
