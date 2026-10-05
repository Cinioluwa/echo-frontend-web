import React from "react";

interface KPICardProps {
    icon?: string;
    label: string;
    value: string | number;
    delta?: string;
}

const KPICard: React.FC<KPICardProps> = ({ icon, label, value, delta }) => {
    return (
        <div className="flex flex-1 flex-col gap-2 rounded-xl border border-[rgba(244,155,49,0.3)] bg-white px-[17px] py-[25px]">
            <div className="flex items-center gap-1">
                {icon && <img src={icon} alt="" className="h-[18px] w-[11px]" />}
                <p className="font-poppins text-[15px] font-medium tracking-[0.55px] text-[#f49b31]">{label}</p>
            </div>
            <div className="flex items-center justify-between gap-2">
                <p className="font-poppins text-[35px] font-semibold leading-none text-black">{value}</p>
                {delta && (
                    <span className="rounded-[20px] bg-[#fef5ea] px-2 py-1 font-['DM_Sans',sans-serif] text-[11px] font-medium text-[#f49b31]">
                        {delta}
                    </span>
                )}
            </div>
        </div>
    );
};

export default KPICard;
