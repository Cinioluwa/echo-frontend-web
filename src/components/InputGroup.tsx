interface InputGroupProps {
  placeholder: string;
  iconSrc: string;
  type: string;
}

const InputGroup = ({ placeholder, iconSrc, type }: InputGroupProps) => {
  return (
    <div className="mb-4.5 w-full flex items-center bg-[#FBFBFB] italic text-[#CACACA] justify-start h-16 relative  borde overflow-hidden border-[#CACACA] rounded-xl">
      <span className="w-7 pr-2 left-5 py-1 absolute flex items-center justify-center border-r border-r-[#CACACA]">
        <img src={iconSrc} />
      </span>
      <input
        className="pl-15 text-[12px] h-full flex-1 outline-0"
        type={type}
        placeholder={placeholder}
        required
      ></input>
    </div>
  );
};

export default InputGroup;
