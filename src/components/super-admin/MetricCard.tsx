import React from "react";

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ icon, value, label }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#FFC37B] flex flex-col justify-between h-[148px]">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10  text-[#f49b31]">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
};

export default MetricCard;
