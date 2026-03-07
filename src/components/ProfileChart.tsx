// Placeholder component for profile analytics chart
// This will be replaced with actual chart implementation later

const ProfileChart = () => {
    return (
        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200 w-full">
            {/* Header with title and time period selector */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <h3 className="text-lg font-bold text-[#23272e]">Profile Overview</h3>

                <div className="bg-[#fef5ea] rounded-xl p-1 flex gap-1">
                    <button className="bg-white px-3 py-2 rounded-lg text-xs font-medium text-[#f49b31]">
                        This week
                    </button>
                    <button className="px-3 py-2 rounded-lg text-xs font-normal text-[#6a717f] hover:bg-white/50 transition-colors">
                        Last week
                    </button>
                </div>
            </div>

            {/* Stats tabs */}
            <div className="flex gap-5 px-5 mb-6">
                <div className="flex-1 px-2 py-4 border-b-2 border-[#f49b31] bg-linear-to-b from-transparent to-[rgba(78,166,116,0.04)]">
                    <p className="text-2xl font-bold text-[#23272e] mb-2">5.1k</p>
                    <p className="text-[13px] font-medium text-[#8b909a] tracking-[-0.26px]">Surges</p>
                </div>

                <div className="flex-1 px-2 py-4 border-b border-[#e9e7fd]">
                    <p className="text-2xl font-bold text-[#23272e] mb-2">3.2k</p>
                    <p className="text-[13px] font-medium text-[#8b909a] tracking-[-0.26px]">Comment and Waves</p>
                </div>
            </div>

            {/* Chart area - placeholder */}
            <div className="px-5 pb-6 relative">
                {/* Y-axis labels */}
                <div className="absolute left-5 top-0 flex flex-col justify-between h-[203px] text-sm text-[#f49b31]">
                    <span>50k</span>
                    <span>40k</span>
                    <span>30k</span>
                    <span>20k</span>
                    <span>10k</span>
                    <span>0k</span>
                </div>

                {/* Chart placeholder */}
                <div className="ml-12 bg-linear-to-br from-[#FFE8C5] via-[#FFD9A6] to-[#FFCA87] rounded-lg h-[220px] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                        <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                            <path
                                d="M0,150 L80,120 L160,100 L240,130 L320,80 L400,90 L480,110 L560,100 L600,90"
                                stroke="#F49B31"
                                strokeWidth="2"
                                fill="none"
                                opacity="0.5"
                            />
                            <path
                                d="M0,150 L80,120 L160,100 L240,130 L320,80 L400,90 L480,110 L560,100 L600,90 L600,200 L0,200 Z"
                                fill="url(#gradient)"
                                opacity="0.3"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#F49B31" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#FFF4E6" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="relative z-10 text-center">
                        <div className="text-gray-600 text-sm font-medium mb-2">📊</div>
                        <p className="text-gray-500 text-xs">Chart Component Placeholder</p>
                        <p className="text-gray-400 text-xs mt-1">Analytics visualization will appear here</p>
                    </div>
                </div>

                {/* X-axis labels */}
                <div className="ml-12 flex justify-between text-xs mt-2">
                    <span className="text-[#f49b31]">Sun</span>
                    <span className="text-[#f49b31]">Mon</span>
                    <span className="text-[#f49b31]">Tue</span>
                    <span className="font-bold text-black">Wed</span>
                    <span className="text-[#f49b31]">Thu</span>
                    <span className="text-[#f49b31]">Fri</span>
                    <span className="text-[#f49b31]">Sat</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileChart;
