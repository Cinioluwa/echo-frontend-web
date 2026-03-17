import { HiOutlineCheckBadge } from "react-icons/hi2";
import Toggle from "../components/Toggle";
import UserProfileSidePanel from "../components/UserProfileSidePanel";
import ProfileLayout from "../components/ProfileLayout";
import { useState } from "react";

const pages = {
  profile: false,
  account: false,
  notification: false,
  privacy: true,
};

const UserPrivacy = () => {
  // Update Privacy State in database and use that state to conditionally render user information in the app.
  const [userPrivacy, setUserPrivacy] = useState({
    anonymousComments: false,
    anonymousPings: false,
  });

  console.log(userPrivacy);

  return (
    <div className="overflow-scroll h-screen">
      <ProfileLayout />
      <main className="mt-3 mx-auto h-full p-4 md:p-10">
        <div className="flex md:border rounded-[15px] border-[#FFC37B] p-5 flex-col lg:flex-row gap-0 md:gap-12">
          {/* SIDE PANEL COMPONENT */}

          <UserProfileSidePanel pages={pages} />

          {/* FORM CONTENT */}
          <div className="flex-1 mb-80 md:border-l border-orange-200 md:pl-12 pt-4 md:pt-0">
            <h2 className="text-xl text-[#4A3728] mb-6">Email Verification</h2>

            {/* Verified Status Banner */}
            <div className="mb-8 p-6 bg-[#E8F9F1] border border-[#4ADE80] rounded-2xl flex items-start gap-4">
              <HiOutlineCheckBadge
                className="text-[#22C55E] mt-1 shrink-0"
                size={24}
              />
              <div>
                <h3 className="text-[#166534] text-base">Email Verified</h3>
                <p className="text-[#166534]/70 text-sm mt-1">
                  Your email has been verified. You can now enjoy the full
                  features of ECHO
                </p>
              </div>
            </div>

            {/* Toggle Options Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Comment Anonymously
                </span>
                {/* Custom Tailwind Toggle Switch */}
                <Toggle
                  checked={userPrivacy.anonymousComments}
                  onChange={() =>
                    setUserPrivacy({
                      ...userPrivacy,
                      anonymousComments: !userPrivacy.anonymousComments,
                    })
                  }
                />
              </div>
              <div className="flex justify-between items-center p-5 bg-transparent border border-orange-200 rounded-2xl">
                <span className="text-[#4A3728] text-base">
                  Post Pings (Problems) Anonymously
                </span>
                {/* Custom Tailwind Toggle Switch */}
                <Toggle
                  checked={userPrivacy.anonymousPings}
                  onChange={() =>
                    setUserPrivacy({
                      ...userPrivacy,
                      anonymousPings: !userPrivacy.anonymousPings,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserPrivacy;
