import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminPostDetailsLayout from "./AdminPostDetailsLayout";
// import WavePostDetailFeed from "./WavePostDetailFeed";
import PingPostDetailFeed from "./PingPostDetailFeed";
import PostChartAnalysis from "./PostChartAnalysis";
import { pingService } from "../../api";
import type { AdminPing } from "../../api/types/admin.types";

const PostDetails = () => {
  const navigate = useNavigate();
  const { pingId } = useParams<{ pingId: string }>();
  const [pingData, setPingData] = useState<AdminPing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activePage, setActivePage] = useState({
    feedActive: true,
    overviewActive: false,
    followUpActive: false,
  });

  useEffect(() => {
    if (!pingId) {
      navigate("/admin/feed", { replace: true });
      return;
    }

    const fetchPingData = async () => {
      try {
        setLoading(true);
        const data = await pingService.getPingById(pingId);

        // Transform Ping response to AdminPing format
        // API returns comments/waves/surges as arrays, but AdminPingCard expects _count
        const adminPing: AdminPing = {
          ...(data as any),
          _count: {
            waves: (data.waves || []).length,
            comments: data.comments ? (data.comments || []).length : 0,
            surges: data.surges ? (data.surges || []).length : 0,
          }
        };

        setPingData(adminPing);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch ping:", err);
        setError(err.message || "Failed to load ping details");
      } finally {
        setLoading(false);
      }
    };

    fetchPingData();
  }, [pingId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-gray-500">Loading ping details...</p>
      </div>
    );
  }

  if (error || !pingData) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-red-500">{error || "Failed to load ping details"}</p>
      </div>
    );
  }

  return (
    <div className="overflow-scroll">
      <AdminPostDetailsLayout
        heading="More details"
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className=" mr-2.5 ml-2.5 mt-5 md:mr-[46px] h-[calc(100vh-155px)] md:ml-[350px] md:mt-[155px] ">
        <div className="overflow-scroll relative">
          <div className="bg-white rounded-[10px] xl:px-10 py-4 pb-30 overflow-scroll ">
            <PostChartAnalysis />
          </div>
        </div>

        {/* CHOOSE WHETHER TO DISPLAY WAVE OR PING DETAILS FEED BASED ON ADMIN SELECTION*/}
        <div className="mt-10 pb-10">
          {/* <WavePostDetailFeed waves={proposedWaveDetails} /> */}

          <PingPostDetailFeed pings={pingData} />
        </div>
      </main>

    </div>
  );
};

export default PostDetails;
