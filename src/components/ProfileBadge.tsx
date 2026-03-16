import { HiOutlineAcademicCap } from "react-icons/hi2";

const ProfileBadge = ({ role }: { role: string }) => {
  return (
    <div className="flex items-center gap-2 bg-[#E8A355] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
      <HiOutlineAcademicCap size={18} />
      {role}
    </div>
  );
};

export default ProfileBadge;
