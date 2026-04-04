import React from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search candidates...",
}) => {
  return (
    <div className="relative w-full group">
      
      {/* Input */}
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full rounded-2xl 
          bg-white/80 backdrop-blur-md
          border border-slate-200
          py-3 pl-12 pr-10 text-sm text-slate-700
          shadow-sm
          outline-none
          transition-all duration-300

          placeholder:text-slate-400

          focus:border-primary
          focus:ring-2 focus:ring-primary/30
          focus:shadow-md

          group-hover:border-slate-300
        "
      />

      {/* Search Icon */}
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-slate-400 hover:text-red-500
            transition-colors
          "
        >
          <X size={16} />
        </button>
      )}

      {/* Glow Effect */}
      <div className="
        pointer-events-none absolute inset-0 rounded-2xl
        opacity-0 group-focus-within:opacity-100
        transition duration-300
        bg-gradient-to-r from-primary/10 to-transparent
      " />
    </div>
  );
};

export default SearchBar;