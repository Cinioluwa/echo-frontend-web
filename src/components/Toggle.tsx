interface toggleProps {
  checked?: boolean;
  onChange?: () => void;
}

const Toggle = ({ checked = false, onChange }: toggleProps) => {
  return (
    <label className="relative flex gap-2.5 items-center text-[12px] justify-center cursor-pointer">
      <div className="relative ">
        <input
          onChange={onChange}
          checked={checked}
          name="anonymoucCheck"
          id="anonymousCheck"
          type="checkbox"
          className="sr-only peer"
        />
        <div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-[#F49B31] transition-colors"></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md peer-checked:translate-x-4 duration-300 transition-transform"></div>
      </div>
    </label>
  );
};

export default Toggle;
