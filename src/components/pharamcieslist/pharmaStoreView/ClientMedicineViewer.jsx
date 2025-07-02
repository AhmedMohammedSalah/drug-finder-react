import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import MedicineCard from './MedicineCard';
import { PackageX, Search, X } from 'lucide-react';
import Pagination from '../Pagination';
import { debounce } from 'lodash';
import apiEndpoints from '../../../services/api';

const ClientMedicineViewer = ({ storeId }) => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('brand_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const itemsPerPage = 12;

  const cancelTokenSource = useRef(null);

  const fetchMedicines = useCallback(
    debounce(async (page, query, sortBy, sortOrder, startsWith = null) => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel('New request triggered');
      }
      cancelTokenSource.current = axios.CancelToken.source();

      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          page_size: itemsPerPage,
          ordering: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
        };

        if (query) params.search = query;
        if (startsWith) params.brand_startswith = startsWith;

        const res = await apiEndpoints.pharmacies.getMedicinesForStore(storeId, params);

        setMedicines(res.results || []);
        setTotalItems(res.count || 0);
        setTotalPages(Math.ceil((res.count || 0) / itemsPerPage));
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Failed to fetch medicines', err);
          setError('Failed to load medicines. Please try again.');
        }
      } finally {
        setLoading(false);
        setIsSearchLoading(false);
      }
    }, 150),
    [storeId, itemsPerPage]
  );

  useEffect(() => {
    fetchMedicines(currentPage, searchQuery, sortField, sortDirection, selectedLetter);
    return () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel('Component unmounted');
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
    setSearchQuery('');
    setIsSearchLoading(true);
    setCurrentPage(1);
    setSelectedLetter(null);
  };

  const handleLetterClick = (letter) => {
    setSearchQuery('');
    setSelectedLetter(letter);
    setCurrentPage(1);
    fetchMedicines(1, '', sortField, sortDirection, letter);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1 text-blue-600">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const SkeletonCard = () => (
    <div className="bg-gray-100 rounded-lg p-3 animate-pulse">
      <div className="h-32 bg-gray-200 rounded mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
    <div className="mt-4 md:mt-6 lg:mt-8 bg-white border rounded-lg lg:rounded-xl overflow-hidden">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="bg-blue-600 px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Medicine Inventory</h2>
          {totalItems > 0 && (
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} medicines
            </p>
          )}
        </div>

        {/* Sort Controls */}
        <div className="bg-white px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 border-b">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-gray-600 whitespace-nowrap">Sort:</span>
            {['brand_name', 'generic_name', 'price', 'stock'].map((field) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`px-2 py-1 rounded-md text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap ${
                  sortField === field
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {field.replace('_', ' ')} {getSortIndicator(field)}
              </button>
            ))}
          </div>
        </div>

        {/* Alphabet Filter */}
        <div className="bg-white px-2 py-1 sm:px-3 sm:py-2 border-b">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            <span className="text-xs text-gray-600 whitespace-nowrap">Letters:</span>
            {selectedLetter && (
              <button
                onClick={handleClearSearch}
                className="px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition whitespace-nowrap"
              >
                Clear
              </button>
            )}
            <div className="flex gap-0.5">
              {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className={`px-1.5 py-0.5 rounded text-xs flex items-center ${
                    selectedLetter === letter
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white px-3 py-2 sm:px-4 sm:py-3 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search medicines..."
              className="block w-full pl-8 pr-8 py-1 sm:py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-2 flex items-center"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            {isSearchLoading && (
              <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
                <div className="animate-spin w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medicine Grid */}
      <div className="p-2 sm:p-3 md:p-4 lg:p-6">
        {error && (
          <div className="text-center text-red-500 py-3 sm:py-4">
            {error}
          </div>
        )}

        {medicines.length === 0 && !loading ? (
          <div className="text-center text-gray-500 py-6 sm:py-8 md:py-10 lg:py-12">
            <PackageX className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto text-gray-300 mb-2 sm:mb-3 md:mb-4" />
            <p className="text-sm sm:text-base md:text-lg font-medium">
              {searchQuery ? 'No matching medicines found' : 'No medicines available'}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {searchQuery ? 'Try a different search term' : 'This pharmacy has no medicines listed'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : (
                medicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    isReadOnly={true}
                    onDeleted={() => {}}
                    onEdit={() => {}}
                  />
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientMedicineViewer;