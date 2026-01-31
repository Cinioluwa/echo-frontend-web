import soundBoardImage from "../assets/images/SoundBoardImage.svg";
import SoundBoardCard from "../components/SoundBoard/SoundBoardCard";
import { useState } from "react";
import { categoryImages } from "../components/CategoryImages";
import ProposeWaveModal from "../components/ProposeWaveModal";
import type { PingFormDetails } from "../components/PingFormModal";
import WaveFormModal from "../components/WaveFormModal";
import PingFormModal from "../components/PingFormModal";
import Layout from "../components/Layout";
import type { Pages } from "../components/SideBar";
import usePingStore from "../services/pingStore";
import CommentModal from "../components/CommentModal";

const SoundBoard = () => {
  const [pingForm, setPingForm] = useState(false);
  const [openCommentModal, setOpencommentModal] = useState(false);
  const [formSegment, setFormSegment] = useState("ping");

  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState({
    streamActive: false,
    historyActive: false,
    soundBoardActive: true,
  } as Pages);

  //SIMULATING FETCHED DATA FROM SERVER (MAPPED INTO SOUNDBOARD-CARD, Simulated with PingFormModal module.):
  const pingFormDetails = usePingStore((s) => s.pings);

  const [proposedPingDetails, setProposedPingDetails] =
    useState<PingFormDetails | null>(null);

  const [proposeWaveModal, setProposeWaveModal] = useState(false);
  const [proposeActive, setProposeActive] = useState(false);

  // SEARCH FOR WHICH PING WAS PROPOSED (SIMULATED ID FROM uuid4 Library):
  function handleWaveProposal(id: string) {
    const proposedPing = pingFormDetails.find((details) => details.id === id);
    proposedPing && setProposedPingDetails({ ...proposedPing });
    setProposeWaveModal(!proposeWaveModal);
    console.log(proposedPing);
  }

  return (
    <div className="h-full">
      <Layout
        heading="Sound Board"
        setFormSegment={setFormSegment}
        setForm={setPingForm}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="mr-2.5 ml-2.5 mt-5 flex flex-col md:mr-[46px] h-[calc(100vh-155px)]  md:ml-[350px]   md:mt-[155px]">
        <div className="mb-[25px]">
          <img src={soundBoardImage} alt="" className=" max-h-[200px] w-full" />
        </div>

        {/* MAP PINGFORM DETAILS INTO SOUNDBOARD CARDS */}
        <div className="flex-1 [scrollbar-width:none] h-full overflow-auto">
          {pingFormDetails.map((details) => (
            <div className="mb-[22px] " key={details.id}>
              <SoundBoardCard
                pingText={details.pingDesc}
                pingTitle={details.pingTitle}
                image={categoryImages[details.cat]}
                category={details.cat}
                hashtag={details.hashtag}
                timeStamp={details.createdAt}
                id={details.id}
                onPropose={(id) => handleWaveProposal(id)}
                setCommentModal={setOpencommentModal}
                proposeActive={proposeActive}
              />
            </div>
          ))}

          {/* HARD CODED */}
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment.
            "
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
              image={categoryImages.General}
              category="General"
              hashtag="#welfare #internet"
              timeStamp="feb 29, 09:30 pm"
              id=""
              setCommentModal={setOpencommentModal}
              onPropose={(id) => handleWaveProposal(id)}
              proposeActive={false}
            />
          </div>

          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              image={categoryImages.General}
              timeStamp="feb 29, 09:30 pm"
              hashtag="#welfare #internet"
              setCommentModal={setOpencommentModal}
              id=""
              onPropose={(id) => handleWaveProposal(id)}
              proposeActive={false}
            />
          </div>
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              timeStamp="feb 29, 09:30 pm"
              hashtag="#welfare #internet"
              setCommentModal={setOpencommentModal}
              image={categoryImages.General}
              id=""
              onPropose={(id) => handleWaveProposal(id)}
              proposeActive={false}
            />
          </div>
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              timeStamp="feb 29, 09:30 pm"
              hashtag="#welfare #internet"
              setCommentModal={setOpencommentModal}
              image={categoryImages.General}
              id=""
              onPropose={(id) => handleWaveProposal(id)}
              proposeActive={false}
            />
          </div>
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              timeStamp="feb 29, 09:30 pm"
              setCommentModal={setOpencommentModal}
              hashtag="#welfare #internet"
              image={categoryImages.General}
              id=""
              onPropose={(id) => handleWaveProposal(id)}
              proposeActive={false}
            />
          </div>
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              timeStamp="feb 29, 09:30 pm"
              setCommentModal={setOpencommentModal}
              hashtag="#welfare #internet"
              image={categoryImages.General}
              id=""
              onPropose={(id) => handleWaveProposal(id)}
              proposeActive={false}
            />
          </div>
        </div>
      </main>

      {openCommentModal && (
        <CommentModal setCommentModal={setOpencommentModal} />
      )}

      {formSegment === "ping" && (
        <div className={`${pingForm ? "" : "hidden"}`}>
          <PingFormModal
            formSegment={formSegment}
            setFormSegment={() => setFormSegment("wave")}
            setPingForm={() => setPingForm(!pingForm)}
          >
            <button
              onClick={() => setPingForm(!pingForm)}
              className="text-[13px] underline cursor-pointer"
            >
              cancel
            </button>
          </PingFormModal>
        </div>
      )}
      {formSegment === "wave" && (
        <div className={`${pingForm ? "" : "hidden"}`}>
          <WaveFormModal
            formSegment={formSegment}
            setFormSegment={() => setFormSegment("ping")}
            setWaveForm={() => setPingForm(!pingForm)}
          >
            <button
              onClick={() => setPingForm(!pingForm)}
              className="text-[13px] underline cursor-pointer"
            >
              cancel
            </button>
          </WaveFormModal>
        </div>
      )}

      {proposeWaveModal && (
        <ProposeWaveModal
          onClose={() => setProposeWaveModal(!proposeWaveModal)}
          pingTimeStamp={proposedPingDetails?.createdAt}
          pingTitle={proposedPingDetails?.pingTitle}
          setProposeActive={setProposeActive}
        />
      )}
    </div>
  );
};

export default SoundBoard;
