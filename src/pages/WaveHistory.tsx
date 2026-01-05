import NavBar from "../components/NavBar";
import WaveCard from "../components/WaveHistory/WaveCard";
import SideBar, { type Pages } from "../components/SideBar";
import PageTitleBar from "../components/PageTitleBar";
// import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { publicService, searchService } from "../api/services";
import type { Wave } from "../api/types";

const WaveHistory = () => {
  // API Integration States
  const [waves, setWaves] = useState<Wave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState({
    streamActive: false,
    historyActive: true,
    soundBoardActive: false,
  } as Pages);

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
          sort: "new"
        });
      } else {
        // Use regular stream endpoint
        response = await publicService.getStream({
          page: currentPage,
          limit: 20,
          sort: "new",
          days: "all"
        });
      }

      setWaves(response.data);
      setHasNextPage(response.pagination.hasNextPage || false);
    } catch (err: any) {
      console.error("Error fetching wave history:", err);
      setError(err.response?.data?.error || "Failed to load wave history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Group waves by date
  const groupWavesByDate = (waves: Wave[]) => {
    const groups: { [key: string]: Wave[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    waves.forEach((wave) => {
      const waveDate = new Date(wave.createdAt);
      waveDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - waveDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let dateLabel: string;
      if (diffDays === 0) {
        dateLabel = "Today";
      } else if (diffDays === 1) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = waveDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(wave);
    });

    return groups;
  };

  const groupedWaves = groupWavesByDate(waves);

  return (
    <div className=" h-full">
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar onSearch={handleSearch} />
        </nav>
        <PageTitleBar pages={activePage} setActivePage={setActivePage} heading="History" />
      </header>

      <aside className=" hidden md:block [scrollbar-width:none] pb-[23px] overflow-y-auto   px-10 fixed h-[calc(100vh-155px)] w-[350px] left-0 bottom-0 whitespace-nowrap ">
        <SideBar pages={activePage} setActivePage={setActivePage} />
      </aside>

      <main className=" mr-2.5 ml-2.5 mt-5 md:mr-[46px] h-[calc(100vh-155px)]   md:ml-[350px] md:mt-[155px]">
        {/* Loading State */}
        {loading && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F49B31] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading wave history...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="h-full flex items-center justify-center">
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
          <div className=" h-full overflow-auto [scrollbar-width:none]">
            {Object.entries(groupedWaves).map(([dateLabel, dateWaves]) => (
              <div key={dateLabel} className="mb-[22px] flex md:block flex-col items-center">
                <h2 className="md:mb-[22px] text-[25px] font-semibold">{dateLabel}</h2>
                {dateWaves.map((wave) => (
                  <WaveCard
                    key={wave.id}
                    wave={wave}
                  />
                ))}
              </div>
            ))}

            {/* Empty State */}
            {waves.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">No waves yet</p>
                  <p className="text-gray-400 text-sm">Check back later for wave history!</p>
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
    </div>
  );
};

export default WaveHistory;
