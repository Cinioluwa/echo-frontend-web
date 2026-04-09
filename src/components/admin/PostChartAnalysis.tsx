import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FiBarChart2 } from "react-icons/fi";
import { analyticsService } from "../../api";
import type { CategoryStats } from "../../api/types/admin.types";

const COLORS = [
  "#8A0FBF", // purple
  "#FF7A33", // orange
  "#FF1744", // red
  "#E66A85", // pink
  "#3DBB6B", // green
  "#00BCD4", // cyan
  "#9C27B0", // deep purple
  "#FF9800", // amber
];

const PostChartAnalysis = () => {
  const [categoryData, setCategoryData] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getCategoryStats();
        setCategoryData(data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch analytics:", err);
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-10 text-gray-500">
        Loading analytics...
      </div>
    );
  }

  if (error || categoryData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-10 text-red-500">
        {error || "No analytics data available"}
      </div>
    );
  }

  // Transform data for chart (API returns name and count fields)
  const chartData = categoryData.map((item) => ({
    name: item.name,
    value: item.count,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center">
      <p className="font-semibold mb-4">Pings by Category</p>
      <div className="w-full flex justify-center">
        <div className="w-80 h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={80}
                outerRadius={110}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div className="flex flex-col items-center">
              <span style={{ fontSize: 22 }}>
                <FiBarChart2 />
              </span>
              <div>
                <h2 className="font-bold">{total}</h2>
                <p className="text-[#515052] text-xs">Total Pings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Legend */}
      <div className="mt-6 w-full max-w-md">
        <div className="grid grid-cols-2 gap-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-700">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostChartAnalysis;
