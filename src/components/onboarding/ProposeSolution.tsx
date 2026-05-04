import { useState } from "react";

const ProposeSolution = () => {
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  return (
    <div>
      {/* Main Container */}
      <div className="relative w-full max-w-4xl aspect-16/10 bg-white rounded-2xl shadow-2xl  border border-purple-100 flex flex-col gap-10 items-center justify-between p-8 md:p-12">
        {/* Top/Center Section: Branding/Logo */}
        <div className="flex-1  items-center justify-center w-full">
          <div>
            {videoUnavailable ? (
              <div className="w-full max-h-[500px] min-h-[220px] rounded-xl bg-[#f8f8f8] border border-[#ececec] flex items-center justify-center px-6 text-center text-[#4a504e] text-sm">
                Video preview is unavailable right now. Continue to the next step.
              </div>
            ) : (
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onError={() => setVideoUnavailable(true)}
                className="w-full max-h-[500px] rounded-xl object-contain"
              >
                <source src="/assets/videos/Propose Wave.mp4" type="video/mp4" />
              </video>
            )}
          </div>
        </div>

        {/* Bottom Section: Text Content */}
        <div className="w-full max-w-[1000px] text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#FFC37B]">
              Propose a <span className="text-[#F49B31]">Solution</span>
            </h1>
            <p className="text-gray-700 text-[15px] leading-relaxed font-medium">
              Click on any Ping in the feed and tap 'What's your solution?' to
              suggest how it can be fixed. Your solution becomes a Wave.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposeSolution;
