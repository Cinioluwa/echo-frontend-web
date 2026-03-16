// import {z} from "zod";
// import useForm from "react-hook-form";

const ProfilePasswordForm = () => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-xl text-[#4A3728] mb-1">Change Password</h2>
      <p className="text-sm text-gray-400 mb-6">Manage your account</p>

      <div className="space-y-4">
        {/* Main Inputs */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="password"
            placeholder="Old Password"
            className="flex-1 p-4 bg-[#FFFBF5] border border-orange-100 rounded-xl text-sm italic focus:outline-none focus:ring-1 focus:ring-orange-200"
          />
          <input
            type="password"
            placeholder="New Password"
            className="flex-1 p-4 bg-[#FFFBF5] border border-orange-100 rounded-xl text-sm italic focus:outline-none focus:ring-1 focus:ring-orange-200"
          />
          <button className="px-6 py-4 bg-[#E8A355] text-white rounded-xl text-sm shadow-md hover:bg-[#d49246] transition md:w-auto">
            Change Password
          </button>
        </div>

        {/* OTP Verification Section */}
        <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
          <div className="relative w-full md:w-2/3">
            <input
              type="text"
              placeholder="Enter OTP sent"
              className="w-full p-4 bg-[#FFFBF5] border border-orange-100 rounded-xl text-sm italic focus:outline-none focus:ring-1 focus:ring-orange-200"
            />
          </div>
          <button className="w-full md:w-auto px-10 py-4 bg-[#E8A355] text-white rounded-xl text-sm shadow-md hover:bg-[#d49246] transition">
            Confirm
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfilePasswordForm;
