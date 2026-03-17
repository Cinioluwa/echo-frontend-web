import { HiChevronDown } from "react-icons/hi2";

const ProfileSelectInput = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm ">{label}</label>
      <div className="relative">
        <select className="w-full p-3.5 bg-white border border-orange-100 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange-200 text-gray-400 text-sm font-medium cursor-pointer">
          <option value="">{placeholder}</option>
        </select>
        <HiChevronDown
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={18}
        />
      </div>
    </div>
  );
};

export default ProfileSelectInput;
