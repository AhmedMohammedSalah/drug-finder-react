import React, { useEffect, useState, useCallback, useRef } from "react";
import apiEndpoints from "../../services/api";
import MedicineCard from "./MedicineCard";
import { PlusCircle, PackageX, Search, X } from "lucide-react";
import AddMedicineModal from "./AddMedicineModal";
import Pagination from "./Pagination";
import { debounce } from "lodash";
import axios from "axios";

const MedicineManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("brand_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  const cancelTokenSource = useRef(null);

  // Fetch data with debounced search
  const fetchMedicines = useCallback(
    debounce(async (page, query, sortBy, sortOrder, startsWith = null) => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("New request triggered");
      }
      cancelTokenSource.current = axios.CancelToken.source();

      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          page_size: itemsPerPage,
          ordering: `${sortOrder === "desc" ? "-" : ""}${sortBy}`,
        };

        if (query) params.search = query;
        if (startsWith) params.brand_startswith = startsWith;

        const res = await apiEndpoints.inventory.getMedicines({
          params,
          cancelToken: cancelTokenSource.current.token,
        });

        setMedicines(res.data.results || []);
        setTotalItems(res.data.count || 0);
        setTotalPages(Math.ceil((res.data.count || 0) / itemsPerPage));
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Failed to fetch medicines", err);
          setError("Failed to load medicines. Please try again.");
        }
      } finally {
        setLoading(false);
        setIsSearchLoading(false);
      }
    }, 150),
    []
  );

  useEffect(() => {
    const fetchStoreId = async () => {
      try {
        const pharmacistRes = await apiEndpoints.users.getPharmacistProfile();
        const storeId = pharmacistRes.data?.medical_stores_data?.id || null;
        setStoreId(storeId);
      } catch (err) {
        console.error("Failed to fetch store ID", err);
        setStoreId(null);
      }
    };

    fetchStoreId();
  }, []);

  useEffect(() => {
    fetchMedicines(currentPage, searchQuery, sortField, sortDirection, selectedLetter);
    return () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("Component unmounted");
      }
    };
  }, [currentPage, searchQuery, sortField, sortDirection, fetchMedicines, selectedLetter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setLoading(true);
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearchLoading(true);
    setCurrentPage(1);
    setSelectedLetter(null);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchLoading(true);
    setCurrentPage(1);
    setSelectedLetter(null);
  };

  const handleLetterClick = (letter) => {
    setSearchQuery("");
    setSelectedLetter(letter);
    setCurrentPage(1);
    fetchMedicines(1, "", sortField, sortDirection, letter);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1 text-blue-600">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-gray-100 rounded-lg p-3 sm:p-4 animate-pulse min-w-[150px]">
      <div className="h-36 sm:h-40 bg-gray-200 rounded mb-3 sm:mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  if (loading && medicines.length === 0) {
    return (
      <div className="flex justify-center items-center py-8 text-gray-600">
        <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mr-2" />
        <span>Loading medicines...</span>
      </div>
    );
  }

  return (
  <div className="mx-auto w-full max-w-full scroll-smooth">
        <div className="mt-4 sm:mt-8 bg-white border rounded-lg sm:rounded-xl overflow-hidden">
        {/* Sticky Header Container */}
        <div className="sticky top-0 z-10 bg-white shadow-md">
          {/* Blue Header Section */}
          <div className="bg-blue-600 px-3 sm:px-4 py-3 sm:py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 sm:gap-4">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white truncate">Medicine Inventory</h2>
              {totalItems > 0 && (
                <p className="text-blue-100 text-xs sm:text-sm mt-1 truncate">
                  Showing {(currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} medicines
                </p>
              )}
            </div>

            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full md:w-auto">
              <div className="relative w-full xs:w-48 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
                {isSearchLoading && (
                  <div className="absolute inset-y-0 right-0 pr-8 sm:pr-10 flex items-center pointer-events-none">
                    <div className="animate-spin w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setEditingMedicine(null);
                  setShowModal(true);
                }}
                className="bg-white text-blue-600 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg hover:bg-blue-50 inline-flex items-center justify-center gap-1 sm:gap-2 transition-colors duration-200 text-xs sm:text-sm min-h-[44px]"
              >
                <PlusCircle size={14} className="sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Add Medicine</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Sorting controls */}
          <div className="bg-white px-3 sm:px-4 py-2 sm:py-3 border-b">
            <div className="flex items-center gap-2 flex-wrap pb-1 scrollbar-hide">
              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap flex-shrink-0">Sort by:</span>
              {["brand_name", "generic_name", "price", "stock"].map((field) => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={`px-2 py-1 rounded text-xs sm:text-sm flex-shrink-0 flex items-center gap-1 whitespace-nowrap min-h-[36px] ${
                    sortField === field
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {field.replace("_", " ")} {getSortIndicator(field)}
                </button>
              ))}
            </div>
          </div>

          {/* Alphabet filter row */}
          <div className="bg-white px-3 sm:px-4 py-1 sm:py-2 border-b">
            <div className="flex items-center gap-1 flex-wrap overflow-x-auto pb-1 scrollbar-hide">
              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap flex-shrink-0">Filter:</span>
              {selectedLetter && (
                <button
                  onClick={() => handleClearSearch()}
                  className="px-2 py-0.5 rounded text-xs sm:text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition whitespace-nowrap flex-shrink-0 min-h-[36px]"
                >
                  Clear
                </button>
              )}
              <div className="flex gap-1 flex-wrap">
                {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    className={`px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs md:text-sm flex-shrink-0 flex items-center gap-1 whitespace-nowrap min-h-[36px] ${
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
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 sm:p-4">
          {error && (
            <div className="text-center text-red-500 py-2 sm:py-3 text-xs sm:text-sm">{error}</div>
          )}
          {medicines.length === 0 && !loading ? (
            <div className="text-center text-gray-500 py-8 sm:py-12">
              <PackageX className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-medium">
                {searchQuery ? "No matching medicines found" : "No medicines found"}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Start by adding your first medicine"}
              </p>
              <button
                onClick={() => {
                  setEditingMedicine(null);
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg hover:bg-blue-700 inline-flex items-center gap-1 sm:gap-2 transition-colors duration-200 text-xs sm:text-sm min-h-[44px]"
              >
                <PlusCircle size={14} className="sm:w-5 sm:h-5" />
                Add Medicine
              </button>
            </div>
          ) : (
            <>
              {/* Medicine grid */}
              <div className="
                grid 
                grid-cols-1           // base: <598px
                bp598:grid-cols-2     // 598px–892px
                bp893:grid-cols-3     // 893px–1409px
                bp1410:grid-cols-4    // ≥1410px
                gap-4 
                justify-items-center
              ">


                {loading ? (
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                ) : (
                  medicines.map((medicine) => (
                    <MedicineCard
                      key={medicine.id}
                      medicine={medicine}
                      onDeleted={() => {
                        setMedicines((prev) => prev.filter((m) => m.id !== medicine.id));
                        setTotalItems((prev) => prev - 1);
                        setTotalPages(Math.ceil((totalItems - 1) / itemsPerPage));
                        if (medicines.length === 1 && currentPage > 1) {
                          setCurrentPage((prev) => prev - 1);
                        }
                      }}
                      onEdit={(medicine) => {
                        setEditingMedicine(medicine);
                        setShowModal(true);
                      }}
                    />
                  ))
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-4 sm:mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}

          {/* Add/Edit Medicine Modal */}
          {showModal && (
            <AddMedicineModal
              storeId={storeId}
              initialData={editingMedicine}
              onClose={() => {
                setShowModal(false);
                setEditingMedicine(null);
              }}
              onSuccess={(savedMedicine) => {
                if (editingMedicine) {
                  setMedicines((prev) =>
                    prev.map((m) => (m.id === savedMedicine.id ? savedMedicine : m))
                  );
                } else {
                  setCurrentPage(1);
                  setTotalItems((prev) => prev + 1);
                  setTotalPages(Math.ceil((totalItems + 1) / itemsPerPage));
                  fetchMedicines(1, searchQuery, sortField, sortDirection);
                }
                setShowModal(false);
                setEditingMedicine(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineManager;