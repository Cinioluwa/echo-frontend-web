import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useSearchStore } from "../stores";
import { useNavigate, useLocation } from "react-router-dom";

export const SearchBar = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);
  const setDebouncedQuery = useSearchStore((state) => state.setDebouncedQuery);
  const clearSearch = useSearchStore((state) => state.clearSearch);

  const [localInput, setLocalInput] = useState(query);

  useEffect(() => {
    setLocalInput(query);
  }, [query]);

  // Debounce the input (300ms) to trigger search requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(localInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [localInput, setDebouncedQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalInput(val);
    setQuery(val);
    if (location.pathname !== "/feed" && val.trim().length > 0) {
      navigate("/feed");
    }
  };

  const handleClear = () => {
    setLocalInput("");
    clearSearch();
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <FiSearch className="absolute left-3.5 text-[#8b8e8d] text-base pointer-events-none" />
      <input
        type="text"
        value={localInput}
        onChange={handleChange}
        placeholder="Search issues, keywords, #hashtags…"
        className="w-full rounded-full border border-[#FFC37B]/80 bg-white/95 py-2 pl-9 pr-9 font-poppins text-xs text-[#212121] placeholder-[#8b8e8d] shadow-sm transition-all focus:border-[#F49B31] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F49B31]/20"
      />
      {localInput && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-[#8b8e8d] hover:text-[#212121] transition-colors p-0.5"
          aria-label="Clear search"
        >
          <FiX className="text-sm" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

