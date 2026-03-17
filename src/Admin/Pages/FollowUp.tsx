import { useState, useEffect } from "react";
import AdminLayout from "../Components/AdminLayout";
import PingFormModal from "../../components/PingFormModal";
import WaveFormModal from "../../components/WaveFormModal";
import AdminWaveCard from "../Components/AdminWaveCard";
import { adminService } from "../../api";
import type { AdminWave } from "../../api/types/admin.types";

const FollowUp = () => {
  const [waveForm, setWaveForm] = useState(false);
  const [formSegment, setFormSegment] = useState("ping");

  const [activePage, setActivePage] = useState({
    feedActive: false,
    overviewActive: false,
    followUpActive: true,
  });

  const [activePosts, setActivePosts] = useState({
    underReview: true,
    approved: false,
    rejected: false,
    resolved: false,
  });

  const [waves, setWaves] = useState<AdminWave[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchWaves();
  }, [activePosts, currentPage]);

  const fetchWaves = async () => {
    try {
      setLoading(true);
      setError(null);

      let status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

      if (activePosts.underReview) {
        status = 'UNDER_REVIEW';
      } else if (activePosts.approved) {
        status = 'APPROVED';
      } else {
        status = 'REJECTED';
      }

      const wavesData = await adminService.getWaves({
        status,
        page: currentPage,
        limit: 20,
      });

      setWaves(wavesData.data);
      setHasMore(wavesData.pagination.hasNextPage ?? false);
    } catch (err: any) {
      console.error('Failed to fetch waves:', err);
      setError(err.message || 'Failed to load waves');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: 'underReview' | 'approved' | 'rejected' | 'resolved') => {
    setActivePosts({
      underReview: status === 'underReview',
      approved: status === 'approved',
      rejected: status === 'rejected',
      resolved: status === 'resolved',
    });
    setCurrentPage(1);
  };

  return (
    <div className="overflow-hidden">
      <AdminLayout
        heading="Follow Up"
        setFormSegment={setFormSegment}
        setForm={setWaveForm}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className=" mr-2.5 ml-2.5 mt-5 md:mr-[46px] h-[calc(100vh-155px)] md:ml-[350px] md:mt-[155px]">
        <div className=" h-full overflow-auto [scrollbar-width:none]">
          {/* Status filter buttons */}
          <div className="flex whitespace-nowrap gap-[15px] mb-4">
            <StatusButton
              label="Under Review"
              active={activePosts.underReview}
              onClick={() => handleStatusChange('underReview')}
            />
            <StatusButton
              label="Approved"
              active={activePosts.approved}
              onClick={() => handleStatusChange('approved')}
            />
            <StatusButton
              label="Rejected"
              active={activePosts.rejected}
              onClick={() => handleStatusChange('rejected')}
            />
            <StatusButton
              label="Resolved"
              active={activePosts.resolved}
              onClick={() => handleStatusChange('resolved')}
            />
          </div>

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 mb-4">
              {error}
              <button
                onClick={fetchWaves}
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

          {/* Waves list */}
          {!loading && (
            <div className="flex md:block flex-col items-center">
              {waves.map((wave) => (
                <div key={wave.id} className="mb-[22px]">
                  <AdminWaveCard
                    waves={wave}
                    onUpdate={fetchWaves}
                  />
                </div>
              ))}

              {/* Empty state */}
              {waves.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No waves {activePosts.underReview ? 'under review' : activePosts.approved ? 'approved' : 'rejected'}
                </div>
              )}

              {/* Load more */}
              {hasMore && !loading && waves.length > 0 && (
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

const StatusButton = ({
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
      } p-4 rounded-[18px] w-full max-w-[200px] flex items-center cursor-pointer justify-center border border-[#7B7B79] font-semibold h-10`}
  >
    {label}
  </div>
);

export default FollowUp;
