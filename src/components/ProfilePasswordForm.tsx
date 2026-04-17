
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
      <p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-6">Update your account password</p>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="password"
            placeholder="Old Password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="flex-1 p-3 md:p-4 bg-[#FFFBF5] border border-orange-100 rounded-xl text-sm italic focus:outline-none focus:ring-1 focus:ring-orange-200"
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="flex-1 p-3 md:p-4 bg-[#FFFBF5] border border-orange-100 rounded-xl text-sm italic focus:outline-none focus:ring-1 focus:ring-orange-200"
            required
            minLength={8}
          />
          <button
            type="submit"
            className="px-6 py-3 md:py-4 bg-[#E8A355] text-white rounded-xl text-sm font-semibold shadow-md hover:bg-[#d49246] transition md:w-auto disabled:opacity-60"
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
