import { useEffect, useState } from "react";
import { adminService, analyticsService } from "../../api";
import type { PlatformStats } from "../../api/types/admin.types";

const arrowRise = "/assets/images/ArrowRise.svg";
const arrowDrop = "/assets/images/arrowdrop.svg";

const PlatformMetrics = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    waves: { count: 0, change: 0 },
    pings: { count: 0, change: 0 },
    wavesUnderReview: { count: 0, change: 0 },
    activeUsers: { count: 0, change: 0 },
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);

      // Fetch platform stats
      const statsData = await adminService.getStats();
      setStats(statsData);

      // Fetch waves under review count
      const wavesUnderReview = await adminService.getWaves({
        status: 'UNDER_REVIEW',
        limit: 1,
      });

      // Fetch active users
      const activeUsers = await analyticsService.getActiveUsers({
        weeks: 1,
      });

      // Fetch trending data for percentage changes
      const trending = await analyticsService.getTrending({
        weeks: 1,
      });

      // Calculate percentage changes from trending data
      // Note: This is simplified - you may need to adjust based on actual data structure
      const wavesChange = calculatePercentageChange(
        statsData.totalWaves,
        trending.data
      );
      const pingsChange = calculatePercentageChange(
        statsData.totalPings,
        trending.data
      );

      setMetrics({
        waves: {
          count: statsData.totalWaves,
          change: wavesChange,
        },
        pings: {
          count: statsData.totalPings,
          change: pingsChange,
        },
        wavesUnderReview: {
          count: wavesUnderReview.pagination.totalWaves || 0,
          change: 15.03, // Could calculate from historical data
        },
        activeUsers: {
          count: activeUsers.activeUsers,
          change: 6.0, // Could calculate from previous period
        },
      });

      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch metrics:', err);
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentageChange = (current: number, trendingData: any[]) => {
    // Implement logic to calculate percentage change
    // This is a placeholder - adjust based on your needs
    return 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F49B31]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600">
        Error loading metrics: {error}
        <button
          onClick={fetchMetrics}
          className="ml-4 underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex whitespace-nowrap justify-between mt-3 gap-4">
      <MetricCard
        title="Waves"
        value={metrics.waves.count}
        change={metrics.waves.change}
      />
      <MetricCard
        title="Pings Submitted"
        value={metrics.pings.count}
        change={metrics.pings.change}
      />
      <MetricCard
        title="Waves Under Review"
        value={metrics.wavesUnderReview.count}
        change={metrics.wavesUnderReview.change}
      />
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers.count}
        change={metrics.activeUsers.change}
      />
    </div>
  );
};

// Helper component
const MetricCard = ({
  title,
  value,
  change,
}: {
  title: string;
  value: number;
  change: number;
}) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white border-[0.5px] border-[#F49B31] p-6 pr-9 max-w-[280px] min-w-[250px] w-full rounded-2xl">
      <p>{title}</p>
      <div className="flex justify-between mt-2 gap-[54px]">
        <p className="text-[25px] font-semibold">{value.toLocaleString()}</p>
        <span className="flex items-center gap-2">
          <p className="text-[10px]">
            {isPositive ? '+' : ''}
            {change.toFixed(2)}%
          </p>
          <img
            src={isPositive ? arrowRise : arrowDrop}
            alt=""
            className="w-[40%]"
          />
        </span>
      </div>
    </div>
  );
};

export default PlatformMetrics;
