import NavBar from "../components/NavBar";
import WaveCard from "../components/WaveHistory/WaveCard";
import SideBar, { type Pages } from "../components/SideBar";
import PageTitleBar from "../components/PageTitleBar";
// import { FaPlus } from "react-icons/fa6";
import { useState } from "react";

const WaveHistory = () => {
  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState({
    streamActive: false,
    historyActive: true,
    soundBoardActive: false,
  } as Pages);

  return (
    <div className=" h-full">
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar />
        </nav>
        <PageTitleBar heading="History" />
      </header>

      <aside className=" hidden md:block [scrollbar-width:none] pb-[23px] overflow-y-auto   px-10 fixed h-[calc(100vh-155px)] w-[350px] left-0 bottom-0 whitespace-nowrap ">
        <SideBar pages={activePage} setActivePage={setActivePage} />
      </aside>

      <main className=" mr-2.5 ml-2.5 mt-5 md:mr-[46px] h-[calc(100vh-155px)]   md:ml-[350px] md:mt-[155px]">
        <div className=" h-full overflow-auto [scrollbar-width:none]">
          <div className="mb-[22px]">
            <h2 className=" mb-[22px] text-[25px] font-semibold">Yesterday</h2>
            <WaveCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment.
            "
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
            />
          </div>
          <div className="mb-[22px]">
            <h2 className=" mb-[22px] text-[25px] font-semibold">
              25th May 2025
            </h2>
            <WaveCard
              waveText="The current library facilities are outdated and insufficient to meet the needs of the growing student population. Many students find it challenging to locate necessary resources, and the study areas are often overcrowded. Upgrading the library facilities — including expanding the collection of books and digital resources, increasing seating capacity, and enhancing the study environment — will greatly benefit students and support their academic success.
            "
              waveTitle="Upgrade Library Facilities and Resources
            "
            />
          </div>
          <div className="mb-[22px]">
            <h2 className=" mb-[22px] text-[25px] font-semibold">
              25th May 2025
            </h2>
            <WaveCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
            />
          </div>
          <div className="mb-[22px]">
            <h2 className="mb-[22px]  text-[25px] font-semibold">
              25th May 2025
            </h2>
            <WaveCard
              waveText="Many students struggle with poor Wi-Fi connectivity in certain areas of the campus, which hinders their ability to access online resources, complete assignments, and participate in online discussions. By improving Wi-Fi coverage and speed throughout the campus, we can ensure that all students have reliable internet access, fostering a more productive and connected learning environment."
              waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
            />
          </div>
          <div className="mb-[22px]">
            <h2 className="mb-[22px] text-[25px] font-semibold">
              25th May 2025
            </h2>
            <WaveCard
              waveText="The current library facilities are outdated and insufficient to meet the needs of the growing student population. Many students find it challenging to locate necessary resources, and the study areas are often overcrowded. Upgrading the library facilities — including expanding the collection of books and digital resources, increasing seating capacity, and enhancing the study environment — will greatly benefit students and support their academic success."
              waveTitle="Upgrade Library Facilities and Resources"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaveHistory;
