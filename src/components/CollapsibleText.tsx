import { useState } from "react";

interface Props {
  title: string | undefined;
  description?: string | undefined;
}

const CollapsibleText = ({ title, description }: Props) => {
  const [expanded, setExpanded] = useState(false);

  if (!title) return null;

  return (
    <div className="flex-1 my-auto text-start">
      <div className="flex items-center justify-between gap-2">
        <p className="flex-1 text-[14px] font-bold">{title}</p>
        {description && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#454545] text-[10px] font-semibold whitespace-nowrap"
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
      </div>
      {expanded && description && (
        <p className="text-[12px] text-gray-700 mt-2">{description}</p>
      )}
    </div>
  );
};

export default CollapsibleText;
