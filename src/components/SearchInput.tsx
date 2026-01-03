import search from "../assets/images/Search.svg";

const SearchInput = () => {
  return (
    <div className="bg-[#FEF5EA] flex items-center justify-start flex-1 h-[37px] rounded-[20px] shadow">
      <span className="flex justify-center ml-[18px] mr-[3px] items-center">
        <img src={search} />
      </span>
      <input
        type="text"
        id="searchInput"
        name="searchInput"
        placeholder="Search"
        className="outline-0 flex-1 text-[11px] font-andada"
        required
      />
    </div>
  );
};

export default SearchInput;
