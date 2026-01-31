interface CategorySelectorProps {
  group: string;
  setGroup: (group: string) => void;
}

const AnnouncementGroup = ({ group, setGroup }: CategorySelectorProps) => {
  const groups = ["All", "College", "Hall", "Level", "Gender"];

  return (
    <div className=" border-2  rounded-[20px] overflow-hidden inline-flex">
      {groups.map((g, index) => (
        <div
          key={index}
          onClick={() => setGroup(g)}
          className={`cursor-pointer  ${
            group === g
              ? "bg-[#F49B31] text-white"
              : "bg-[#FEF5EA] transition-colors duration-300 ease-in-out hover:bg-[#f2e8d9]"
          } py-2.5 border-r transition-colors duration-500 ease-in-out px-[25px]`}
        >
          {g}
        </div>
      ))}
    </div>
  );
};

export default AnnouncementGroup;
