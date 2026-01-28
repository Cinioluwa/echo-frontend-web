interface Props {
  waveText: string;
  waveTitle?: string;
  image?: string;
  category: string;
}

const StreamCardBody = ({ waveText, waveTitle, image, category }: Props) => {
  return (
    <div className="flex flex-col gap-2.5 my-4">
      <div className="flex items-center gap-[13px]">
        <span>
          <img src={image} alt="" />
        </span>
        {category}
      </div>
      <p className="font-semibold text-[16px] ">{waveTitle}</p>
      <p className="text-[#626665] text-[15px] border-b border-[#D3CECE] pb-4">
        {waveText}
      </p>
    </div>
  );
};

export default StreamCardBody;
