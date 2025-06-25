import React from 'react';
import useStoreForm from '../../hooks/useStoreForm';
import LocationPicker from '../../components/pharamcieslist/pharamStoreCreation/LocationPicker';
import MapSection from '../../components/pharamcieslist/pharamStoreCreation/MapSection';
import ProfileImageSection from '../../components/pharamcieslist/pharamStoreCreation/ProfileImageSection';
import InputSection from '../../components/pharamcieslist/pharamStoreCreation/InputSection';
import MapLoadingOverlay from '../../components/pharamcieslist/pharamStoreCreation/MapLoadingOverlay';

const StoreProfileForm = () => {
  
  const {
    logoImage, setLogoImage,
    storeName, setStoreName,
    address, setAddress,
    phone, setPhone,
    description, setDescription,
    latLng, setLatLng,
    showMapModal, setShowMapModal,
    isSubmitting, isSubmitted,
    mapLoading,
    handleLatChange,
    handleLngChange,
    handleSubmit,
    errors 
  } = useStoreForm();
  

  return (
    <div className="relative z-0 p-6 max-w-7xl mx-auto border rounded-2xl bg-white">
      {mapLoading && <MapLoadingOverlay />}
      
      <div className="flex flex-col lg:flex-row mt-6 gap-8 items-stretch">
        {!isSubmitted && (
          <ProfileImageSection
            logoImage={logoImage}
            setLogoImage={setLogoImage}
          />
        )}

        <div className="flex-1 space-y-4">
        <InputSection
          isSubmitted={isSubmitted}
          storeName={storeName}
          setStoreName={setStoreName}
          address={address}
          setAddress={setAddress}
          phone={phone}
          setPhone={setPhone}
          description={description}
          setDescription={setDescription}
          errors={errors} 
        />

        </div>

        <MapSection
          latLng={latLng}
          setLatLng={setLatLng}
          handleLatChange={handleLatChange}
          handleLngChange={handleLngChange}
          showMapModal={showMapModal}
          setShowMapModal={setShowMapModal}
        />
      </div>

      {!isSubmitted && (
        <div className="text-right mt-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreProfileForm;
