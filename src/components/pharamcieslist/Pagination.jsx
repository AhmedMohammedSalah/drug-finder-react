// src/components/pharamcieslist/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (!Number.isFinite(totalPages) || totalPages < 1) {
    return null; // hide if totalPages is invalid
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-8 space-x-2">
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded ${
            page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
