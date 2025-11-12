import NavBar from "../components/NavBar";
import soundBoardImage from "../assets/images/SoundBoardImage.svg";
import SoundBoardCard from "../components/SoundBoard/SoundBoardCard";

import SideBar from "../components/SideBar";
import PageTitleBar from "../components/PageTitleBar";

const SoundBoard = () => {
  return (
    <div className="h-full ">
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar />
        </nav>
        <PageTitleBar heading="Sound Board" />
      </header>

      <aside className="hidden md:block [scrollbar-width:none] pb-[23px] overflow-y-auto   px-10 fixed h-[calc(100vh-155px)] w-[350px] left-0 bottom-0 whitespace-nowrap ">
        <SideBar />
      </aside>

      <main className="mr-2.5 ml-2.5 mt-5 flex flex-col md:mr-[46px] h-[calc(100vh-155px)]  md:ml-[350px]   md:mt-[155px]">
        <div className="mb-[25px]">
          <img src={soundBoardImage} alt="" className=" max-h-[200px] w-full" />
        </div>

        <div className=" flex-1 [scrollbar-width:none] h-full overflow-auto">
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment.
            "
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
            />
          </div>
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="The current library facilities are outdated and insufficient to meet the needs of the growing student population. Many students find it challenging to locate necessary resources, and the study areas are often overcrowded. Upgrading the library facilities — including expanding the collection of books and digital resources, increasing seating capacity, and enhancing the study environment — will greatly benefit students and support their academic success.
            "
              pingTitle="Upgrade Library Facilities and Resources
            "
            />
          </div>
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
            />
          </div>
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              pingTitle="Increase Wi-Fi Coverage and Speed on Campus"
            />
          </div>
          <div className="mb-[22px]">
            <SoundBoardCard
              pingText="The current library facilities are outdated and insufficient to meet the needs of the growing student population. Many students find it challenging to locate necessary resources, and the study areas are often overcrowded. Upgrading the library facilities — including expanding the collection of books and digital resources, increasing seating capacity, and enhancing the study environment — will greatly benefit students and support their academic success."
              pingTitle="Upgrade Library Facilities and Resources"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SoundBoard;
