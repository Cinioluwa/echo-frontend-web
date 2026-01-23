const soundBoardImage = "/assets/images/SoundBoardImage.svg";
import SoundBoardCard from "../components/SoundBoard/SoundBoardCard";
import SideBar, { type Pages } from "../components/SideBar";
import PageTitleBar from "../components/PageTitleBar";

import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";

import { categoryImages } from "../components/CategoryImages";
import NavBar from "../components/NavBar";
import ProposeWaveModal from "../components/ProposeWaveModal";

import type { PingFormDetails } from "../components/PingFormModal";
import PingFormModal from "../components/PingFormModal";
import { publicService, searchService } from "../api/services";
import type { Ping } from "../api/types";
import { useCategoryFilter } from "../contexts/CategoryFilterContext";

const SoundBoard = () => {
  const { selectedCategoryId, setCategoryCounts } = useCategoryFilter();
  const [pingForm, setPingForm] = useState(false);
  const [formSegment, setFormSegment] = useState("ping");

  // SETTING ACTIVE PAGE BUTTON
  const [activePage, setActivePage] = useState({
    streamActive: false,
    historyActive: false,
    soundBoardActive: true,
  } as Pages);

  // API STATE
  const [pings, setPings] = useState<Ping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  //SIMULATING FETCHED DATA FROM SERVER (MAPPED INTO SOUNDBOARD-CARD, Simulated with PingFormModal module.):
  const [pingFormDetails, setPingFormDetails] = useState<PingFormDetails[]>([]);

  const [proposedPingDetails, setProposedPingDetails] =
    useState<PingFormDetails | null>(null);

  const [proposeWaveModal, setProposeWaveModal] = useState(false);
  const [proposeActive, setProposeActive] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // FETCH PINGS FROM API
  useEffect(() => {
    const fetchPings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response;
        if (debouncedSearchQuery || selectedCategoryId) {
          // Use search service if there's a search query or category filter
          response = await searchService.searchSoundboard({
            q: debouncedSearchQuery,
            category: selectedCategoryId || undefined,
            page: currentPage,
            limit: 20,
            sort: "trending"
          });
        } else {
          // Use regular soundboard endpoint
          response = await publicService.getSoundboard({
            page: currentPage,
            limit: 20,
            sort: "trending",
          });
        }

        console.log("🔍 Raw API Response (Pings):", response);
        console.log("📌 Ping data from API:", response.data);
        console.log("📊 Sample ping (first item):", response.data[0]);

        setPings(response.data);
        setTotalPages(response.pagination.totalPages || 1);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch pings");
        console.error("Error fetching pings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPings();
  }, [currentPage, debouncedSearchQuery, selectedCategoryId]);

  // Filter pings by selected category (client-side filtering)
  const filteredPings = selectedCategoryId
    ? pings.filter(ping => ping.category?.id === selectedCategoryId)
    : pings;

  // Calculate category counts
  useEffect(() => {
    const counts: Record<number, number> = {};
    pings.forEach((ping) => {
      const categoryId = ping.category?.id;
      if (categoryId) {
        counts[categoryId] = (counts[categoryId] || 0) + 1;
      }
    });
    setCategoryCounts(counts, pings.length);
  }, [pings, setCategoryCounts]);

  // REFRESH PINGS AFTER CREATING NEW PING
  const handlePingCreated = async () => {
    try {
      const response = await publicService.getSoundboard({
        page: currentPage,
        limit: 20,
        sort: "trending",
      });
      setPings(response.data);
      setTotalPages(response.pagination.totalPages || 1);
    } catch (err) {
      console.error("Error refreshing pings:", err);
    }
  };

  // Debug: Log pings data to check hasSurged field
  useEffect(() => {
    console.log("Pings data:", pings);
    console.log("Pings with hasSurged:", pings.map(p => ({ id: p.id, title: p.title, hasSurged: p.hasSurged })));
  }, [pings]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  // SEARCH FOR WHICH PING WAS PROPOSED
  function handleWaveProposal(id: string) {
    const proposedPing = pingFormDetails.find((details) => details.id === id);

    // Try to find from API pings first (convert id to number for comparison)
    const apiPing = pings.find((ping) => ping.id.toString() === id);

    if (apiPing) {
      // Use API ping data
      setProposedPingDetails({
        id: apiPing.id.toString(),
        pingTitle: apiPing.title,
        pingDesc: apiPing.content,
        cat: apiPing.category?.name || "General",
        catId: apiPing.category?.id || 1,
        hashtag: apiPing.hashtag || "",
        createdAt: new Date(apiPing.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        anonymous: false,
        formSegment: "ping",
      });
    } else if (proposedPing) {
      // Fallback to local ping
      setProposedPingDetails({ ...proposedPing });
    }

    setProposeWaveModal(!proposeWaveModal);
  }

  return (
    <div className="h-full">
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar onSearch={handleSearch} />
        </nav>
        <PageTitleBar pages={activePage} setActivePage={setActivePage} heading="Sound Board">
          <button
            onClick={() => {
              setPingForm(!pingForm);
              setFormSegment("ping");
            }}
            className="flex cursor-pointer justify-center text-[13px] items-center gap-[7px] text-white transition-colors ease-in-out duration-300 rounded-[40px] hover:bg-[#d88429]
 bg-[#F49B31] py-2.5 px-[15px] text-center"
          >
            <FaPlus fontSize={20} />
            Create a ping
          </button>
        </PageTitleBar>
      </header>
      <aside className="hidden md:block [scrollbar-width:none]  overflow-y-auto   px-10 fixed h-[calc(100vh-155px)] w-[350px] left-0 bottom-0 whitespace-nowrap ">
        <SideBar pages={activePage} setActivePage={setActivePage} />
      </aside>
      <main className="mr-2.5 ml-2.5 mt-5 flex flex-col md:mr-[46px] h-[calc(100vh-155px)]  md:ml-[350px]   md:mt-[155px]">
        <div className="mb-[25px]">
          <img src={soundBoardImage} alt="" className=" max-h-[200px] w-full" />
        </div>

        {/* MAP PINGFORM DETAILS INTO SOUNDBOARD CARDS */}
        <div className="flex-1 [scrollbar-width:none] h-full overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Loading pings...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredPings.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">No pings available</p>
            </div>
          ) : (
            <>
              {/* DISPLAY API PINGS */}
              {filteredPings.map((ping) => {
                const categoryName = ping.category?.name || "General";
                const authorName = ping.author
                  ? `${ping.author.firstName} ${ping.author.lastName}`
                  : undefined;
                return (
                  <div className="mb-[22px]" key={ping.id}>
                    <SoundBoardCard
                      pingText={ping.content}
                      pingTitle={ping.title}
                      image={categoryImages[categoryName] || categoryImages.General}
                      category={categoryName}
                      hashtag={ping.hashtag || ""}
                      timeStamp={new Date(ping.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      id={ping.id.toString()}
                      onPropose={(id) => handleWaveProposal(id)}
                      proposeActive={proposeActive}
                      surgeCount={ping.surgeCount}
                      commentCount={ping._count?.comments || 0}
                      authorName={authorName}
                      onRefresh={handlePingCreated}
                      hasSurged={ping.hasSurged}
                    />
                  </div>
                );
              })}

              {/* DISPLAY LOCAL PING FORM DETAILS (NEWLY CREATED) */}
              {pingFormDetails.map((details) => (
                <div className="mb-[22px]" key={details.id}>
                  <SoundBoardCard
                    pingText={details.pingDesc}
                    pingTitle={details.pingTitle}
                    image={categoryImages[details.cat]}
                    category={details.cat}
                    hashtag={details.hashtag}
                    timeStamp={details.createdAt}
                    id={details.id}
                    onPropose={(id) => handleWaveProposal(id)}
                    proposeActive={proposeActive}
                  />
                </div>
              ))}

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 my-6">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-[#F49B31] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d88429] transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-[#F49B31] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d88429] transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {formSegment === "ping" && (
        <div className={`${pingForm ? "" : "hidden"}`}>
          <PingFormModal
            formSegment={formSegment}
            setFormSegment={() => setFormSegment("wave")}
            setPingForm={() => setPingForm(!pingForm)}
            setPingFormDetails={(details) => setPingFormDetails(details)}
            onPingCreated={handlePingCreated}
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
          {/* Wave form commented out - not integrated yet */}
        </div>
      )}

      {proposeWaveModal && (
        <ProposeWaveModal
          onClose={() => setProposeWaveModal(!proposeWaveModal)}
          pingTimeStamp={proposedPingDetails?.createdAt}
          pingTitle={proposedPingDetails?.pingTitle}
          pingId={proposedPingDetails?.id}
          setProposeActive={setProposeActive}
          onWaveCreated={handlePingCreated}
        />
      )}
    </div>
  );
};

export default SoundBoard;
