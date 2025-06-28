import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPharmacies } from '../features/pharmacyslice';
import PharmacyCard from '../components/shared/Pharmacycard';
import SearchInput from '../components/pharamcieslist/SearchInput';
import Pagination from '../components/pharamcieslist/Pagination';
import { BuildingStorefrontIcon, ExclamationTriangleIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom'; // <== Don't forget this!

const PharmacyList = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.pharmacy);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [storeTypeFilter, setStoreTypeFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchPharmacies({ 
      search: searchTerm,  
      page: currentPage,
      store_type: storeTypeFilter !== 'all' ? storeTypeFilter : undefined
    }));
    
  }, [dispatch, searchTerm, currentPage, storeTypeFilter]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (type) => {
    setStoreTypeFilter(type);
    setCurrentPage(1);
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading pharmacy data...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="rounded-xl bg-red-50 p-4 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Failed to load data</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error || 'Something went wrong. Please try again.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <BuildingStorefrontIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Available Pharmacies</h1>
              <p className="text-sm text-gray-500">
                Find pharmacies and medical suppliers in your area
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {data.count || 0} {data.count === 1 ? 'Location' : 'Locations'}
            </span>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput onSearch={handleSearch} />
        </div>
        <div className="relative">
          <button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
            Filter
          </button>
          
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <p className="px-4 py-2 text-sm font-medium text-gray-700 border-b">Store Type</p>
                {['all', 'pharmacy', 'medical_devices', 'both'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange(type)}
                    className={`block w-full text-left px-4 py-2 text-sm ${storeTypeFilter === type ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {type === 'all' ? 'All Stores' : type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <main>
        {data.results?.length === 0 ? (
          <div className="text-center py-16 rounded-xl bg-gray-50 mt-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <BuildingStorefrontIcon className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No Pharmacies Found</h3>
            <p className="mt-2 text-sm text-gray-600">
              Try adjusting your search or filter settings.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {/* FIRST BLUE CARD */}
              <Link
                to="/client/PharmacyPage" // <-- Change this to your desired route
                className="flex flex-col items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-center h-[450px] transition duration-300 shadow"
              >
                <div className='w-[250px] mb-10'>
                  <img src='/happyDoctorHaveAllMedicine.PNG' alt='all Medicines image'/>
                </div>
                <span className="text-lg font-semibold">View All Medicines</span>
              </Link>

              {/* ACTUAL PHARMACIES */}
              {data.results?.map((pharmacy) => (
                <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(data.count / 10)}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default PharmacyList;
