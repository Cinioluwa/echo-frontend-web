import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlineExclamationTriangle, HiOutlineTrash } from "react-icons/hi2";
import ProfileLayout from "../../components/ProfileLayout";
import ProfilePasswordForm from "../../components/ProfilePasswordForm";
import Toggle from "../../components/Toggle";
import AdminProfileSidePanel from "../../components/admin/AdminProfileSidePanel";
import { useState } from "react";

const pages = {
  profile: false,
  account: true,
  notification: false,
  privacy: false,
};

const AdminAccount = () => {
  // Update 2FA State in database and use that state to conditionally render 2FA status in the app.
  const [enable2fa, setEnable2fa] = useState(false);
  console.log(enable2fa);

  return (
    <div className="overflow-scroll h-screen">
      <ProfileLayout />
      <main className="mt-3 mx-auto h-full p-4 md:p-10">
        <div className="flex md:border rounded-[15px] border-[#FFC37B] p-5 flex-col lg:flex-row gap-0 md:gap-12">
          {/* SIDE PANEL COMPONENT */}

          <AdminProfileSidePanel pages={pages} />

          {/* FORM CONTENT */}
          <div className="flex-1 md:border-l border-orange-200 md:pl-12 pt-4 md:pt-0">
            {/* Account Section */}
            <section className="mb-10">
              <h2 className="text-xl text-[#4A3728] mb-1">Account</h2>
              <p className="text-sm text-gray-400 mb-6">Manage your account</p>

              <div className="flex justify-between items-center p-6 bg-transparent border border-orange-200 rounded-2xl">
                <div>
                  <h3 className="text-base text-[#4A3728]">Sign out</h3>
                  <p className="text-sm text-gray-400">
                    Sign out of your account on this device
                  </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2 bg-white border border-orange-200 rounded-xl text-sm text-[#4A3728] hover:bg-orange-50 transition">
                  <HiOutlineLogout size={18} />
                  Sign out
                </button>
              </div>
              <div className="flex justify-between items-center mt-5 p-6 bg-transparent border border-orange-200 rounded-2xl">
                <div>
                  <h3 className="text-base text-[#4A3728]">
                    Enable Two Factor Authentication for added security on your
                    account
                  </h3>
                </div>
                <Toggle
                  checked={enable2fa}
                  onChange={() => setEnable2fa(!enable2fa)}
                />
              </div>
            </section>

            {/* Change Password Modular Component */}
            <ProfilePasswordForm />

            <hr className="my-10 border-orange-100" />

            {/* Danger Zone */}
            <section>
              <h2 className="text-xl text-red-800 mb-1 **font-bold**">
                Danger Zone
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Irreversible actions for your account
              </p>

              <div className="p-6 bg-red-50/30 border border-red-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-4">
                  <HiOutlineExclamationTriangle
                    className="text-red-600 mt-1"
                    size={24}
                  />
                  <div>
                    <h3 className="text-base text-red-800 **font-bold**">
                      Delete Account
                    </h3>
                    <p className="text-sm text-red-700/70">
                      Permanently delete your account and all data. This cannot
                      be undone
                    </p>
                  </div>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D96666] text-white rounded-xl text-sm **font-bold** hover:bg-red-700 transition shadow-sm">
                  <HiOutlineTrash size={18} />
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAccount;
