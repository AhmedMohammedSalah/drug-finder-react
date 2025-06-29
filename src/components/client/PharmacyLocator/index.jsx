import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, RefreshCw,MapPin} from 'lucide-react';
import apiEndpoints from '../../../services/api';
import PharmacyDetails from './PharmacyDetails';
import PharmacyList from './PharmacyList';
import PharmacyMap from './PharmacyMap';
import SearchHeader from './SearchHeader';

const PharmacyLocatorContainer = () => {
  const location = useLocation();
  const [state, setState] = useState({
    userLocation: null,
    mapCenter: null,
    pharmacies: [],
    selectedPharmacy: null,
    loading: true,
    error: null,
    locationError: null,
    mapLoaded: false,
    searchQuery: '',
    isSearching: false,
    searchTerm: '',
    medicines: [],
    medicineLoading: false
  });

  const [showMedicinePopup, setShowMedicinePopup] = useState(false);
  const DEFAULT_LOCATION = { lat: 30.0444, lng: 31.2357 };

  const setDefaultLocation = () => {
    setState(prev => ({
      ...prev,
      userLocation: DEFAULT_LOCATION,
      mapCenter: DEFAULT_LOCATION
    }));
    fetchPharmacies();
  };

  const handleLocationError = (error) => {
    let errorMessage = 'Location access denied. Using default location.';
    
    switch(error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access was denied. Using default location.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable. Using default location.';
        break;
      case error.TIMEOUT:
        errorMessage = 'The request to get location timed out. Using default location.';
        break;
    }
    
    setState(prev => ({
      ...prev,
      locationError: errorMessage
    }));
    setDefaultLocation();
  };

  const fetchPharmacies = async (medicineName = '') => {
    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        medicineLoading: !!medicineName,
        isSearching: !!medicineName,
        searchTerm: medicineName || ''
      }));
      
      let response;
      if (medicineName) {
        response = await apiEndpoints.pharmacies.findPharmaciesWithMedicine(medicineName);
        
        //[OKS] Process medicines data
        const allMedicines = [];
        (response.data.results || response.data).forEach(pharmacy => {
          if (pharmacy.medicines?.length > 0) {
            allMedicines.push(...pharmacy.medicines.map(medicine => ({
              ...medicine,
              store_name: pharmacy.store_name,
              store_logo: pharmacy.store_logo,
              pharmacy_id: pharmacy.id,
              pharmacy_location: {
                lat: parseFloat(pharmacy.latitude),
                lng: parseFloat(pharmacy.longitude)
              }
            })));
          }
        });
        
        setState(prev => ({
          ...prev,
          medicines: allMedicines
        }));

        // Show medicine popup if we found medicines
        if (allMedicines.length > 0) {
          setShowMedicinePopup(true);
        }
      } else {
        response = await apiEndpoints.pharmacies.getAllPharmacies();
        setState(prev => ({
          ...prev,
          medicines: []
        }));
      }

      // Process pharmacies data
      const pharmaciesData = response.data.results || response.data;
      const transformedPharmacies = pharmaciesData.map(pharmacy => ({
        store_id: pharmacy.id,
        store_name: pharmacy.store_name,
        description: pharmacy.description || 'Pharmacy services',
        address: pharmacy.store_address || `${pharmacy.store_name}, ${pharmacy.store_type === 'pharmacy' ? 'Pharmacy' : 'Medical Devices Store'}`,
        location: {
          lat: parseFloat(pharmacy.latitude),
          lng: parseFloat(pharmacy.longitude)
        },
        phone: pharmacy.phone || 'Not available',
        hours: pharmacy.start_time && pharmacy.end_time 
          ? `${pharmacy.start_time.slice(0, 5)} - ${pharmacy.end_time.slice(0, 5)}`
          : 'Not available',
        rating: 4.0,
        store_logo_url: pharmacy.store_logo || 'https://i.pinimg.com/originals/89/70/d0/8970d0b80833a20fc173b2b86fc66c03.png',
        store_type: pharmacy.store_type,
        license_expiry_date: pharmacy.license_expiry_date,
        medicines: pharmacy.medicines || []
      }));

      setState(prev => ({
        ...prev,
        pharmacies: transformedPharmacies,
        loading: false,
        medicineLoading: false
      }));
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || error.message || 'Failed to load pharmacies. Please try again later.',
        loading: false,
        medicineLoading: false
      }));
    }
  };

  const refreshLocation = () => {
    setState(prev => ({
      ...prev,
      loading: true,
      locationError: null,
      error: null
    }));
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setState(prev => ({
            ...prev,
            userLocation: newLocation,
            mapCenter: newLocation,
            locationError: null
          }));
        },
        handleLocationError
      );
    } else {
      setDefaultLocation();
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handlePharmacyClick = (pharmacy) => {
    setState(prev => ({
      ...prev,
      selectedPharmacy: pharmacy
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const term = state.searchQuery.trim();
    setState(prev => ({
      ...prev,
      searchTerm: term
    }));
    
    if (term) {
      fetchPharmacies(term);
    } else {
      fetchPharmacies();
    }
  };

  const focusOnPharmacy = (pharmacyId) => {
    const pharmacy = state.pharmacies.find(p => p.store_id === pharmacyId);
    if (pharmacy) {
      handlePharmacyClick(pharmacy);
    }
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setState(prev => ({
              ...prev,
              userLocation: newLocation,
              mapCenter: newLocation,
              locationError: null
            }));
          },
          handleLocationError,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setState(prev => ({
          ...prev,
          locationError: 'Geolocation is not supported by this browser.'
        }));
        setDefaultLocation();
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const medicineParam = queryParams.get('medicine');
    if (medicineParam) {
      setState(prev => ({
        ...prev,
        searchQuery: medicineParam
      }));
      fetchPharmacies(medicineParam);
    } else {
      fetchPharmacies();
    }
  }, [location.search]);

  const sortedPharmacies = state.pharmacies
    .map(pharmacy => ({
      ...pharmacy,
      distance: calculateDistance(
        state.userLocation?.lat || 0, 
        state.userLocation?.lng || 0,
        pharmacy.location.lat, 
        pharmacy.location.lng
      )
    }))
    .sort((a, b) => a.distance - b.distance);

  if (!state.userLocation || !state.mapCenter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center justify-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <MapPin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
              </div>
              <span className="mt-4 text-lg font-medium text-gray-700">Getting your location...</span>
              <p className="text-sm text-gray-500 mt-2">This helps us find nearby pharmacies</p>
            </div>
            {state.locationError && (
              <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                  <p className="text-amber-800">{state.locationError}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6">
     
      <div className="max-w-7xl mx-auto">
        <SearchHeader
          searchTerm={state.searchTerm}
          searchQuery={state.searchQuery}
          onSearchChange={(value) => setState(prev => ({ ...prev, searchQuery: value }))}
          onSearchSubmit={handleSearch}
          medicines={state.medicines}
          isSearching={state.isSearching}
          onShowMedicinePopup={() => setShowMedicinePopup(true)}
        />

        {state.locationError && (
          <div className="mb-4 md:mb-6 bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-600 mr-2 md:mr-3" />
                <div>
                  <p className="text-xs md:text-sm text-amber-800 font-medium">{state.locationError}</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Showing results for: {state.mapCenter.lat.toFixed(4)}, {state.mapCenter.lng.toFixed(4)}
                  </p>
                </div>
              </div>
              <button 
                onClick={refreshLocation}
                className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-xs md:text-sm"
              >
                <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                Try Again
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <PharmacyMap
            mapCenter={state.mapCenter}
            userLocation={state.userLocation}
            pharmacies={state.pharmacies}
            selectedPharmacy={state.selectedPharmacy}
            onMapLoaded={(loaded) => setState(prev => ({ ...prev, mapLoaded: loaded }))}
            onMarkerClick={handlePharmacyClick}
            onCallPharmacy={(phone) => window.open(`tel:${phone}`)}
          />
          
          <PharmacyList
            pharmacies={sortedPharmacies}
            loading={state.loading}
            error={state.error}
            selectedPharmacy={state.selectedPharmacy}
            onPharmacyClick={handlePharmacyClick}
            searchTerm={state.searchTerm}
            onRefreshLocation={refreshLocation}
          />
        </div>

        {state.selectedPharmacy && (
          <PharmacyDetails
            pharmacy={state.selectedPharmacy}
            onClose={() => setState(prev => ({ ...prev, selectedPharmacy: null }))}
          />
        )}
      </div>
    </div>
  );
};

export default PharmacyLocatorContainer;