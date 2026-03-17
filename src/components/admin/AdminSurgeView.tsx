import { FaChrome } from "react-icons/fa";

interface AdminSurgeViewProps {
  surges: {
    name: string;
    level: number;
    college: string;
  }[];
  totalSurgeCount: number;
}

const AdminSurgeView = ({
  surges = [],
  totalSurgeCount = 0,
}: AdminSurgeViewProps) => {
  return (
    <div className="w-full max-h-[400px] pb-3 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-100">
      <div className="p-6 pb-2 flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="text-2xl text-gray-800">Surges</h2>
        <span className=" font-semibold text-orange-400">
          {totalSurgeCount.toLocaleString()}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 custom-scrollbar">
        <ul className="space-y-8">
          {surges.map((surge, index) => (
            <li
              key={index}
              className="flex items-center justify-between text-xl text-gray-600"
            >
              <div className="flex items-center gap-4 flex-1">
                <FaChrome className=" text-gray-700" />
                <span className="font-medium text-gray-700 leading-tight">
                  {surge.name}
                </span>
              </div>
              <div className="flex-1 text-center">
                <span>{surge.level} level</span>
              </div>
              s
              <div className="flex-1 text-right font-medium">
                <span>{surge.college}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSurgeView;
