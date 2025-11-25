import StreamCardBody from "./StreamCardBody";
import StreamCardFooter from "./StreamCardFooter";
import StreamCardHeader from "./StreamCardHeader";

interface Props {
  waveText: string;
  waveTitle: string;
  image: string;
  category: string;
  timeStamp: string;
}

const StreamCard = ({
  waveText,
  category,
  waveTitle,
  image,
  timeStamp,
}: Props) => {
  return (
    <>
      <div className="  m-[15px] md:m-0 px-[25px] py-2.5 bg-[#FEFEFE]  rounded-[10px] ">
        <div>
          <StreamCardHeader timeStamp={timeStamp} />
        </div>
        <StreamCardBody
          category={category}
          image={image}
          waveTitle={waveTitle}
          waveText={waveText}
        />
        <StreamCardFooter
        />
      </div>
    </>
  );
};

export default StreamCard;
