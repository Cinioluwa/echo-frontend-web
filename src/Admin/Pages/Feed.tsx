import { useState, useEffect } from "react";
import PingFormModal from "../../components/PingFormModal";
import WaveFormModal from "../../components/WaveFormModal";
import AdminLayout from "../Components/AdminLayout";
import AdminWaveCard from "../Components/AdminWaveCard";
import AdminPingCard from "../Components/AdminPingCard";
import { adminService } from "../../api";
import type { AdminPing, AdminWave } from "../../api/types/admin.types";

const Feed = () => {
  const [waveForm, setWaveForm] = useState(false);
  const [formSegment, setFormSegment] = useState("ping");

  // Active page state
  const [activePage, setActivePage] = useState({
    feedActive: true,
    overviewActive: false,
    followUpActive: false,
  });

  // Filter state
  const [activePosts, setActivePosts] = useState({
    all: true,
    waves: false,
    pings: false,
  });

  // Data state
  const [pings, setPings] = useState<AdminPing[]>([]);
  const [waves, setWaves] = useState<AdminWave[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activePosts, currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activePosts.all) {
        // Fetch both pings and waves
        const [pingsData, wavesData] = await Promise.all([
          adminService.getPings({ page: currentPage, limit: 20 }),
          adminService.getWaves({ page: currentPage, limit: 20 }),
        ]);

        setPings(pingsData.data);
        setWaves(wavesData.data);
        setHasMore(
          (pingsData.pagination.hasNextPage ?? false) || (wavesData.pagination.hasNextPage ?? false)
        );
      } else if (activePosts.waves) {
        // Fetch only waves
        const wavesData = await adminService.getWaves({
          page: currentPage,
          limit: 20,
        });
        setWaves(wavesData.data);
        setPings([]);
        setHasMore(wavesData.pagination.hasNextPage ?? false);
      } else if (activePosts.pings) {
        // Fetch only pings
        const pingsData = await adminService.getPings({
          page: currentPage,
          limit: 20,
        });
        setPings(pingsData.data);
        setWaves([]);
        setHasMore(pingsData.pagination.hasNextPage ?? false);
      }
    } catch (err: any) {
      console.error('Failed to fetch feed data:', err);
      setError(err.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: 'all' | 'waves' | 'pings') => {
    setActivePosts({
      all: filter === 'all',
      waves: filter === 'waves',
      pings: filter === 'pings',
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Merge and sort pings and waves by createdAt for "All" view
  const getMergedFeed = () => {
    if (!activePosts.all) return [];

    const combined = [
      ...pings.map(p => ({ type: 'ping' as const, data: p, createdAt: p.createdAt })),
      ...waves.map(w => ({ type: 'wave' as const, data: w, createdAt: w.createdAt })),
    ];

    return combined.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  return (
    <div className="h-full">
      <AdminLayout
        heading="Admin Feed"
        setFormSegment={setFormSegment}
        setForm={setWaveForm}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className=" mr-2.5 ml-2.5 mt-5 md:mr-[46px] h-[calc(100vh-155px)]   md:ml-[350px] md:mt-[155px]">
        <div className="h-full overflow-auto [scrollbar-width:none]">
          {/* Filter buttons */}
          <div className="flex gap-[15px] mb-4">
            <FilterButton
              label="All"
              active={activePosts.all}
              onClick={() => handleFilterChange('all')}
            />
            <FilterButton
              label="Waves"
              active={activePosts.waves}
              onClick={() => handleFilterChange('waves')}
            />
            <FilterButton
              label="Pings"
              active={activePosts.pings}
              onClick={() => handleFilterChange('pings')}
            />
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mb-4">
              {error}
              <button
                onClick={fetchData}
                className="ml-4 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F49B31]"></div>
            </div>
          )}

          {/* Feed content */}
          {!loading && (
            <div className="flex md:block flex-col items-center">
              {activePosts.all &&
                getMergedFeed().map((item, index) => (
                  <div key={`${item.type}-${item.data.id}-${index}`} className="mb-[22px]">
                    {item.type === 'wave' ? (
                      <AdminWaveCard waves={item.data as AdminWave} onUpdate={fetchData} />
                    ) : (
                      <AdminPingCard pings={item.data as AdminPing} onUpdate={fetchData} />
                    )}
                  </div>
                ))}

              {activePosts.waves &&
                waves.map((wave) => (
                  <div key={wave.id} className="mb-[22px]">
                    <AdminWaveCard waves={wave} onUpdate={fetchData} />
                  </div>
                ))}

              {activePosts.pings &&
                pings.map((ping) => (
                  <div key={ping.id} className="mb-[22px]">
                    <AdminPingCard pings={ping} onUpdate={fetchData} />
                  </div>
                ))}

              {/* Empty state */}
              {!loading && pings.length === 0 && waves.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No {activePosts.waves ? 'waves' : activePosts.pings ? 'pings' : 'posts'} found
                </div>
              )}

              {/* Load more button */}
              {hasMore && !loading && (pings.length > 0 || waves.length > 0) && (
                <div className="flex justify-center mt-6 mb-6">
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="bg-[#F49B31] text-white px-6 py-3 rounded-lg hover:bg-[#d88429] transition"
                  >
                    Load More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
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
            setWaveForm={() => setWaveForm(!waveForm)}
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

// Helper component
const FilterButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`${active ? "text-white bg-[#F49B31]" : "bg-[#FFC37B]"
      } p-4 rounded-[18px] w-[100px] flex items-center cursor-pointer justify-center border border-[#7B7B79] h-10`}
  >
    {label}
  </div>
);

export default Feed;
