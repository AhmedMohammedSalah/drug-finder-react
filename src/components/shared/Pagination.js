{/* [OKS *0-0*]  pagination >*/}

const Pagination = ({ page, totalPages, changePage }) => (
  <div className="flex justify-center mt-6">
    <button
      onClick={() => changePage(page - 1)}
      disabled={page === 1}
      className="px-3 py-1 border border hover:bg-blue-500  rounded mx-1"
    >
      Previous
    </button>
    {[...Array(totalPages).keys()].map((_, idx) => (
      <button
        key={idx}
        onClick={() => changePage(idx + 1)}
        className={`px-3 py-1 border hover:bg-blue-500  border border-blue-500 rounded mx-1 ${page === idx + 1 ? "bg-blue-500 text-white" : ""}`}
      >
        {idx + 1}
      </button>
    ))}
    <button
      onClick={() => changePage(page + 1)}
      disabled={page === totalPages}
      className="px-3 py-1 border hover:bg-blue-500 rounded mx-1"
    >
      Next
    </button>
  </div>
);
export default Pagination;
