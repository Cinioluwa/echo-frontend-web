import UserProfileSidePanel from "../components/UserProfileSidePanel";
import ProfileLayout from "../components/ProfileLayout";
import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlineExclamationTriangle, HiOutlineTrash } from "react-icons/hi2";
import ProfilePasswordForm from "../components/ProfilePasswordForm";
import { useState } from "react";
import { useAuthStore } from "../stores/auth/useAuthStore";
import userService from "../api/services/user.service";

const pages = {
  profile: false,
  account: true,
  notification: false,
  privacy: false,
};

// Sign Out Button Component
const SignOutButton = () => {
  const logout = useAuthStore((s) => s.logout);
  return (
    <button
      className="flex items-center gap-2 px-5 py-2 bg-white border border-[#F4E3C9] rounded-full text-xs md:text-sm text-[#4A3728] hover:bg-[#FEF5EA] transition"
      onClick={logout}
    >
      <HiOutlineLogout size={16} className="md:size-[18px]" />
      Sign out
    </button>
  );
};

// Delete Account Button Component
const DeleteAccountButton = () => {
  const logout = useAuthStore((s) => s.logout);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete your account? This cannot be undone."
      )
    )
      return;

    setLoading(true);
    setError(null);

    try {
      await userService.deleteMe();
      setSuccess(true);
      setTimeout(() => logout(), 1000);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-[#D96666] text-white rounded-xl text-xs md:text-sm font-bold hover:bg-red-700 transition shadow-sm disabled:opacity-60"
        onClick={handleDelete}
        disabled={loading || success}
      >
        <HiOutlineTrash size={16} className="md:size-[18px]" />
        {loading ? "Deleting..." : success ? "Deleted" : "Delete Account"}
      </button>
      {error && <div className="text-red-600 text-xs text-right">{error}</div>}
      {success && (
        <div className="text-green-600 text-xs text-right">
          Account deleted. Redirecting...
        </div>
      )}
    </div>
  );
};

const UserAccount = () => {
  return (
    <div className="min-h-screen bg-[#FEF5EA]">
      <ProfileLayout />
      <main className="mt-1 mx-auto h-full w-full max-w-[1200px] p-4 md:p-10 pt-2 md:pt-2 pb-16 md:pb-20">
        <div className="flex border border-[#F4E3C9] rounded-[20px] bg-white p-4 md:p-7 flex-col lg:flex-row gap-4 lg:gap-8 shadow-sm">
          {/* SIDE PANEL COMPONENT */}

          <UserProfileSidePanel pages={pages} />

          {/* FORM CONTENT */}
          <div className="flex-1 min-w-0 lg:border-l border-[#F4E3C9] lg:pl-8 pt-4 lg:pt-0">
            {/* Account Section */}
            <section className="mb-8 md:mb-10">
              <h2 className="text-lg md:text-xl text-[#4A3728] mb-0.5 font-semibold">Account</h2>
              <p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-6">Manage your account</p>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 bg-transparent border border-orange-200 rounded-2xl gap-4">
                <div>
                  <h3 className="text-sm md:text-base text-[#4A3728] font-medium">Sign out</h3>
                  <p className="text-xs md:text-sm text-gray-400">
                    Sign out of your account
                  </p>
                </div>
                <SignOutButton />
              </div>
            </section>

            {/* Change Password Modular Component */}
            <ProfilePasswordForm />

            <hr className="my-10 border-orange-100" />

            {/* Danger Zone */}
            <section className="mt-10">
              <h2 className="text-lg md:text-xl text-red-800 mb-0.5 font-bold">
                Danger Zone
              </h2>
              <p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-6">
                Irreversible actions for your account
              </p>

              <div className="p-4 md:p-6 bg-red-50/30 border border-red-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-3 md:gap-4">
                  <HiOutlineExclamationTriangle
                    className="text-red-600 mt-0.5 md:mt-1 shrink-0"
                    size={22}
                  />
                  <div>
                    <h3 className="text-sm md:text-base text-red-800 font-bold">
                      Delete Account
                    </h3>
                    <p className="text-xs md:text-sm text-red-700/70">
                      Permanently delete your account and all data. This cannot
                      be undone
                    </p>
                  </div>
                </div>
                <DeleteAccountButton />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserAccount;
