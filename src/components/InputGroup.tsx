interface InputGroupProps {
  placeholder: string;
  iconSrc: string;
  type: string;
}

const InputGroup = ({ placeholder, iconSrc, type }: InputGroupProps) => {
  return (
    <div className="mb-4.5 hidden md:flex items-center bg-[#FBFBFB] italic text-[#CACACA] justify-start pr-11  md:pr-26 h-16  pl-5 border border-[#CACACA] rounded-xl">
      <span className="w-7 pr-2 py-1 flex items-center justify-center border-r border-r-[#CACACA]">
        <img src={iconSrc} />
      </span>
      <input
        className="pl-3 py-2.5 flex-1 outline-0"
        type={type}
        placeholder={placeholder}
        autoComplete="on"
        required
      ></input>
    </div>
  );
};

export default InputGroup;
