import CollapsibleText from "./CollapsibleText";
import { User } from 'lucide-react';

interface Props {
  pingTimeStamp: string | undefined;
  pingTitle: string | undefined;
  pingDescription?: string | undefined;
  pingAuthorName?: string;
  pingAuthorId?: number;
}

const ProposedPingCard = ({
  pingTimeStamp,
  pingTitle,
  pingDescription,
  pingAuthorName
}: Props) => {
  console.log(pingTimeStamp);

  // Use provided author name or fallback to default
  const displayName = pingAuthorName || "Anonymous User";

  return (
    <div className="flex items-center w-full justify-between px-[5px] py-[9px] rounded-2xl bg-[#FFC37B]">
      <div className="  inline-flex mr-2.5 ml-2.5  items-center gap-2.5 ">
        <span className="w-[35px] inline-flex items-center justify-center h-[35px] cursor-pointer rounded-full bg-gray-200">
          <User className="w-5 h-5 text-gray-500" />
        </span>
        <div className="text-start">
          <p className="text-[#926B3D] text-[0.45rem] md:text-[0.74rem] font-bold ">
            {displayName}
          </p>
          <p className="text-[0.62rem] md:text-[0.55rem] ">{pingTimeStamp}</p>
        </div>
      </div>
      <CollapsibleText title={pingTitle} description={pingDescription} />
    </div>
  );
};

export default ProposedPingCard;
