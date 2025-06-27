import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const MAX_VISIBLE_PAGES = 5;

  const getPageNumbers = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pages = [];
    const leftBound = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    const rightBound = Math.min(totalPages, leftBound + MAX_VISIBLE_PAGES - 1);

    if (leftBound > 1) {
      pages.push(1);
      if (leftBound > 2) {
        pages.push("...");
      }
    }

    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    if (rightBound < totalPages) {
      if (rightBound < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"}`}
      >
        <ChevronLeft size={20} />
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-md ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : typeof page === "number"
              ? "text-blue-600 hover:bg-blue-50"
              : "text-gray-500 cursor-default"
          }`}
          disabled={page === "..." || page === currentPage}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50"}`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;