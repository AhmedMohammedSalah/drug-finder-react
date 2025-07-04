import React from 'react';
import useStoreForm from '../../hooks/useStoreForm';
import MapSection from '../../components/pharamcieslist/pharamStoreCreation/MapSection';
import ProfileImageSection from '../../components/pharamcieslist/pharamStoreCreation/ProfileImageSection';
import InputSection from '../../components/pharamcieslist/pharamStoreCreation/InputSection';
import MapLoadingOverlay from '../../components/pharamcieslist/pharamStoreCreation/MapLoadingOverlay';
import { Pencil } from 'lucide-react';
import MedicineManager from "../../components/medicine/MedicineManager";
import PendingLicenseCard from '../../components/medicine/PendingLicenseCard'; 
import { RejectedLicenseCard } from '../../components/medicine/RejectionLicenseCard';
import AdminLoader from '../../components/admin/adminLoader';

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
    licenseStatus,
  } = useStoreForm();

  const canEdit = isEditMode || !hasStore;

  if (hasStore && isLoading) {
    return (
      <AdminLoader loading={isLoading} error={null} loadingMessage="Loading store data..." />
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
        {/* Main Profile Card */}
        <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {mapLoading && <MapLoadingOverlay />}

          <div className="p-4 sm:p-6">
            {/* Edit Button */}
            {hasStore && !isEditMode && (
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  aria-label="Edit profile"
                >
                  <Pencil size={18} />
                  <span className="text-sm font-medium">Edit</span>
                </button>
              </div>
            )}

            {/* Profile Content */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column - Profile Info */}
              <div className="space-y-6 w-full min-w-0">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  <div className="w-full sm:w-40 mx-auto sm:mx-0">
                    <ProfileImageSection
                      logoImage={logoImage}
                      setLogoImage={canEdit ? setLogoImage : undefined}
                    />
                  </div>

                  <div className="flex-1 w-full min-w-0">
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

              {/* Right Column - Map */}
              <div className="h-[300px] sm:h-[350px] md:h-[400px] xl:h-full rounded-lg overflow-hidden border border-gray-200 min-w-0">
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

            {/* Submit Button */}
            {canEdit && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {hasStore ? 'Updating...' : 'Saving...'}
                    </span>
                  ) : hasStore ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* License Status Section */}
        {hasStore && !isEditMode && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-4 sm:p-6 w-full">
            {licenseStatus === 'approved' ? (
              <div className="w-full overflow-x-hidden">
                <MedicineManager />
              </div>
            ) : licenseStatus === 'pending' ? (
              <PendingLicenseCard />
            ) : licenseStatus === 'rejected' ? (
              <RejectedLicenseCard 
                adminMessage="Your license was rejected due to incomplete documentation. Please submit your professional certification."
                appealLink="/pharmacy/profile/"
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No license information available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreProfileForm;