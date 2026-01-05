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
import { publicService, searchService } from "../api/services";
import type { Wave } from "../api/types";

const Stream = () => {
  const [waveForm, setWaveForm] = useState(false);
  const [formSegment, setFormSegment] = useState("wave");

  // API Integration States
  const [waves, setWaves] = useState<Wave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState<Pages>({
    streamActive: true,
    historyActive: false,
    soundBoardActive: false,
  });

  // FETCHED (waveFormDetails) FROM SERVER (MAPPED INTO STREAMCARD):
  const [waveFormDetails, setWaveFormDetails] = useState<WaveFormDetails[]>([]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch waves from API
  useEffect(() => {
    fetchWaves();
  }, [currentPage, debouncedSearchQuery]);

  const fetchWaves = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (debouncedSearchQuery) {
        // Use search service if there's a search query
        response = await searchService.searchStream({
          q: debouncedSearchQuery,
          page: currentPage,
          limit: 20,
          sort: "trending"
        });
      } else {
        // Use regular stream endpoint
        response = await publicService.getStream({
          page: currentPage,
          limit: 20,
          sort: "trending",
          days: 7
        });
      }

      setWaves(response.data);
      setHasNextPage(response.pagination.hasNextPage || false);
    } catch (err: any) {
      console.error("Error fetching waves:", err);
      setError(err.response?.data?.error || "Failed to load waves. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

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

  return (
    <div className="h-full">
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar onSearch={handleSearch} />
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
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F49B31] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading waves...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchWaves}
                className="bg-[#F49B31] hover:bg-[#d88429] text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Waves List */}
        {!loading && !error && (
          <div className="flex-1 [scrollbar-width:none] h-full overflow-auto">
            {/* Display API fetched waves */}
            {waves.map((wave) => {
              // Get author name - handle both object and string types
              const authorName = typeof wave.author === 'object' && wave.author
                ? `${wave.author.firstName} ${wave.author.lastName}`
                : wave.ping?.author
                  ? `${wave.ping.author.firstName} ${wave.ping.author.lastName}`
                  : undefined;

              const authorId = typeof wave.author === 'object' && wave.author
                ? wave.author.id
                : undefined;

              return (
                <div className="mb-[22px]" key={wave.id}>
                  <StreamCard
                    waveId={wave.id.toString()}
                    waveText={wave.solution}
                    waveTitle={wave.ping?.title || "Wave Solution"}
                    image={categoryImages["General"]}
                    category="General"
                    createdAt={formatDate(wave.createdAt)}
                    pingTimeStamp=""
                    pingTitle={wave.ping?.title || ""}
                    surgeCount={wave._count?.surges || wave.surgeCount}
                    commentCount={wave._count?.comments || 0}
                    onRefresh={fetchWaves}
                    authorName={authorName}
                    authorId={authorId}
                    rank={wave.rank}
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
                  onClick={() => setCurrentPage(prev => prev + 1)}
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
            onSuccess={fetchWaves}
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
