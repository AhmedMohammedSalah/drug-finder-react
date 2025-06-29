// src/PharmacyPage.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { debounce } from "lodash";
import axios from "axios";
import ProductList from "../components/client/ProductList";
import Toast from "../components/shared/toast";
import apiEndpoints from "../services/api";

const PharmacyPage = ({ storeId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("brand_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const itemsPerPage = 12;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cancelTokenSource = useRef(null);

  const fetchMedicines = useCallback(
    debounce(async (page, query, sortBy, sortOrder, startsWith = null) => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("New request triggered");
      }
      cancelTokenSource.current = axios.CancelToken.source();

      try {
        setLoading(true);
        setErrorMessage("");

        const params = {
          page,
          page_size: itemsPerPage,
          ordering: `${sortOrder === "desc" ? "-" : ""}${sortBy}`,
        };

        if (query) params.search = query;
        if (startsWith) params.brand_startswith = startsWith;

        const res = await apiEndpoints.pharmacies.getMedicinesForStore(
          storeId,
          params
        );

        setProducts(res.results || []);
        setTotalItems(res.count || 0);
        setTotalPages(Math.ceil((res.count || 0) / itemsPerPage));
      } catch (err) {
        if (!axios.isCancel(err)) {
          setErrorMessage(err.message || "Failed to fetch products");
        }
      } finally {
        setLoading(false);
        setIsSearchLoading(false);
      }
    }, 150),
    [storeId, itemsPerPage]
  );
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Close modal when clicking outside content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    fetchMedicines(
      currentPage,
      searchQuery,
      sortField,
      sortDirection,
      selectedLetter
    );
    return () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("Component unmounted");
      }
    };
  }, [
    currentPage,
    searchQuery,
    sortField,
    sortDirection,
    selectedLetter,
    fetchMedicines,
  ]);

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

  return (
    <>
      <ProductList
        products={products}
        viewMode={viewMode}
        toggleViewMode={setViewMode}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        isSearchLoading={isSearchLoading}
        sortField={sortField}
        sortDirection={sortDirection}
        toggleSort={toggleSort}
        selectedLetter={selectedLetter}
        onLetterClick={handleLetterClick}
        onProductClick={handleProductClick}
      />
      {/* Medicine Details Modal */}
      {isModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-gray-100 transition-all"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Medicine Image */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square flex items-center justify-center">
                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.brand_name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    </svg>
                    <span className="mt-2">No image available</span>
                  </div>
                )}
              </div>

              {/* Medicine Details */}
              <div className="py-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedProduct.brand_name}
                </h2>
                <p className="text-xl text-blue-600 font-semibold mb-6">
                  ${selectedProduct.price}
                </p>

                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Generic Name
                    </h3>
                    <p className="text-lg">{selectedProduct.generic_name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Chemical Name
                    </h3>
                    <p className="text-lg">{selectedProduct.chemical_name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Stock
                      </h3>
                      <p
                        className={`text-lg font-medium ${
                          selectedProduct.stock > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedProduct.stock > 0
                          ? `${selectedProduct.stock} units available`
                          : "Out of stock"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        ATC Code
                      </h3>
                      <p className="text-lg">{selectedProduct.atc_code}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        CAS Number
                      </h3>
                      <p className="text-lg">{selectedProduct.cas_number}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Description
                    </h3>
                    <p className="text-gray-700 mt-1">
                      {selectedProduct.description ||
                        "No description available for this medicine."}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3 px-6 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={selectedProduct.stock <= 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast message={errorMessage} />
    </>
  );
};

export default PharmacyPage;
