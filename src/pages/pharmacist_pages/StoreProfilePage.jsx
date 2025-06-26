import React from 'react';
import useStoreForm from '../../hooks/useStoreForm';
import MapSection from '../../components/pharamcieslist/pharamStoreCreation/MapSection';
import ProfileImageSection from '../../components/pharamcieslist/pharamStoreCreation/ProfileImageSection';
import InputSection from '../../components/pharamcieslist/pharamStoreCreation/InputSection';
import MapLoadingOverlay from '../../components/pharamcieslist/pharamStoreCreation/MapLoadingOverlay';
import { Pencil } from 'lucide-react';
import MedicineManager from "../../components/medicine/MedicineManager";


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
    errors,
    isEditMode,
    setIsEditMode,
    hasStore,
    startTime, setStartTime,
    endTime, setEndTime,
    isLoading,
    licenseStatus, // for approval logic
  } = useStoreForm();

  const canEdit = isEditMode || !hasStore;

  if (hasStore && isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        <span className="ml-4 text-lg">Loading store data...</span>
      </div>
    );
  }

  return (

    <>
      <div className="relative z-0 p-6 max-w-7xl mx-auto border rounded-2xl bg-white">
        {mapLoading && <MapLoadingOverlay />}

        {hasStore && !isEditMode && (
          <div className="text-right">
            <button
              onClick={() => setIsEditMode(true)}
              className="text-blue-500 flex items-center gap-1 hover:underline"
            >
              <Pencil size={18} />
            </button>
          </div>
        )}

        {/* Two-column layout with equal width */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="flex flex-col h-full">
            <div className="flex gap-4 items-start">
              {/* LOGO */}
              <div className="w-40 flex-shrink-0">
                <ProfileImageSection
                  logoImage={logoImage}
                  setLogoImage={canEdit ? setLogoImage : undefined}
                />
              </div>

              {/* INPUT FIELDS */}
              <div className="flex-1 overflow-hidden">
                <InputSection
                  isSubmitted={!canEdit}
                  storeName={storeName}
                  setStoreName={canEdit ? setStoreName : undefined}
                  address={address}
                  setAddress={canEdit ? setAddress : undefined}
                  phone={phone}
                  setPhone={canEdit ? setPhone : undefined}
                  description={description}
                  setDescription={canEdit ? setDescription : undefined}
                  startTime={startTime}
                  setStartTime={canEdit ? setStartTime : undefined}
                  endTime={endTime}
                  setEndTime={canEdit ? setEndTime : undefined}
                  errors={errors}
                  isReadOnly={!canEdit}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="h-full">
            <MapSection
              latLng={latLng}
              setLatLng={canEdit ? setLatLng : () => {}}
              handleLatChange={canEdit ? handleLatChange : () => {}}
              handleLngChange={canEdit ? handleLngChange : () => {}}
              showMapModal={showMapModal}
              setShowMapModal={canEdit ? setShowMapModal : () => {}}
              canEdit={canEdit}
            />
          </div>
        </div>

        {/* BUTTON */}
        {canEdit && (
          <div className="text-right mt-6">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : hasStore ? 'Update' : 'Save'}
            </button>
          </div>
        )}
      </div>

        {/* medciinse manager */}


      {hasStore && !isEditMode && licenseStatus === 'approved' && (
      <div  className="max-w-7xl mx-auto">
        <MedicineManager />
      </div>)}


    </>
  );
};

export default StoreProfileForm;
