interface CategorySelectorProps {
  college: string;
  setCollege: (College: string) => void;
}

const AnnouncementCollege = ({ college, setCollege }: CategorySelectorProps) => {
  const colleges = ["All", "CST", "COE", "CLDS", "CMSS"];

  return (
    <div className=" border-2  rounded-[20px] overflow-hidden inline-flex">
      {colleges.map((col, index) => (
        <div
          key={index}
          onClick={() => setCollege(col)}
          className={`cursor-pointer  ${
            college === col
              ? "bg-[#F49B31] text-white"
              : "bg-[#FEF5EA] transition-colors duration-300 ease-in-out hover:bg-[#f2e8d9]"
          } py-2.5 border-r transition-colors duration-500 ease-in-out px-[25px]`}
        >
          {col}
        </div>
      ))}
    </div>
  );
};

export default AnnouncementCollege;
