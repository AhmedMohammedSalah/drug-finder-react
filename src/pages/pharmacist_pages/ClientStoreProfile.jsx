import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProfileImageSection from '../../components/pharamcieslist/pharamStoreCreation/ProfileImageSection';
import InputSection from '../../components/pharamcieslist/pharamStoreCreation/InputSection';
import MapSection from '../../components/pharamcieslist/pharamStoreCreation/MapSection';
import ClientMedicineViewer from '../../components/pharamcieslist/pharmaStoreView/ClientMedicineViewer';
import apiEndpoints, { api } from '../../services/api';
import { store } from '../../app/store';
import SharedLoadingComponent from '../../components/shared/medicalLoading'; // [SENU] Added import
import AdminLoader from '../../components/admin/adminLoader';

const ClientStoreProfile = () => {
  const { storeId } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        const response = await apiEndpoints.pharmacies.getStoreById(storeId);
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
    return <SharedLoadingComponent 
      loadingText="Loading store details..."
      subText="Fetching pharmacy information..."
      color="blue"
      gif='/storeLoading.gif' // [SENU] Replaced loading spinner
    />; // [SENU] Replaced loading spinner
    return <AdminLoader loading={isLoading} error={error} loadingMessage="Loading store data..." />;
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-sm border">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/client/pharmacies"
                className="inline-flex items-center text-sm sm:text-lg font-medium text-gray-700 hover:text-blue-600"
              >
                <span>Pharmacies</span>
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400 mx-1"
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
                <span className="ml-1 text-sm sm:text-lg font-medium text-gray-500 md:ml-2">
                  {storeData?.store_name || 'Store Details'}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="border rounded-xl sm:rounded-2xl bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-6">
          {/* Profile Section */}
          <div className="flex flex-col h-full">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start">
              <div className="mx-auto sm:mx-0">
                <ProfileImageSection logoImage={storeData.store_logo} />
              </div>
              <div className="flex-1 overflow-hidden w-full">
                <InputSection
                  isSubmitted={true}
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

          {/* Map Section */}
          <div className="h-full min-h-[300px] sm:min-h-[400px]">
            <MapSection
              latLng={{ lat, lng }}
              canEdit={false}
              showMapModal={false}
              setShowMapModal={() => {}}
            />
          </div>
        </div>

        {/* Medicine Viewer */}
        {storeData && (
          <div className="max-w-7xl mx-auto px-2 sm:px-0">
            <ClientMedicineViewer storeId={storeId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientStoreProfile;