import { useEffect } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, onSearching }) => {

  useEffect(() => {
    if (!onSearching) return; // ✅ safe check

    if (value.trim().length > 0) {
      onSearching(true);

      const timer = setTimeout(() => {
        onSearching(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      onSearching(false);
    }
  }, [value, onSearching]);

  return (
    <div className="search-glow rounded-xl max-w-2xl mx-auto">
      <div className="relative flex items-center rounded-xl overflow-hidden bg-card">
        
        <Search size={18} className="absolute left-4 text-muted-foreground" />

        <input
          type="text"
          placeholder="Search by name, role, or skill..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full py-3.5 pl-11 pr-4 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
        />
      </div>
    </div>
  );
};

export default SearchBar;