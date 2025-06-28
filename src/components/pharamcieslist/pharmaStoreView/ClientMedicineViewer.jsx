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
  
        console.log('Fetched medicines:', res);
  
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
    <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
      <div className="h-40 bg-gray-200 rounded mb-4"></div>
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
    <div className="mt-8 bg-white border rounded-xl overflow-hidden">
      <div className="sticky top-0 z-10 bg-white">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-2xl font-semibold text-white">Medicine Inventory</h2>
          {totalItems > 0 && (
            <p className="text-blue-100 text-sm mt-1">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} medicines
            </p>
          )}
        </div>

        <div className="bg-white px-6 py-4 border-b">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
            {['brand_name', 'generic_name', 'price', 'stock'].map((field) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 whitespace-nowrap ${
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

        <div className="bg-white px-6 py-2 border-b">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">Filter by letter:</span>
            {selectedLetter && (
              <button
                onClick={handleClearSearch}
                className="px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition whitespace-nowrap"
              >
                Clear Filter
              </button>
            )}
            {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`px-2 py-1 rounded-md text-sm flex items-center gap-1 whitespace-nowrap ${
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

        <div className="bg-white px-6 py-4 border-b">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by brand, generic, or chemical name..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
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
      </div>

      <div className="p-6">
        {error && <div className="text-center text-red-500 py-4">{error}</div>}
        {medicines.length === 0 && !loading ? (
          <div className="text-center text-gray-500 py-12">
            <PackageX className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium">
              {searchQuery ? 'No matching medicines found' : 'No medicines available'}
            </p>
            <p className="text-sm text-gray-400">
              {searchQuery ? 'Try a different search term' : 'This pharmacy has no medicines listed'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                    onDeleted={() => {}} // No-op
                    onEdit={() => {}} // No-op
                  />
                ))
              )}
            </div>
            {totalPages > 1 && (
              <div className="mt-6">
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