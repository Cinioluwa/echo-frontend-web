import NavBar from "../components/NavBar";
import WaveCard from "../components/WaveHistory/WaveCard";
import SideBar, { type Pages } from "../components/SideBar";
import PageTitleBar from "../components/PageTitleBar";
// import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { publicService } from "../api/services";
import type { ResolutionLog } from "../api/types";
import { useCategoryFilter } from "../contexts/CategoryFilterContext";

const WaveHistory = () => {
  const { selectedCategoryId, setCategoryCounts } = useCategoryFilter();
  // API Integration States - using ResolutionLog for resolved pings
  const [resolutions, setResolutions] = useState<ResolutionLog[]>([]);
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

  // Fetch resolution log from API
  useEffect(() => {
    fetchResolutions();
  }, [currentPage, debouncedSearchQuery, selectedCategoryId]);

  const fetchResolutions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Note: Resolution log endpoint doesn't support text search or category filters yet
      // Only using pagination and days filter
      const response = await publicService.getResolutionLog({
        page: currentPage,
        limit: 20,
        days: "all"
      });

      console.log("🔍 Raw API Response (Resolution Log):", response);
      console.log("📜 Resolution data from API:", response.data);

      setResolutions(response.data);
      setHasNextPage(response.pagination.hasNextPage || false);
    } catch (err: any) {
      console.error("Error fetching resolution log:", err);
      setError(err.response?.data?.error || "Failed to load resolution history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Group resolutions by date
  // Filter resolutions by selected category (client-side filtering)
  const filteredResolutions = selectedCategoryId
    ? resolutions.filter(resolution => resolution.category?.id === selectedCategoryId)
    : resolutions;

  // Calculate category counts
  useEffect(() => {
    const counts: Record<number, number> = {};
    resolutions.forEach((resolution) => {
      const categoryId = resolution.category?.id;
      if (categoryId) {
        counts[categoryId] = (counts[categoryId] || 0) + 1;
      }
    });
    setCategoryCounts(counts, resolutions.length);
  }, [resolutions, setCategoryCounts]);

  const groupResolutionsByDate = (resolutions: ResolutionLog[]) => {
    const groups: { [key: string]: ResolutionLog[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    resolutions.forEach((resolution) => {
      const resolutionDate = new Date(resolution.resolvedAt);
      resolutionDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - resolutionDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let dateLabel: string;
      if (diffDays === 0) {
        dateLabel = "Today";
      } else if (diffDays === 1) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = resolutionDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(resolution);
    });

    return groups;
  };

  const groupedResolutions = groupResolutionsByDate(filteredResolutions);

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
              <p className="mt-4 text-gray-600">Loading resolution history...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchResolutions}
                className="bg-[#F49B31] hover:bg-[#d88429] text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Resolutions List */}
        {!loading && !error && (
          <div className=" h-full overflow-auto [scrollbar-width:none]">
            {Object.entries(groupedResolutions).map(([dateLabel, dateResolutions]) => (
              <div key={dateLabel} className="mb-[22px] flex md:block flex-col items-center ">
                <h2 className="md:mb-[22px] text-[25px] font-semibold">{dateLabel}</h2>
                {dateResolutions.map((resolution) => (
                  <WaveCard
                    key={resolution.id}
                    resolution={resolution}
                  />
                ))}
              </div>
            ))}

            {/* Empty State */}
            {filteredResolutions.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">No resolved issues yet</p>
                  <p className="text-gray-400 text-sm">Resolved pings will appear here!</p>
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
