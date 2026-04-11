import logo from "../../../public/assets/images/onboard.svg";

const Welcome = () => {
  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-black/60 p-4">
      {/* Main Container */}
      <div className="relative w-full max-w-4xl aspect-16/10 bg-white rounded-2xl shadow-2xl  border border-purple-100 flex gap-10 flex-col items-center justify-between p-8 md:p-12">
        {/* Top/Center Section: Branding/Logo */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-64 h-64 relative">
            <img
              src={logo}
              alt="Echo Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Bottom Section: Text Content */}
        <div className="w-full max-w-[1000px] text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#FFC37B]">
              Welcome to <span className="text-[#F49B31]">Echo</span>
            </h1>
            <p className="text-gray-700 text-[15px] leading-relaxed font-medium">
              Echo is your community's space to raise problems, propose
              solutions, and hold your institution accountable to act. Every
              voice here drives real change — including yours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
