import React from "react";

interface KPICardProps {
    icon: string;
    label: string;
    value: string | number;
    delta?: string;
    deltaIcon?: string;
}

const KPICard: React.FC<KPICardProps> = ({ icon, label, value, delta, deltaIcon }) => {
    return (
        <div className="bg-white border border-[rgba(244,155,49,0.3)] rounded-xl px-4 sm:px-5 py-6 sm:py-7 flex-1 flex flex-col gap-1 sm:gap-2">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[16px]">{icon}</span>
                <p className="font-poppins font-medium text-[13px] sm:text-[15px] text-[#f49b31] capitalize">
                    {label}
                </p>
            </div>
            <div className="flex items-center justify-between">
                <p className="font-poppins font-semibold text-[28px] sm:text-[35px] text-black tracking-[-1px] leading-none">
                    {value}
                </p>
                {delta && (
                    <div className="bg-[#fef5ea] rounded-[20px] px-2 py-1 flex items-center gap-1 text-[#f49b31] ">
                        {deltaIcon && <span className="text-[12px] text-bold">{deltaIcon}</span>}
                        <p className="font-poppins font-medium text-[9px] sm:text-[11px] ">
                            {delta}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KPICard;
