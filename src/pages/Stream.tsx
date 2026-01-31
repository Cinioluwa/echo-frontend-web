import { useState } from "react";
import { categoryImages } from "../components/CategoryImages";
import WaveFormModal from "../components/WaveFormModal";
import PingFormModal from "../components/PingFormModal";
import StreamCard from "../components/Stream/StreamCard";
import Layout from "../components/Layout";
import type { Pages } from "../components/SideBar";
import useWaveStore from "../services/waveStore";
import AnnouncementCard from "../components/AnnouncementCard";

const Stream = () => {
  const [waveForm, setWaveForm] = useState(false);
  const [formSegment, setFormSegment] = useState("wave");

  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState<Pages>({
    streamActive: true,
    historyActive: false,
    soundBoardActive: false,
  });

  // FETCH (proposeWaveForm Details - Contains the PingDetails(PingTitle and pingTimeStamp)) FROM SERVER - MAP INTO STREAMCARD:

  // const [proposedWaveDetails, setProposedWaveDetails] = useState<
  //   proposedWaveDetails[]
  // >([]);

  // FETCHED (waveFormDetails) FROM SERVER (MAPPED INTO STREAMCARD, Simulated with WaveFormModal module.):   --- ** Meant to be the ProposedWaveDetails, since only proposedWaves would be displayed (undecided by osas).**

  const waveDetails = useWaveStore((s) => s.waves);

  return (
    <div className="h-full">
      <Layout
        heading="Stream"
        setFormSegment={setFormSegment}
        setForm={setWaveForm}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="mr-2.5 ml-2.5 mt-5 flex flex-col md:mr-[46px] h-[calc(100vh-155px)]  md:ml-[350px]   md:mt-[155px]">

<AnnouncementCard />


        {/* MAP WAVEFORM (proposedWaveForm) DETAILS INTO SOUNDBOARD CARDS */}
        <div className="flex-1 [scrollbar-width:none] h-full overflow-auto">
          {waveDetails.map((details) => (
            <div className="mb-[22px] " key={details.id}>
              <StreamCard
                waveText={details.solution}
                image={categoryImages[details.cat]}
                category={details.cat}
                createdAt={details.createdAt}
                pingTimeStamp="Oct 8, 11:00 am"
                waveTitle={details.pingTitle}
                pingTitle={
                  details.pingTitle
                    ? details.pingTitle
                    : "Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions."
                }
              />
            </div>
          ))}

          {/* HARD CODED */}
          <div className="mb-[22px]">
            <StreamCard
              waveText="While the current policy may have been introduced with conservative intentions, it is unintentionally creating more challenges than benefits for students whose daily routines rely on steady electricity. During the day, many students remain in the halls due to having few or no classes, and without reliable power they are left with two poor options: enduring hot, unconducive study environments or moving to overcrowded spaces with weak internet connectivity. A practical solution would be to reduce the timeframe of the policy. Shortening the duration would ease these difficulties, providing students with a more comfortable and productive environment. This adjustment would not only improve daily living conditions but also help safeguard academic performance, ensuring the policy supports rather than hinders student success.
            "
              waveTitle="Reduce the power-off period to 10 a.m. - 3 p.m."
              image={categoryImages.General}
              category="General"
              createdAt="feb 29, 09:30 pm"
              pingTimeStamp="Oct 8, 11:00 am"
              pingTitle="While the current policy may have been introduced with conservative intentions, it is unintentionally creating more challenges than benefits for students whose daily routines rely on steady electricity. During the day, many students remain in the halls due to having few or no classes, and without reliable power they are left with two poor options: enduring hot, unconducive study environments or moving to overcrowded spaces with weak internet connectivity
"
            />
          </div>

          <div className="mb-[22px]">
            <StreamCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              image={categoryImages.General}
              createdAt="feb 29, 09:30 pm"
              pingTimeStamp="Oct 8, 11:00 am"
              pingTitle="The school WiFi is so slow that even sending a simple message feels like downloading the entire internet.
"
            />
          </div>
          <div className="mb-[22px]">
            <StreamCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              createdAt="feb 29, 09:30 pm"
              pingTimeStamp="Oct 8, 11:00 am"
              pingTitle="The school WiFi is so slow that even sending a simple message feels like downloading the entire internet.
"
              image={categoryImages.General}
            />
          </div>
          <div className="mb-[22px]">
            <StreamCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              createdAt="feb 29, 09:30 pm"
              pingTimeStamp=""
              pingTitle="The school WiFi is so slow that even sending a simple message feels like downloading the entire internet.
"
              image={categoryImages.General}
            />
          </div>
          <div className="mb-[22px]">
            <StreamCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              createdAt="feb 29, 09:30 pm"
              pingTimeStamp="Oct 8, 11:00 am"
              pingTitle="The school WiFi is so slow that even sending a simple message feels like downloading the entire internet.
"
              image={categoryImages.General}
            />
          </div>
          <div className="mb-[22px]">
            <StreamCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              createdAt="feb 29, 09:30 pm"
              pingTimeStamp="Oct 8, 11:00 am"
              pingTitle="The school WiFi is so slow that even sending a simple message feels like downloading the entire internet.
"
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

export default Stream;
