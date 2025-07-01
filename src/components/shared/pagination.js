import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// [SARA] : Shared Pagination component for admin pages

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex gap-2 items-center flex-wrap justify-center my-4 sm:my-8 w-full">
      <div className="flex gap-2 items-center flex-wrap justify-center mx-auto w-fit bg-white bg-opacity-90 rounded-xl shadow-lg px-4 sm:px-6 py-2 sm:py-3 border border-blue-200 z-40">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
        >
          <ChevronLeft className="inline-block w-4 h-4 mr-1" /> Previous
        </button>
        {/* Page number buttons (show max 5 at a time) */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          if (pageNum < 1 || pageNum > totalPages) return null;
          return (
            <button
              key={pageNum}
              className={`px-3 py-1 rounded-lg border font-semibold transition ${pageNum === currentPage ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'}`}
              onClick={() => onPageChange(pageNum)}
              disabled={pageNum === currentPage}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next <ChevronRight className="inline-block w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
