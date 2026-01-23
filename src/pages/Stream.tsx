import SideBar, { type Pages } from "../components/SideBar";
import PageTitleBar from "../components/PageTitleBar";
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { categoryImages } from "../components/CategoryImages";
import NavBar from "../components/NavBar";
import WaveFormModal, {
  type WaveFormDetails,
} from "../components/WaveFormModal";
import PingFormModal from "../components/PingFormModal";
import StreamCard from "../components/Stream/StreamCard";
import { useWavesStore, useSearchStore } from "../stores";
import { useShallow } from "zustand/react/shallow";

const Stream = () => {
  // Zustand stores
  const { waves, isLoading, error, hasNextPage, fetchWaves, fetchNextPage } = useWavesStore(
    useShallow((state) => ({
      waves: state.waves,
      isLoading: state.isLoading,
      error: state.error,
      hasNextPage: state.hasNextPage,
      fetchWaves: state.fetchWaves,
      fetchNextPage: state.fetchNextPage,
    }))
  );

  const { debouncedQuery, selectedCategoryId } = useSearchStore(
    useShallow((state) => ({
      debouncedQuery: state.debouncedQuery,
      selectedCategoryId: state.selectedCategoryId,
    }))
  );

  const [waveForm, setWaveForm] = useState(false);
  const [formSegment, setFormSegment] = useState("wave");

  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState<Pages>({
    streamActive: true,
    historyActive: false,
    soundBoardActive: false,
  });

  // FETCHED (waveFormDetails) FROM SERVER (MAPPED INTO STREAMCARD):
  const [waveFormDetails, setWaveFormDetails] = useState<WaveFormDetails[]>([]);

  // Fetch waves when search/filter changes
  useEffect(() => {
    fetchWaves({
      q: debouncedQuery,
      category: selectedCategoryId || undefined,
      sort: "trending",
      days: 7,
    });
  }, [debouncedQuery, selectedCategoryId, fetchWaves]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  console.log("Waves data:", waves);
  console.log("Waves with hasSurged:", waves.map(w => ({ id: w.id, hasSurged: w.hasSurged })));

  // Filter waves by selected category (client-side filtering)
  const filteredWaves = selectedCategoryId
    ? waves.filter(wave => wave.category?.id === selectedCategoryId || wave.ping?.category?.id === selectedCategoryId)
    : waves;

  return (
    <div className="h-full">
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar />
        </nav>
        <PageTitleBar
          pages={activePage}
          setActivePage={setActivePage}
          heading="Stream"
        >
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
        <SideBar pages={activePage} setActivePage={setActivePage} />
      </aside>
      <main className="mr-2.5 ml-2.5 mt-5 flex flex-col md:mr-[46px] h-[calc(100vh-155px)]  md:ml-[350px]   md:mt-[155px]">
        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F49B31] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading waves...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => fetchWaves({ sort: "trending", days: 7 })}
                className="bg-[#F49B31] hover:bg-[#d88429] text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Waves List */}
        {!isLoading && !error && (
          <div className="flex-1 [scrollbar-width:none] h-full overflow-auto">
            {/* Display API fetched waves */}
            {filteredWaves.map((wave) => {
              // Get wave author name
              const waveAuthorName = wave.author
                ? `${wave.author.firstName} ${wave.author.lastName}`
                : undefined;

              // Get ping author info for the ping card
              const pingAuthorName = wave.ping?.author
                ? `${wave.ping.author.firstName} ${wave.ping.author.lastName}`
                : undefined;

              const pingAuthorId = wave.ping?.author?.id;

              return (
                <div className="mb-[22px]" key={wave.id}>
                  <StreamCard
                    waveId={wave.id.toString()}
                    waveText={wave.solution}
                    waveTitle={wave.ping?.title || "Wave Solution"}
                    image={categoryImages["General"]}
                    category={wave.category?.name}
                    createdAt={formatDate(wave.createdAt)}
                    pingTimeStamp={wave.ping?.createdAt ? formatDate(wave.ping.createdAt) : ""}
                    pingTitle={wave.ping?.title || ""}
                    pingDescription={wave.ping?.content}
                    surgeCount={wave._count?.surges || wave.surgeCount}
                    commentCount={wave._count?.comments || 0}
                    onRefresh={() => fetchWaves({ sort: "trending", days: 7 })}
                    authorName={waveAuthorName}
                    authorId={wave.author?.id}
                    rank={wave.rank}
                    pingAuthorName={pingAuthorName}
                    pingAuthorId={pingAuthorId}
                    hasSurged={wave.hasSurged}
                  />
                </div>
              );
            })}

            {/* Display manually created waves from form */}
            {waveFormDetails.map((details) => (
              <div className="mb-[22px]" key={details.id}>
                <StreamCard
                  waveText={details.solution}
                  waveTitle={details.waveTitle}
                  image={categoryImages[details.cat]}
                  category={details.cat}
                  createdAt={details.createdAt}
                  pingTimeStamp=""
                  pingTitle=""
                />
              </div>
            ))}

            {/* Empty State */}
            {waves.length === 0 && waveFormDetails.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">No waves yet</p>
                  <p className="text-gray-400 text-sm">Be the first to create a wave!</p>
                </div>
              </div>
            )}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center py-6">
                <button
                  onClick={fetchNextPage}
                  className="bg-[#F49B31] hover:bg-[#d88429] text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        )}
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
            setWaveFormDetails={(details) => setWaveFormDetails(details)}
            setWaveForm={() => setWaveForm(!waveForm)}
            onSuccess={() => fetchWaves({ sort: "trending", days: 7 })}
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
