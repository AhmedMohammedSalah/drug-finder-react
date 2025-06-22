// src/components/pharamcieslist/SearchInput.jsx
import React, { useState } from 'react';

const SearchInput = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <input
      type="text"
      className="w-full px-4 py-2 border rounded-md"
      placeholder="Search pharmacies..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

export default SearchInput;
