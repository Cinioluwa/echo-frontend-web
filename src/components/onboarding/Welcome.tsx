const logo = "/assets/images/onboard.svg";

const Welcome = () => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Visual Stage */}
      <div className="w-full h-[260px] sm:h-[280px] rounded-2xl bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/15 flex items-center justify-center p-6 relative overflow-hidden mb-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,155,49,0.15),transparent_70%)] pointer-events-none" />
        <div className="w-48 h-48 sm:w-56 sm:h-56 relative z-10 drop-shadow-md">
          <img
            src={logo}
            alt="Echo Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-3 px-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Welcome to <span className="text-[#F49B31]">Echo</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          Echo is your community's space to raise problems, propose solutions,
          and hold your institution accountable to act. Every voice here drives real change.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
