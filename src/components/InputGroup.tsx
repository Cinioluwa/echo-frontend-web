interface InputGroupProps {
  placeholder: string;
  iconSrc: string;
  type: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

const InputGroup = ({
  placeholder,
  iconSrc,
  type,
  name,
  value,
  onChange,
  required = true,
  disabled = false,
}: InputGroupProps) => {
  return (
    <div className="mb-4.5 w-full flex items-center bg-[#FBFBFB] italic text-[#CACACA] justify-start h-16 relative borde overflow-hidden border-[#CACACA] rounded-xl">
      <span className="w-7 pr-2 left-5 py-1 absolute flex items-center justify-center border-r border-r-[#CACACA]">
        <img src={iconSrc} alt="" />
      </span>
      <input
        className="pl-15 text-[12px] h-full flex-1 outline-0 disabled:opacity-50 disabled:cursor-not-allowed"
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default InputGroup;
