import soundBoardImage from "../assets/images/SoundBoardImage.svg";
import SoundBoardCard from "../components/SoundBoard/SoundBoardCard";
import SideBar from "../components/SideBar";
import PageTitleBar from "../components/PageTitleBar";
import ModalFormDetails from "../components/ModalForm";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import type { modalFormDetails } from "../components/ModalForm";
import { categoryImages } from "../components/CategoryImages";
import NavBar from "../components/NavBar";

const SoundBoard = () => {
  const [pingForm, setPingForm] = useState(false);

  const [pingFormDetails, setPingFormDetails] = useState<modalFormDetails[]>(
    []
  );

  return (
    <div className="h-full">
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar />
        </nav>
        <PageTitleBar heading="Sound Board">
          <div
            onClick={() => setPingForm(!pingForm)}
            className="flex cursor-pointer justify-center text-[13px] items-center gap-[7px] text-white rounded-[40px] bg-[#F49B31] py-2.5 px-[15px] text-center"
          >
            <FaPlus fontSize={20} />
            Create a ping
          </div>
        </PageTitleBar>
      </header>

      <aside className="hidden md:block [scrollbar-width:none]  overflow-y-auto   px-10 fixed h-[calc(100vh-155px)] w-[350px] left-0 bottom-0 whitespace-nowrap ">
        <SideBar />
      </aside>

      <main className="mr-2.5 ml-2.5 mt-5 flex flex-col md:mr-[46px] h-[calc(100vh-155px)]  md:ml-[350px]   md:mt-[155px]">
        <div className="mb-[25px]">
          <img src={soundBoardImage} alt="" className=" max-h-[200px] w-full" />
        </div>

        <div className="flex-1 [scrollbar-width:none] h-full overflow-auto">
          {pingFormDetails.map((formDetails) => (
            <div className="mb-[22px]" key={formDetails.id}>
              <SoundBoardCard
                pingText={formDetails.desc}
                pingTitle={formDetails.title}
                image={categoryImages[formDetails.cat]}
                category={formDetails.cat}
                hashtag={formDetails.hashtag}
                timeStamp={formDetails.createdAt}
              />
            </div>
          ))}

          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment.
            "
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
              image={categoryImages.General}
              category="General"
              hashtag="#welfare #internet"
              timeStamp="Feb 29, 09:30 pm"
            />
          </div>

          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              image={categoryImages.General}
              timeStamp="Feb 29, 09:30 pm"
              hashtag="#welfare #internet"
            />
          </div>
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
              category="General"
              timeStamp="Feb 29, 09:30 pm"
              hashtag="#welfare #internet"
              image={categoryImages.General}
            />
          </div>
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="The current library facilities are outdated and insufficient to meet the needs of the growing student population. Many students find it challenging to locate necessary resources, and the study areas are often overcrowded. Upgrading the library facilities — including expanding the collection of books and digital resources, increasing seating capacity, and enhancing the study environment — will greatly benefit students and support their academic success."
              pingTitle="Upgrade Library Facilities and Resources"
              category="General"
              timeStamp="Feb 29, 09:30 pm"
              hashtag="#welfare #internet"
              image={categoryImages.General}
            />
          </div>
        </div>
      </main>

      {pingForm && (
        <ModalFormDetails setPingFormDetails={setPingFormDetails}>
          <button
            onClick={() => setPingForm(!pingForm)}
            className="text-[13px] underline cursor-pointer"
          >
            cancel
          </button>
        </ModalFormDetails>
      )}
    </div>
  );
};

export default SoundBoard;
