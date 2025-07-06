import { Grid, List, Loader2, Search, X, PackageX } from "lucide-react";
import MedicineCard from "../pharamcieslist/pharmaStoreView/MedicineCard";
import Pagination from "../../components/medicine/Pagination";

const DEFAULT_MEDICINE_IMAGE = "/defaultMedicineImage.png";

const ProductList = ({
  products = [],
  viewMode,
  toggleViewMode,
  loading,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  searchQuery,
  onSearchChange,
  onClearSearch,
  isSearchLoading,
  sortField,
  sortDirection,
  toggleSort,
  selectedLetter,
  onLetterClick,
}) => {
  const itemsPerPage = 12;

  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1 text-blue-600">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const SkeletonCard = () => (
    <div className="bg-gray-100 rounded-lg p-4 animate-pulse w-full max-w-[280px] mx-auto">
      <div className="h-32 sm:h-40 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] w-full">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden">
      <div className="bg-white/80 backdrop-blur-sm p-1 sm:p-2 lg:p-4 rounded-xl shadow-sm border border-gray-100 flex-grow">
        {/* Sort buttons and view mode toggle */}
        <div className="bg-white px-1 sm:px-2 py-2 sm:py-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                Sort by:
              </span>
              {["brand_name", "generic_name", "price", "stock"].map((field) => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={`px-1 sm:px-2 py-1 rounded-md text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap ${
                    sortField === field
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {field.replace("_", " ")} {getSortIndicator(field)}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => toggleViewMode("grid")}
                className={`p-1 sm:p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                aria-label="Grid view"
              >
                <Grid
                  size={16}
                  strokeWidth={viewMode === "grid" ? 2.5 : 2}
                  className="sm:w-18 sm:h-18"
                />
              </button>
              <button
                onClick={() => toggleViewMode("list")}
                className={`p-1 sm:p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                aria-label="List view"
              >
                <List
                  size={16}
                  strokeWidth={viewMode === "list" ? 2.5 : 2}
                  className="sm:w-18 sm:h-18"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Letter filter */}
        <div className="bg-white px-1 sm:px-2 py-2 border-b">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 overflow-x-auto">
            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
              Filter by letter:
            </span>
            {selectedLetter && (
              <button
                onClick={onClearSearch}
                className="px-1 sm:px-2 py-1 rounded-md text-xs sm:text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition whitespace-nowrap"
              >
                Clear Filter
              </button>
            )}
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
              <button
                key={letter}
                onClick={() => onLetterClick(letter)}
                className={`px-1 sm:px-2 py-1 rounded-md text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap ${
                  selectedLetter === letter
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-white px-1 sm:px-2 py-2 sm:py-3 border-b">
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-1 sm:pl-2 flex items-center pointer-events-none">
              <Search className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by brand, generic, or chemical name..."
              className="block w-full pl-6 sm:pl-8 pr-6 sm:pr-8 py-1 sm:py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
              value={searchQuery}
              onChange={onSearchChange}
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="absolute inset-y-0 right-0 pr-1 sm:pr-2 flex items-center"
                aria-label="Clear search"
              >
                <X className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            {isSearchLoading && (
              <div className="absolute inset-y-0 right-0 pr-6 sm:pr-8 flex items-center pointer-events-none">
                <div className="animate-spin w-3 sm:w-4 h-3 sm:h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* Product grid/list */}
        {products.length === 0 && !loading ? (
          <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center bg-white rounded-xl w-full">
            <div className="text-center p-4 sm:p-8 max-w-md">
              <PackageX className="w-16 sm:w-20 h-16 sm:h-20 mx-auto text-gray-300 mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                {searchQuery || selectedLetter
                  ? "No matching medicines found"
                  : "No medicines available"}
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                {searchQuery || selectedLetter
                  ? "Try a different search term or filter"
                  : "This pharmacy has no medicines listed"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full mx-auto">
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 justify-items-center"
                        : "flex flex-col gap-4 sm:gap-6"
                    }
                  >

                {loading
                  ? Array.from({ length: itemsPerPage }).map((_, index) => (
                      <SkeletonCard key={index} />
                    ))
                  : products.map((product) => {
                      const medicine = {
                        id: product.id || product.FLAVOUR,
                        brand_name: product.brand_name || product.name || "Unknown",
                        generic_name: product.generic_name || product.description || "",
                        chemical_name: product.chemical_name || "",
                        description: product.description || "",
                        atc_code: product.atc_code || "",
                        cas_number: product.cas_number || "",
                        price: Number(product.price) || 0,
                        stock: Number(product.stock) || 0,
                        image: product.image || DEFAULT_MEDICINE_IMAGE,
                      };

                      return (
                        <div
                          key={product.id || product.FLAVOUR}
                          className={
                            viewMode === "grid"
                              ? "w-full min-w-0 max-w-[280px]"
                              : "border-b border-gray-100 last:border-b-0 pb-2 sm:pb-4 last:pb-0"
                          }
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MedicineCard
                            medicine={medicine}
                            viewMode={viewMode}
                            isReadOnly={true}
                          />
                        </div>
                      );
                    })}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="mt-4 sm:mt-6 lg:mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;