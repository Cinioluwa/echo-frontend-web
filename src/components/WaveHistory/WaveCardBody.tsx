const general = "/assets/images/General.svg";
import type { ResolutionLog } from "../../api/types/index";

interface Props {
  resolution: ResolutionLog;
}

const WaveCardBody = ({ resolution }: Props) => {
  // Get category name
  const getCategoryName = () => {
    if (resolution.category && typeof resolution.category === 'object') {
      return resolution.category.name;
    }
    return "General";
  };

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
          <img src={general} alt="" />
        </span>
        {getCategoryName()}
      </div>
      <div className="pb-2">
        {getFormattedText(resolution.content)}
      </div>

      {/* Approved Wave Solution */}
      {resolution.approvedWave && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-green-800 mb-1">✓ Approved Solution:</p>
          <p className="text-sm text-green-700">{resolution.approvedWave.solution}</p>
        </div>
      )}

      {/* Official Response */}
      {resolution.officialResponse && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-800 mb-1">Official Response:</p>
          <p className="text-sm text-blue-700">{resolution.officialResponse.content}</p>
        </div>
      )}

      <div className="border-b border-[#D3CECE] mt-2"></div>
    </div>
  );
};

export default WaveCardBody;
