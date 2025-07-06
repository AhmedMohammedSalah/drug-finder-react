{/* [OKS *0-0*]  pagination >*/}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-1 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200
          ${currentPage === 1 
            ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
            : 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 active:bg-blue-100'
          }
        `}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || page === currentPage}
            className={`
              flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg border font-medium text-sm transition-all duration-200
              ${page === currentPage
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : page === '...'
                ? 'border-transparent text-gray-500 cursor-default'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100'
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200
          ${currentPage === totalPages 
            ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
            : 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 active:bg-blue-100'
          }
        `}
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
