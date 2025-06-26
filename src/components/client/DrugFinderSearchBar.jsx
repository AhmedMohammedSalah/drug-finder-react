import React from 'react';
import { Search, Pill } from 'lucide-react';

const DrugFinderSearchBar = ({ 
  value,
  onChange,
  onSubmit,
  placeholder = "Search for medicines...",
  className = ""
}) => {
  return (
    <form 
      onSubmit={onSubmit}
      className={`w-full max-w-2xl mx-auto ${className}`}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Pill className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
          placeholder={placeholder}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <Search className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
        </button>
      </div>
    </form>
  );
};

export default DrugFinderSearchBar;