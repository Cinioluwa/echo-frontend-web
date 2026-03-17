import type { proposedWaveDetails } from "../ProposeWaveModal";
import AdminSurgeView from "./AdminSurgeView";
import AdminWaveCard from "./AdminWaveCard";

interface AdminWaveCardProps {
  waves: proposedWaveDetails;
}

// SIMULATING BACKEND DATA
const surgeData = [
  { name: "Claude Bowman", level: 500, college: "CST" },
  { name: "Mone Lara", level: 300, college: "COE" },
  { name: "Brooke Barber", level: 200, college: "CLDS" },
  { name: "Ayesha Drake", level: 300, college: "CST" },
  { name: "Lionesse Yami", level: 300, college: "CST" },
  { name: "Julian Vance", level: 400, college: "CMSS" },
  { name: "Sasha Meyer", level: 100, college: "CST" },
  { name: "Dominic Reed", level: 500, college: "COE" },
  { name: "Elena Fisher", level: 200, college: "CLDS" },
  { name: "Marcus Wright", level: 300, college: "CMSS" },
  { name: "Fiona Gallagher", level: 400, college: "CST" },
  { name: "Victor Stone", level: 500, college: "COE" },
  { name: "Nora West", level: 200, college: "CST" },
  { name: "Quinn Fabray", level: 300, college: "CLDS" },
  { name: "Riley Reid", level: 100, college: "CMSS" },
  { name: "Silas Vane", level: 400, college: "CMSS" },
  { name: "Tessa Gray", level: 200, college: "CST" },
];

const WavePostDetailFeed = ({ waves }: AdminWaveCardProps) => {
  return (
    <div className="flex flex-col gap-4">
      <AdminWaveCard waves={waves} />

      <AdminSurgeView surges={surgeData} totalSurgeCount={surgeData.length} />
    </div>
  );
};

export default WavePostDetailFeed;
