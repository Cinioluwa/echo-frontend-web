import React, { useState } from "react";

const RulesSettings: React.FC = () => {
    // Posting behaviour state
    const [allowMedia, setAllowMedia] = useState(true);
    const [cooldown, setCooldown] = useState("10 minutes");

    // Moderation thresholds state
    const [reportsCount, setReportsCount] = useState("3 reports");
    const [hidePending, setHidePending] = useState(true);

    // Wave rules state
    const [minSurges, setMinSurges] = useState("10 minimums");

    return (
        <div className="flex flex-col gap-8 w-full animate-fade-in">
            {/* --- Section: Posting behaviour --- */}
            <div className="flex flex-col gap-4 w-full">
                <div className=" pb-2">
                    <h3 className="font-poppins font-semibold text-[16px] text-black">
                        Posting behaviour
                    </h3>
                    <p className="font-poppins text-[12px] text-black mt-1">
                        Control what students can submit and keep track of when they can post
                    </p>
                </div>

                {/* Option 1: Allow media */}
                <div className="flex items-center justify-between p-5 border border-[#7D7D7D] rounded-[10px] hover:border-[#f49b31] transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-poppins font-medium text-[14px] text-black">
                            Allow media attachments on pings
                        </span>
                        <span className="font-poppins text-[12px] text-[#626665]">
                            Students can upload images or files when submitting a ping
                        </span>
                    </div>
                    <button
                        onClick={() => setAllowMedia(!allowMedia)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${allowMedia ? "bg-[#f49b31]" : "bg-[#e5e5e5]"
                            }`}
                        aria-label="Toggle allow media"
                    >
                        <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${allowMedia ? "translate-x-6" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>

                {/* Option 2: Cooldown Dropdown */}
                <div className="flex items-center justify-between p-5 border border-[#7D7D7D] rounded-[10px] hover:border-[#f49b31] transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-poppins font-medium text-[14px] text-black">
                            Same-topic posting cooldown
                        </span>
                        <span className="font-poppins text-[12px] text-[#626665]">
                            Time students must wait before posting similar topics again
                        </span>
                    </div>
                    <div className="relative">
                        <select
                            value={cooldown}
                            onChange={(e) => setCooldown(e.target.value)}
                            className="appearance-none bg-white border border-[#ffd7a8] rounded-[10px] px-4 py-2 pr-10 font-poppins text-[14px] font-medium text-black outline-none focus:border-[#f49b31] cursor-pointer"
                        >
                            <option value="5 minutes">5 minutes</option>
                            <option value="10 minutes">10 minutes</option>
                            <option value="30 minutes">30 minutes</option>
                            <option value="1 hour">1 hour</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f49b31]">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Section: Moderation thresholds --- */}
            <div className="flex flex-col gap-4 w-full">
                <div className="pb-2">
                    <h3 className="font-poppins font-semibold text-[16px] text-black">
                        Moderation thresholds
                    </h3>
                    <p className="font-poppins text-[12px] text-black mt-1">
                        Set the triggers for bringing flagged content to your attention
                    </p>
                </div>

                {/* Option 1: Reports Dropdown */}
                <div className="flex items-center justify-between p-5 border border-[#7D7D7D] rounded-[10px] hover:border-[#f49b31] transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-poppins font-medium text-[14px] text-black">
                            Reports before a ping is auto-flagged
                        </span>
                        <span className="font-poppins text-[12px] text-[#626665]">
                            Flag a ping if flagged this many times by unique users
                        </span>
                    </div>
                    <div className="relative">
                        <select
                            value={reportsCount}
                            onChange={(e) => setReportsCount(e.target.value)}
                            className="appearance-none bg-white border border-[#ffd7a8] rounded-[10px] px-4 py-2 pr-10 font-poppins text-[14px] font-medium text-black outline-none focus:border-[#f49b31] cursor-pointer"
                        >
                            <option value="2 reports">2 reports</option>
                            <option value="3 reports">3 reports</option>
                            <option value="5 reports">5 reports</option>
                            <option value="10 reports">10 reports</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f49b31]">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Option 2: Hide Pending Toggle */}
                <div className="flex items-center justify-between p-5 border border-[#7D7D7D] rounded-[10px] hover:border-[#f49b31] transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-poppins font-medium text-[14px] text-black">
                            Hide flagged content pending review
                        </span>
                        <span className="font-poppins text-[12px] text-[#626665]">
                            Flagged pings are hidden from student feed until moderation action is taken
                        </span>
                    </div>
                    <button
                        onClick={() => setHidePending(!hidePending)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${hidePending ? "bg-[#f49b31]" : "bg-[#e5e5e5]"
                            }`}
                        aria-label="Toggle hide pending"
                    >
                        <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${hidePending ? "translate-x-6" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* --- Section: Wave rules --- */}
            <div className="flex flex-col gap-4 w-full">
                <div className="pb-2">
                    <h3 className="font-poppins font-semibold text-[16px] text-black">
                        Wave rules
                    </h3>
                    <p className="font-poppins text-[12px] text-black mt-1">
                        Control how and when waves can be raised
                    </p>
                </div>

                {/* Option 1: Minimum Surges Dropdown */}
                <div className="flex items-center justify-between p-5 border border-[#7D7D7D] rounded-[10px] hover:border-[#f49b31] transition-colors">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-poppins font-medium text-[14px] text-black">
                            Minimum surges on a ping before a wave can be unlocked
                        </span>
                        <span className="font-poppins text-[12px] text-[#626665]">
                            Number of community responses that unlock wave features
                        </span>
                    </div>
                    <div className="relative">
                        <select
                            value={minSurges}
                            onChange={(e) => setMinSurges(e.target.value)}
                            className="appearance-none bg-white border border-[#ffd7a8] rounded-[10px] px-4 py-2 pr-10 font-poppins text-[14px] font-medium text-black outline-none focus:border-[#f49b31] cursor-pointer"
                        >
                            <option value="5 minimums">5 minimums</option>
                            <option value="10 minimums">10 minimums</option>
                            <option value="20 minimums">20 minimums</option>
                            <option value="50 minimums">50 minimums</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f49b31]">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RulesSettings;
