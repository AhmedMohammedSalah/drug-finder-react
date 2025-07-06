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
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <div className="flex-grow w-full px-1 sm:px-2 lg:px-4 py-4 sm:py-6 lg:py-8">
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
        />
        <Toast message={errorMessage} />
      </div>
    </div>
  );
};

export default PharmacyPage;