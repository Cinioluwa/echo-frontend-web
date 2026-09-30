const logo = "/assets/images/onboard.svg";

const Welcome = () => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Visual Stage */}
      <div className="relative mb-4 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#F49B31]/20 bg-gradient-to-b from-[#FFFDF9] via-[#FEFBF6] to-[#FEF5EA]/60 p-3 shadow-sm sm:mb-6 sm:h-[300px] sm:p-5 md:h-[320px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,155,49,0.12),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 h-36 w-36 drop-shadow-sm sm:h-48 sm:w-48">
          <img
            src={logo}
            alt="Echo Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-3 px-2">
        <h2 className="text-xl font-bold font-['Poppins',sans-serif] text-[#060B13] tracking-tight sm:text-3xl">
          Welcome to <span className="text-[#F49B31]">Echo</span>
        </h2>
        <p className="mx-auto max-w-md font-['Inter',sans-serif] text-[13px] leading-relaxed text-[#5F656F] sm:text-base">
          Echo is your community's space to raise problems, propose solutions,
          and hold your institution accountable to act. Every voice here drives real change.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
