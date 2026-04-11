const Surge = () => {
  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-black/60 p-4">
      {/* Main Container */}
      <div className="relative w-full max-w-4xl aspect-16/10 bg-white rounded-2xl shadow-2xl  border border-purple-100 flex flex-col gap-10 items-center justify-between p-8 md:p-12">
        {/* Top/Center Section: Branding/Logo */}
        <div className="flex-1  items-center justify-center w-full">
          <div>
            <video
              autoPlay
              loop
              className="w-full max-h-[500px] rounded-xl object-contain"
            >
              <source src="/assets/videos/Surge.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Bottom Section: Text Content */}
        <div className="w-full max-w-[1000px] text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#F49B31]">
              Back <span className="text-[#FFC37B]">what matters</span>
            </h1>
            <p className="text-gray-700 text-[15px] leading-relaxed font-medium">
              Tap the lightning bolt on any Ping, Wave, or comment you agree
              with to Surge it. The more surges something gets, the higher it
              rises — and the harder it becomes for leadership to ignore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Surge;
