import { useState } from "react";

interface Props {
  text: string | undefined;
}

const largeScreenLimit = window.matchMedia("(min-width: 1055px)").matches;

console.log(largeScreenLimit);

const CollapsibleText = ({ text }: Props) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return;

  const limit = largeScreenLimit ? 100 : 50;

  if (text.length <= limit) {
    return <p className="flex-1 text-[10px] text-start font-normal">{text}</p>;
  }

  const displayText = expanded ? text : text.slice(0, limit) + "...";

  return (
    <p className="flex-1 my-auto text-[14px] text-start font-normal">
      {displayText}
      <button
        onClick={() => setExpanded(!expanded)}
        className=" text-[#454545] text-[10px]"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </p>
  );
};

export default CollapsibleText;
