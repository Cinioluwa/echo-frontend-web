import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FaCommentDots } from "react-icons/fa";
import { IoFlash } from "react-icons/io5";

interface ChartDataProps {
  totalLevelComments: number;
  totalWaveSurges: number;
  totalCollegeSurges: number;
  totalCollegeComments: number;
}

const COLORS = [
  "#8A0FBF", // purple
  "#FF7A33", // orange
  "#FF1744", // red
  "#E66A85", // pink
  "#3DBB6B", // green
];

const levelCommentData = [
  { name: "100L", Comment: 30 },
  { name: "200L", Comment: 15 },
  { name: "300L", Comment: 25 },
  { name: "400L", Comment: 20 },
  { name: "500L", Comment: 10 },
];
const levelSurgeData = [
  { name: "100L", Surge: 30 },
  { name: "200L", Surge: 15 },
  { name: "300L", Surge: 25 },
  { name: "400L", Surge: 20 },
  { name: "500L", Surge: 10 },
];
const collegeSurgeData = [
  { name: "100L", Surge: 30 },
  { name: "200L", Surge: 15 },
  { name: "300L", Surge: 25 },
  { name: "400L", Surge: 20 },
  { name: "500L", Surge: 10 },
];
const collegeCommentData = [
  { name: "100L", Comment: 30 },
  { name: "200L", Comment: 15 },
  { name: "300L", Comment: 25 },
  { name: "400L", Comment: 20 },
  { name: "500L", Comment: 10 },
];

const PostChartAnalysis = ({
  totalLevelComments,
  totalWaveSurges,
  totalCollegeSurges,
  totalCollegeComments,
}: ChartDataProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-10 justify-between">
      <div className="flex flex-col items-center">
        <p className="font-semibold">Analytics by Level</p>
        <div className="flex">
          <div className="w-65 h-65 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie
                  data={levelCommentData}
                  dataKey="Comment"
                  innerRadius={80}
                  outerRadius={110}
                >
                  {levelCommentData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
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
                  <FaCommentDots />
                </span>
                <div>
                  <h2>{totalLevelComments}</h2>
                  <p className="text-[#515052]">Total comments</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-65 h-65 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie
                  data={levelSurgeData}
                  dataKey="Surge"
                  innerRadius={80}
                  outerRadius={110}
                >
                  {levelSurgeData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
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
                  <IoFlash />
                </span>
                <div>
                  <h2>{totalWaveSurges}</h2>
                  <p className="text-[#515052]">Total Surges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <p className="font-semibold">Analytics by College</p>
        <div className="flex">
          <div className="w-65 h-65 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie
                  data={collegeCommentData}
                  dataKey="Comment"
                  innerRadius={80}
                  outerRadius={110}
                >
                  {collegeCommentData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
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
                  <FaCommentDots />
                </span>
                <div>
                  <h2>{totalCollegeComments}</h2>
                  <p className="text-[#515052]">Total comments</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-65 h-65 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie
                  data={collegeSurgeData}
                  dataKey="Surge"
                  innerRadius={80}
                  outerRadius={110}
                >
                  {collegeSurgeData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
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
                  <IoFlash />
                </span>
                <div>
                  <h2>{totalCollegeSurges}</h2>
                  <p className="text-[#515052]">Total Surges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostChartAnalysis;
