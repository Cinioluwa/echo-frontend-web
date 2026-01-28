import NavBar from "../components/NavBar";
import WaveCard from "../components/WaveHistory/WaveCard";
import SideBar, { type Pages } from "../components/SideBar";
import PageTitleBar from "../components/PageTitleBar";
// import { FaPlus } from "react-icons/fa6";
import { useState, useEffect, useMemo } from "react";
import { useResolutionsStore, useSearchStore } from "../stores";
import { useShallow } from "zustand/react/shallow";
import type { ResolutionLog } from "../api/types";

const WaveHistory = () => {
  // Zustand stores
  const { isLoading, error, fetchResolutions, fetchNextPage, hasNextPage } = useResolutionsStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      error: state.error,
      fetchResolutions: state.fetchResolutions,
      fetchNextPage: state.fetchNextPage,
      hasNextPage: state.hasNextPage,
    }))
  );

  const selectedCategoryId = useSearchStore((state) => state.selectedCategoryId);

  // Get all resolutions from store
  const resolutions = useResolutionsStore((state) => state.resolutions);

  // Group resolutions by date (memoized to prevent infinite loops)
  const groupedResolutions = useMemo(() => {
    // Filter by category if one is selected
    const filtered = selectedCategoryId 
      ? resolutions.filter((r) => r.category?.id === selectedCategoryId)
      : resolutions;

    const groups: { [key: string]: ResolutionLog[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filtered.forEach((resolution) => {
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
        dateLabel = resolutionDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(resolution);
    });

    return groups;
  }, [resolutions, selectedCategoryId]);

  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState({
    streamActive: false,
    historyActive: true,
    soundBoardActive: false,
  } as Pages);

  // Fetch resolutions on mount
  useEffect(() => {
    fetchResolutions({ days: "all" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate total filtered count
  const filteredCount = Object.values(groupedResolutions).flat().length;

  return (
    <div className=" h-full">
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar />
        </nav>
        <PageTitleBar pages={activePage} setActivePage={setActivePage} heading="History" />
      </header>

      <aside className=" hidden md:block [scrollbar-width:none] pb-[23px] overflow-y-auto   px-10 fixed h-[calc(100vh-155px)] w-[350px] left-0 bottom-0 whitespace-nowrap ">
        <SideBar pages={activePage} setActivePage={setActivePage} />
      </aside>

      <main className=" mr-2.5 ml-2.5 mt-5 md:mr-[46px] h-[calc(100vh-155px)]   md:ml-[350px] md:mt-[155px]">
        {/* Loading State */}
        {isLoading && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F49B31] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading resolution history...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => fetchResolutions({ days: "all" })}
                className="bg-[#F49B31] hover:bg-[#d88429] text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Resolutions List */}
        {!isLoading && !error && (
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
            {filteredCount === 0 && (
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
    </div>
  );
};

export default WaveHistory;
