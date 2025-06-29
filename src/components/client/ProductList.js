import { Grid, List, Loader2, Search, X, PackageX } from "lucide-react";
import MedicineCard from "../pharamcieslist/pharmaStoreView/MedicineCard";
import Pagination from "../../components/medicine/Pagination";

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
    <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
      <div className="h-40 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-4 rounded-xl shadow-sm border border-gray-100">
        {/* Sort buttons and view mode toggle */}
        <div className="bg-white px-4 py-3 border-b">
          <div className="flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Sort by:
              </span>
              {["brand_name", "generic_name", "price", "stock"].map((field) => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 whitespace-nowrap ${
                    sortField === field
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {field.replace("_", " ")} {getSortIndicator(field)}
                </button>
              ))}
            </div>
            {/* View mode toggle */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => toggleViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                aria-label="Grid view"
              >
                <Grid size={18} strokeWidth={viewMode === "grid" ? 2.5 : 2} />
              </button>
              <button
                onClick={() => toggleViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                aria-label="List view"
              >
                <List size={18} strokeWidth={viewMode === "list" ? 2.5 : 2} />
              </button>
            </div>
          </div>
        </div>

        {/* Letter filter */}
        <div className="bg-white px-4 py-2 border-b">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Filter by letter:
            </span>
            {selectedLetter && (
              <button
                onClick={onClearSearch}
                className="px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition whitespace-nowrap"
              >
                Clear Filter
              </button>
            )}
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
              <button
                key={letter}
                onClick={() => onLetterClick(letter)}
                className={`px-2 py-1 rounded-md text-sm flex items-center gap-1 whitespace-nowrap ${
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
        <div className="bg-white px-4 py-3 border-b">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by brand, generic, or chemical name..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={onSearchChange}
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            {isSearchLoading && (
              <div className="absolute inset-y-0 right-0 pr-10 flex items-center pointer-events-none">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* Product grid/list */}
        {products.length === 0 && !loading ? (
          <div className="min-h-[300px] flex items-center justify-center bg-white rounded-xl">
            <div className="text-center p-8 max-w-md">
              <PackageX className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {searchQuery || selectedLetter
                  ? "No matching medicines found"
                  : "No medicines available"}
              </h3>
              <p className="text-gray-500">
                {searchQuery || selectedLetter
                  ? "Try a different search term or filter"
                  : "This pharmacy has no medicines listed"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-4"
              }
            >
              {loading
                ? Array.from({ length: itemsPerPage }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                : products.map((product) => {
                    const medicine = {
                      ...product,
                      brand_name: product.name || product.brand_name,
                      generic_name:
                        product.description || product.generic_name || "",
                      id: product.id,
                      price: product.price,
                      stock: product.stock || 0,
                      image: product.image || "/placeholder.png",
                    };

                    return (
                      <div
                        key={product.id}
                        className={
                          viewMode === "grid"
                            ? "transform transition-all hover:-translate-y-1 hover:shadow-md"
                            : "border-b border-gray-100 last:border-b-0 pb-4 last:pb-0"
                        }
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
            {totalPages > 1 && (
              <div className="mt-4">
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
