import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearchStore } from "../stores";
const search = "/assets/images/Search.svg";

interface SearchInputProps {
  onSearch?: (query: string) => void;
}

const SearchInput = ({ onSearch }: SearchInputProps) => {
  const searchQuery = useSearchStore((state) => state.query);
  const setSearchQuery = useSearchStore((state) => state.setQuery);
  const setDebouncedQuery = useSearchStore((state) => state.setDebouncedQuery);
  const location = useLocation();

  // Reset search when navigating to a different page
  useEffect(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    if (onSearch) {
      onSearch("");
    }
  }, [location.pathname, setSearchQuery, setDebouncedQuery, onSearch]);

  // Determine search context based on current page
  const getSearchContext = () => {
    if (location.pathname.includes("soundBoard")) return "soundboard";
    if (location.pathname.includes("stream")) return "stream";
    if (location.pathname.includes("waveHistory")) return "waveHistory";
    return "general";
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Trigger search as user types (debounced effect will be in parent)
    if (onSearch) {
      onSearch(value.trim());
    }
  };

  // Handle search submission
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchQuery.trim());
      }
    },
    [onSearch, searchQuery]
  );

  const context = getSearchContext();
  const placeholderText =
    context === "soundboard"
      ? "Search pings..."
      : context === "stream"
        ? "Search waves..."
        : "Search...";

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="bg-[#FEF5EA] flex items-center justify-start flex-1 h-[37px] rounded-[20px] shadow"
    >
      <span className="flex justify-center ml-[18px] mr-[3px] items-center">
        <img src={search} alt="search icon" />
      </span>
      <input
        type="text"
        id="searchInput"
        name="searchInput"
        placeholder={placeholderText}
        value={searchQuery}
        onChange={handleSearchChange}
        className="outline-0 flex-1 text-[11px] font-andada bg-transparent"
      />
    </form>
  );
};

export default SearchInput;
