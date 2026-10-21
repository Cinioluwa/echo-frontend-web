import { useState } from "react";

interface OfficialResponseCardProps {
  response: {
    content: string;
    createdAt: string;
    author: {
      firstName: string;
      lastName: string;
      profilePicture?: string | null;
      role?: string;
    };
  };
}

const OfficialResponseCard = ({ response }: OfficialResponseCardProps) => {
  const [showOfficialAuthor, setShowOfficialAuthor] = useState(false);
  const roleLabel =
    response.author.role === "ADMIN" || response.author.role === "SUPER_ADMIN"
      ? "Institutional Admin"
      : "Representative";

  return (
    <section className="overflow-visible rounded-[15px] border border-[#F49B31] bg-white">
      <div className="flex items-center gap-2.5 rounded-t-[15px] border-b border-[#F49B31] bg-[#FFC37B] px-4 py-3">
        <img
          src="/assets/icon/official-response.svg"
          className="h-5 w-5"
          alt="Official Response Icon"
        />
        <h3 className="font-poppins text-[18px] font-semibold text-black">
          Official Response
        </h3>
      </div>
      <div className="p-5">
        <p className="font-poppins text-[17px] font-medium leading-relaxed text-[#212121]">
          {response.content}
        </p>
        <div className="relative mt-3 flex flex-col items-start gap-1">
          <button
            type="button"
            aria-expanded={showOfficialAuthor}
            onClick={() => setShowOfficialAuthor((visible) => !visible)}
            className="font-poppins text-[13px] font-medium text-[#75420B] transition-colors hover:text-[#F49B31]"
          >
            ~ {roleLabel}
          </button>
          {showOfficialAuthor && (
            <div className="absolute left-0 top-full z-20 mt-2 flex min-w-[220px] items-center gap-3 rounded-[12px] border border-[#F49B31]/40 bg-white p-3 shadow-lg">
              {response.author.profilePicture ? (
                <img
                  src={response.author.profilePicture}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FEF5EA] font-poppins text-sm font-semibold text-[#75420B]"
                >
                  {response.author.firstName[0] ?? ""}
                  {response.author.lastName[0] ?? ""}
                </span>
              )}
              <span className="font-poppins text-sm font-semibold text-[#212121]">
                {response.author.firstName} {response.author.lastName}
              </span>
            </div>
          )}
          <time
            dateTime={response.createdAt}
            className="font-poppins text-[13px] font-medium text-[#8b8e8d]"
          >
            {new Date(response.createdAt).toLocaleDateString()}
          </time>
        </div>
      </div>
    </section>
  );
};

export default OfficialResponseCard;
