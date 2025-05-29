import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPharmacies } from '../features/pharmacyslice';
import PharmacyCard from '../components/shared/Pharmacycard';
import {
  ExclamationTriangleIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';

const PharmacyList = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.pharmacy);

  useEffect(() => {
    dispatch(fetchPharmacies());
  }, [dispatch]);

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
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Failed to load data</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <header className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <BuildingStorefrontIcon className="h-8 w-8 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nearby Pharmacies</h1>
              <p className="text-sm text-gray-500">Find pharmacies and medical suppliers in your area</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {data.length} {data.length === 1 ? 'Location' : 'Locations'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {data.length === 0 ? (
          <div className="text-center py-16 rounded-xl bg-gray-50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
              <BuildingStorefrontIcon className="h-8 w-8 text-gray-500" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No Pharmacies Found</h3>
            <p className="mt-2 text-sm text-gray-600">Try adjusting your search or location settings.</p>
            <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Refresh Locations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((pharmacy) => (
              <PharmacyCard key={pharmacy.store_id} pharmacy={pharmacy} />
            ))}
          </div>
        )}
      </main>

      {/* Footer Note */}
      {data.length > 0 && (
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-1">Contact us if you notice any incorrect information</p>
        </footer>
      )}
    </div>
  );
};

export default PharmacyList;
