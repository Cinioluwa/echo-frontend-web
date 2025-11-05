import NavBar from "./NavBar";
import PageTitleBar from "./PageTitleBar";
import WaveCard from "./WaveCard";
import WaveHistorySidebar from "./WaveHistorySidebar";

const WaveHistory = () => {
  return (
    <div className=" h-screen ">
      <header className="z-20 fixed top-0 w-full">
        <nav>
          <NavBar />
        </nav>
        <PageTitleBar heading="Wave History" />
      </header>

      <aside className=" pb-[23px]  px-10 fixed h-[calc(100vh-155px)] w-[350px] left-0 bottom-0 whitespace-nowrap ">
        <WaveHistorySidebar />
      </aside>

      <main className="mr-[46px] ml-[350px] mt-[145px]">
        <div>
          <h2 className=" my-[22px] text-[25px] font-semibold">Yesterday</h2>
          <WaveCard
            waveText=""
            waveTitle="Increase Wi-Fi Coverage and Speed on Campus"
          />
        </div>
        <div>
          <h2 className=" my-[22px] text-[25px] font-semibold">25th May 2025</h2>
          <WaveCard waveText="" waveTitle="" />
        </div>
        <div>
          <h2 className=" my-[22px] text-[25px] font-semibold">25th May 2025</h2>
          <WaveCard waveText="" waveTitle="" />
        </div>
        <div>
          <h2 className=" my-[22px] text-[25px] font-semibold">25th May 2025</h2>
          <WaveCard waveText="" waveTitle="" />
        </div>
        <div>
          <h2 className=" my-[22px] text-[25px] font-semibold">25th May 2025</h2>
          <WaveCard waveText="" waveTitle="" />
        </div>
      </main>
    </div>
  );
};

export default WaveHistory;
