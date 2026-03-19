import { useState } from "react";
import AdminPostDetailsLayout from "./AdminPostDetailsLayout";
import PingFormModal from "../PingFormModal";
// import WavePostDetailFeed from "./WavePostDetailFeed";
import PingPostDetailFeed from "./PingPostDetailFeed";
import PostChartAnalysis from "./PostChartAnalysis";
import WaveFormModal from "../WaveFormModal";

const legendData = [
  { level: "100L", college: "CST", color: "#8A0FBF" },
  { level: "200L", college: "CLDS", color: "#FF7A33" },
  { level: "300L", college: "CMSS", color: "#FF1744" },
  { level: "400L", college: "COE", color: "#E66A85" },
  { level: "500L", college: "", color: "#3DBB6B" },
];

// SELECTED PING AND WAVE DETAILS TO BE DISPLAYED ON POST DETAILS PAGE. THIS DATA IS SIMULATED TO BE FETCHED FROM THE SERVER.

// const proposedWaveDetails = {
//   solution:
//     "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae!",
//   cat: "Chapel",
//   pingTimeStamp: "Oct 8, 11:00 am",
//   pingTitle:
//     "The power off policy affects students badly. It disrupts study time.",
//   createdAt: "Feb 29, 09:30 pm",
//   id: "string",
//   status: "rejected",
// };

// SELECTED PING AND WAVE DETAILS TO BE DISPLAYED ON POST DETAILS PAGE. THIS DATA IS SIMULATED TO BE FETCHED FROM THE SERVER.

import type { AdminPing } from "../../api/types/admin.types";

const pingFormDetails: AdminPing = {
  id: 1,
  title: "Enhance the Microphone System in EIE Large Classroom",
  content:
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem delectus aut ut iure reprehenderit, deleniti ea, commodi a inventore facere aliquam. Vel magnam sapiente, accusamus maxime ullam esse molestiae beatae!",
  categoryId: 1,
  status: "POSTED",
  progressStatus: "PENDING",
  isAnonymous: true,
  surgeCount: 45,
  viewCount: 230,
  createdAt: "2026-03-08T11:00:00Z",
  updatedAt: "2026-03-08T11:00:00Z",
  acknowledgedAt: null,
  resolvedAt: null,
  category: {
    id: 1,
    name: "Academics",
  },
  author: null,
  _count: {
    waves: 12,
    comments: 8,
    surges: 45,
  },
};

const PostDetails = () => {
  const [waveForm, setWaveForm] = useState(false);
  const [formSegment, setFormSegment] = useState("ping");

  const [activePage, setActivePage] = useState({
    feedActive: true,
    overviewActive: false,
    followUpActive: false,
  });

  return (
    <div className="overflow-scroll">
      <AdminPostDetailsLayout
        heading="More details"
        setFormSegment={setFormSegment}
        setForm={setWaveForm}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className=" mr-2.5 ml-2.5 mt-5 md:mr-[46px] h-[calc(100vh-155px)] md:ml-[350px] md:mt-[155px] ">
        <div className="overflow-scroll relative">
          <div className="bg-white rounded-[10px] xl:px-10 py-4 pb-30 overflow-scroll ">
            <PostChartAnalysis
              totalLevelComments={70}
              totalWaveSurges={139}
              totalCollegeSurges={55}
              totalCollegeComments={100}
            />
            {/* Labellings */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 w-full max-w-[500px] absolute top=[calc(100%-60px)] left-1/2 -translate-x-1/2">
              {legendData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white px-3 py-1 rounded-md shadow-sm"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="text-sm font-medium">
                    {item.level} {item.college && "&"} {item.college}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHOOSE WHETHER TO DISPLAY WAVE OR PING DETAILS FEED BASED ON ADMIN SELECTION*/}
        <div className="mt-10 pb-10">
          {/* <WavePostDetailFeed waves={proposedWaveDetails} /> */}

          <PingPostDetailFeed pings={pingFormDetails} />
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

export default PostDetails;
