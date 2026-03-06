interface Props {
  waveText: string;
  waveTitle?: string;
  image?: string;
  category?: string;
}

const StreamCardBody = ({ waveText, image, category }: Props) => {
  // Extract first sentence and make it bold
  const getFormattedText = (text: string) => {
    const match = text.match(/^[^.!?]+[.!?]/);
    if (match) {
      const firstSentence = match[0];
      const restOfText = text.slice(firstSentence.length).trim();
      return (
        <>
          <p className="text-black text-[15px] font-bold">{firstSentence}</p>
          {restOfText && <p className="text-black text-[15px]">{restOfText}</p>}
        </>
      );
    }
    return <p className="text-black text-[15px] font-bold">{text}</p>;
  };

  return (
    <div className="flex flex-col gap-2.5 my-4">
      <div className="flex items-center gap-[13px]">
        <span>
          <img src={image} alt="" />
        </span>
        {category || "General"}
      </div>
      <div className="border-b border-[#D3CECE] pb-4">
        {getFormattedText(waveText)}
      </div>
    </div>
  );
};

export default StreamCardBody;
