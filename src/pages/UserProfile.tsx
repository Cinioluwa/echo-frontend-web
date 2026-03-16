import ProfileBadge from "../components/ProfileBadge";
import ProfileDataField from "../components/ProfileDataField";
import ProfileSelectInput from "../components/ProfileSelectInput";
import UserProfileSidePanel from "../components/UserProfileSidePanel";
import profileImage from "../assets/images/profileImage.jpeg";
import ProfileLayout from "../components/ProfileLayout";

const pages = {
  profile: true,
  account: false,
  notification: false,
  privacy: false,
};

const UserProfile = () => {
  return (
    <div className="overflow-scroll h-screen">
      <ProfileLayout />
      <main className="mt-3 mx-auto h-full p-4 md:p-10">
        <div className="flex md:border rounded-[15px] border-[#FFC37B] p-5 flex-col lg:flex-row gap-0 md:gap-12">
          {/* SIDE PANEL COMPONENT */}

          <UserProfileSidePanel pages={pages} />

          {/* FORM CONTENT */}
          <div className="flex-1 md:border-l overflow-scroll md:border-orange-200 md:pl-12 pt-4 md:pt-0">
            <h2 className="text-xl mb-6">Profile Picture</h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
              <div className="relative">
                <img
                  src={profileImage}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                  alt="Profile"
                />
              </div>
              <div className="flex-1">
                <button className="px-5 py-2 bg-white border border-orange-200 rounded-lg text-sm shadow-sm hover:border-orange-300 transition">
                  Change Picture
                </button>
                <p className="text-[11px] text-gray-400 mt-2 font-medium">
                  JPG, PNG or GIF. Max size 5MB
                </p>
              </div>
              <div className="hidden md:block">
                <ProfileBadge role={"Member"} />
              </div>
            </div>

            {/* DATA FIELDS (NON-EDITABLE) */}
            <div className="space-y-6">
              <ProfileDataField
                label="Name"
                value={`Obasan Tomilola`}
                note="Your name cannot be changed"
              />
              <ProfileDataField
                label="Primary Email"
                value={`obasantomilola@gmail.com`}
                note="Your email address cannot be changed"
              />

              {/* SELECT INPUTS */}
              <div className="pt-6">
                <h3 className="text-lg mb-5">Academic Identifiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <ProfileSelectInput
                    label="Department"
                    placeholder="Select department"
                  />
                  <ProfileSelectInput
                    label="Hall"
                    placeholder="Hall of residence"
                  />
                  <ProfileSelectInput
                    label="Level"
                    placeholder="Academic Level"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
