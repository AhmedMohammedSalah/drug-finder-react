import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProfileImageSection from '../../components/pharamcieslist/pharamStoreCreation/ProfileImageSection';
import InputSection from '../../components/pharamcieslist/pharamStoreCreation/InputSection';
import MapSection from '../../components/pharamcieslist/pharamStoreCreation/MapSection';
import ClientMedicineViewer from '../../components/pharamcieslist/pharmaStoreView/ClientMedicineViewer';
import apiEndpoints, { api } from '../../services/api';
import { store } from '../../app/store';

const ClientStoreProfile = () => {
  const { storeId } = useParams(); // Get store ID from URL
  const [storeData, setStoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching store data for ID:', storeId);
        const response = await apiEndpoints.pharmacies.getStoreById(storeId);

        console.log('Fetched store data:', response.data);

        setStoreData(response.data);
      } catch (err) {
        console.error('Failed to fetch store data', err);
        setError('Failed to load store data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        <span className="ml-4 text-lg">Loading store data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] text-red-500">
        <span>{error}</span>
      </div>
    );
  }

  const {
    logo_image: logoImage,
    name: storeName,
    address,
    phone,
    description,
    latitude: lat,
    longitude: lng,
    start_time: startTime,
    end_time: endTime,
    license_status: licenseStatus,
  } = storeData || {};

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Big Breadcrumb Navigation */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/client/pharmacies"
                className="inline-flex items-center text-lg font-medium text-gray-700 hover:text-blue-600"
              >
                <span>Pharmacies</span>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400 mx-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-1 text-lg font-medium text-gray-500 md:ml-2">
                  {storeData?.store_name || 'Store Details'}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="border rounded-2xl bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <div className="flex flex-col h-full">
            <div className="flex gap-4 items-start">
              <div className="w-40 flex-shrink-0">
                <ProfileImageSection logoImage={storeData.store_logo} />
              </div>
              <div className="flex-1 overflow-hidden">
                <InputSection
                  isSubmitted={true} // Always read-only
                  storeName={storeData.store_name}
                  address={storeData.store_address}
                  phone={phone}
                  description={description}
                  startTime={startTime}
                  endTime={endTime}
                  isReadOnly={true}
                />
              </div>
            </div>
          </div>
          <div className="h-full">
            <MapSection
              latLng={{ lat, lng }}
              canEdit={false}
              showMapModal={false}
              setShowMapModal={() => {}} // No-op for read-only
            />
          </div>
        </div>

        {/* Medicine Viewer with Pagination */}
        {storeData && (
          <div className="max-w-7xl mx-auto">
            <ClientMedicineViewer storeId={storeId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientStoreProfile;