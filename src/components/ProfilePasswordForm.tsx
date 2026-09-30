
import { useState } from "react";
import usePasswordChange from "../hooks/usePasswordChange";


const ProfilePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { loading, error, success, changePassword } = usePasswordChange();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    await changePassword(currentPassword, newPassword);
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 md:mt-10">
      <h2 className="text-lg md:text-xl text-[#4A3728] mb-1 font-semibold">Change Password</h2>
      <p className="text-xs md:text-sm text-[#6B6259] mb-4 md:mb-6">Update your account password</p>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="password"
            placeholder="Old Password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="flex-1 p-3 md:p-4 bg-[#FEF5EA] border border-[#F4E3C9] rounded-xl text-sm text-[#060B13] focus:outline-none focus:ring-2 focus:ring-[#FFC37B]"
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="flex-1 p-3 md:p-4 bg-[#FEF5EA] border border-[#F4E3C9] rounded-xl text-sm text-[#060B13] focus:outline-none focus:ring-2 focus:ring-[#FFC37B]"
            required
            minLength={8}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#F49B31] text-white rounded-full text-sm font-semibold hover:bg-[#d88429] transition md:w-auto disabled:opacity-60"
            disabled={loading || !currentPassword || !newPassword}
          >
            {loading ? "Changing..." : "Update Password"}
          </button>
        </div>
        {error && (
          <div className="text-red-600 text-sm mt-2">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-sm mt-2">Password changed successfully!</div>
        )}
      </div>
    </form>
  );
};

export default ProfilePasswordForm;
