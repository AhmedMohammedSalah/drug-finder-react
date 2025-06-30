import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  MapPin, ShoppingCart, Navigation, Phone, Clock, 
  Star, RefreshCw, AlertCircle, Package, X 
} from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DrugFinderSearchBar from '../../components/client/DrugFinderSearchBar';
import PharmacyCardLocator from '../../components/shared/PharmacyCardLocator';
import apiEndpoints from '../../services/api';
import PharmaCapsuleLoader from '../../components/PharmaCapsuleLoader';
import IconButton from '../../components/shared/btn';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cartSlice';

const PharmacyLocator = () => {
  // State management
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
  
  // Refs
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const pharmacyListRef = useRef(null);
  const dispatch = useDispatch();

  // Constants
  const DEFAULT_LOCATION = { lat: 30.0444, lng: 31.2357 };
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoib21hcm9rc3RhciIsImEiOiJjbDYweWZnN2kxZDh2M2dvYWtsdWZmaXpkIn0.BgrSg2_-EDey-NBxWRKeTA';
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

  // Helper functions
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
        
        // Process medicines data
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
          : '9:00 AM - 9:00 PM',
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

  // Location handling
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

  // Handle initial search from URL
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

  // Map initialization
  useEffect(() => {
    if (!state.mapCenter || !mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [state.mapCenter.lng, state.mapCenter.lat],
      zoom: 15
    });

    map.current.on('load', () => {
      setState(prev => ({
        ...prev,
        mapLoaded: true
      }));
      
      if (state.userLocation) {
        new mapboxgl.Marker({ color: '#4285F4', scale: 0.8 })
          .setLngLat([state.userLocation.lng, state.userLocation.lat])
          .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
          .addTo(map.current);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [state.mapCenter, state.userLocation]);

  // Update map markers when pharmacies change
  useEffect(() => {
    if (!map.current || !state.mapLoaded || state.pharmacies.length === 0) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    state.pharmacies.forEach(pharmacy => {
      const markerEl = document.createElement('div');
      markerEl.className = 'pharmacy-marker';
      markerEl.style.backgroundImage = `url(${pharmacy.store_logo_url})`;
      markerEl.style.backgroundSize = 'cover';
      markerEl.style.width = '40px';
      markerEl.style.height = '40px';
      markerEl.style.borderRadius = '50%';
      markerEl.style.border = '2px solid white';
      markerEl.style.cursor = 'pointer';
      markerEl.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

      // Highlight selected pharmacy
      if (state.selectedPharmacy?.store_id === pharmacy.store_id) {
        markerEl.style.border = '3px solid #10B981';
        markerEl.style.transform = 'scale(1.2)';
      }

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'pharmacy-popup-capsule';
      
      popupContent.innerHTML = `
        <div class="popup-header" style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <img src="${pharmacy.store_logo_url}" 
                 style="width: 32px; height: 32px; border-radius: 50%; margin-right: 8px; object-fit: cover;" 
                 alt="${pharmacy.store_name}">
            <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${pharmacy.store_name}</h3>
          </div>
          <div style="display: flex; align-items: center; color: #f59e0b;">
            ${'★'.repeat(Math.round(pharmacy.rating))}${'☆'.repeat(5 - Math.round(pharmacy.rating))}
            <span style="margin-left: 4px; font-size: 12px; color: #6b7280;">${pharmacy.rating?.toFixed(1)}/5.0</span>
          </div>
        </div>
        
        <div class="popup-body" style="padding: 12px;">
          <div class="popup-info">
            <p style="margin: 4px 0; font-size: 12px; color: #6b7280; display: flex; align-items: center;">
              <svg style="width: 12px; height: 12px; margin-right: 4px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              ${pharmacy.address}
            </p>
            <p style="margin: 4px 0; font-size: 12px; color: #6b7280; display: flex; align-items: center;">
              <svg style="width: 12px; height: 12px; margin-right: 4px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
              </svg>
              ${pharmacy.hours}
            </p>
          </div>
        </div>
        
        <div class="popup-footer" style="padding: 8px 12px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px;">
          <button onclick="handleCall('${pharmacy.phone}')" 
                  style="flex: 1; background: #10b981; color: white; border: none; padding: 6px 12px; 
                         border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; 
                         align-items: center; justify-content: center; transition: background-color 0.2s;"
                  onmouseover="this.style.background='#059669'" 
                  onmouseout="this.style.background='#10b981'">
            <svg style="width: 12px; height: 12px; margin-right: 4px;" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
            </svg>
            Call
          </button>
          <button onclick="handleDirections(${pharmacy.location.lat}, ${pharmacy.location.lng})" 
                  style="flex: 1; background: #3b82f6; color: white; border: none; padding: 6px 12px; 
                         border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; 
                         align-items: center; justify-content: center; transition: background-color 0.2s;"
                  onmouseover="this.style.background='#2563eb'" 
                  onmouseout="this.style.background='#3b82f6'">
            <svg style="width: 12px; height: 12px; margin-right: 4px;" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
            </svg>
            Directions
          </button>
        </div>
      `;

      // Add global functions for popup interactions
      window.handleCall = (phoneNumber) => {
        window.open(`tel:${phoneNumber}`, '_self');
      };

      window.handleDirections = (lat, lng) => {
        if (state.userLocation) {
          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${state.userLocation.lat},${state.userLocation.lng}&destination=${lat},${lng}`,
            '_blank'
          );
        }
      };

      // Create marker with popup
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom'
      }).setLngLat([pharmacy.location.lng, pharmacy.location.lat]);

      markerEl.addEventListener('click', () => {
        setState(prev => ({
          ...prev,
          selectedPharmacy: pharmacy
        }));
        
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          className: 'custom-popup',
          maxWidth: '320px'
        }).setDOMContent(popupContent);

        marker.setPopup(popup).togglePopup();
      });

      marker.addTo(map.current);
      markers.current.push(marker);
    });

    if (state.selectedPharmacy) {
      map.current.flyTo({
        center: [state.selectedPharmacy.location.lng, state.selectedPharmacy.location.lat],
        zoom: 17,
        essential: true
      });
    }
  }, [state.pharmacies, state.selectedPharmacy, state.mapLoaded, state.userLocation]);

  // Utility functions
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
    
    if (map.current) {
      map.current.flyTo({
        center: [pharmacy.location.lng, pharmacy.location.lat],
        zoom: 17,
        essential: true
      });
      
      const marker = markers.current.find(m => 
        m.getLngLat().lng === pharmacy.location.lng && 
        m.getLngLat().lat === pharmacy.location.lat
      );
      if (marker) marker.togglePopup();
    }
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

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCart(product));
    } catch (err) {
      console.error('Add to cart failed', err);
    }
  };

  const focusOnPharmacy = (pharmacyId) => {
    const pharmacy = state.pharmacies.find(p => p.store_id === pharmacyId);
    if (pharmacy) {
      handlePharmacyClick(pharmacy);
    }
  };

  // Component rendering
  const MedicinePopup = () => {
    if (!showMedicinePopup || state.medicines.length === 0) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              Available Medicines ({state.medicines.length} found)
            </h2>
            <button 
              onClick={() => setShowMedicinePopup(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-4">
            {state.medicineLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {state.medicines.map((medicine, index) => (
                  <div 
                    key={`${medicine.id}-${index}`}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row">
                      <img 
                        className="h-48 w-full md:w-48 object-contain mb-4 md:mb-0 md:mr-4"
                        src={medicine.image || 'https://placehold.co/300x200?text=No+Image'}
                        alt={medicine.generic_name || medicine.brand_name || 'Medicine'}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/300x200?text=Image+Not+Found';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{medicine.generic_name}</h3>
                        <p className="text-gray-600">Brand: {medicine.brand_name}</p>
                        <p className="text-gray-600">Available at: {medicine.store_name}</p>
                        <p className="text-gray-600">Price: ${medicine.price}</p>
                        <p className="text-gray-600">Stock: {medicine.stock}</p>
                        {medicine.description && (
                          <p className="text-gray-600 mt-2 text-sm">{medicine.description}</p>
                        )}
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => {
                              handleAddToCart(medicine);
                              setShowMedicinePopup(false);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => {
                              focusOnPharmacy(medicine.pharmacy_id);
                              setShowMedicinePopup(false);
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            View Pharmacy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
      {/* Medicine Popup */}
      <MedicinePopup />

      <div className="max-w-7xl mx-auto">
        {/* Header with search */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {state.searchTerm ? `Search Results for "${state.searchTerm}"` : 'Find Nearby Pharmacies'}
          </h1>
          
          <div className="max-w-2xl mx-auto mt-4">
            <DrugFinderSearchBar
              value={state.searchQuery}
              onChange={(value) => setState(prev => ({ ...prev, searchQuery: value }))}
              onSubmit={handleSearch}
              placeholder="Search for medicines in pharmacies..."
            />
          </div>
          
          {state.isSearching && state.medicines.length > 0 && (
            <button 
              onClick={() => setShowMedicinePopup(true)}
              className="mt-2 inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Package className="h-4 w-4 mr-1" />
              Show {state.medicines.length} available medicines
            </button>
          )}
        </div>

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
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden h-[400px] md:h-[500px]">
              <div ref={mapContainer} className="w-full h-full" />
              {!state.mapLoaded && (
                <div className="min-h-screen bg-white">
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center justify-center">
                      <PharmaCapsuleLoader />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Pharmacy List */}
          <div className="h-[320px] md:h-[500px] flex flex-col">
            <h4 className="text-sm md:text-base mb-3 md:mb-4 px-4 py-3 rounded-lg bg-gradient-to-r from-blur-50 to-orange-50 border-l-4 border-blue-400 text-blue-700">
              {state.searchTerm ? (
                <>
                  Found <strong className="text-blue-800">{sortedPharmacies.length}</strong> pharmacies with "
                  <strong className="text-blue-800">{state.searchTerm}</strong>" <span className="text-blue-600">(nearest first)</span>
                </>
              ) : (
                <>
                  Showing <strong className="text-blue-800">{sortedPharmacies.length}</strong> nearby pharmacies 
                  <span className="text-blue-600"> (sorted by distance)</span>
                </>
              )}
            </h4>
            <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-3 md:p-4 flex flex-col h-full overflow-hidden border border-gray-100">
              <div className="px-2 pb-3 mb-1 border-b border-gray-100">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mr-2" />
                  Nearby Pharmacies
                </h2>
              </div>
              
              <div className="flex flex-col h-full">
                <div 
                  ref={pharmacyListRef}
                  className="h-full overflow-y-auto pr-2 scrollbar-thin 
                            scrollbar-thumb-blue-200 scrollbar-track-blue-50 
                            hover:scrollbar-thumb-blue-300 transition-all 
                            duration-300 scrollbar-thumb-rounded-full"
                >
                  {state.loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
                    </div>
                  ) : state.error ? (
                    <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                      <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
                      <p className="text-red-600 font-medium mb-4">{state.error}</p>
                      <button 
                        onClick={fetchPharmacies}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : sortedPharmacies.length === 0 ? (
                    <div className="text-center py-6 flex flex-col items-center justify-center h-full">
                      <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No pharmacies found near you</p>
                      <button 
                        onClick={refreshLocation}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Refresh Location
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sortedPharmacies.map(pharmacy => (
                        <PharmacyCardLocator
                          key={pharmacy.store_id}
                          pharmacy={pharmacy}
                          selected={state.selectedPharmacy?.store_id === pharmacy.store_id}
                          onClick={() => handlePharmacyClick(pharmacy)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Pharmacy Details */}
        {state.selectedPharmacy && (
          <div className="mt-4 md:mt-6 bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                <Star className="h-5 w-5 md:h-6 md:w-6 text-amber-500 mr-2 fill-current" />
                Pharmacy Details
              </h3>
              <button 
                onClick={() => setState(prev => ({ ...prev, selectedPharmacy: null }))}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-gray-800">{state.selectedPharmacy.store_name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{state.selectedPharmacy.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start text-gray-700">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{state.selectedPharmacy.address}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-green-600 mr-2 flex-shrink-0" />
                    <span>{state.selectedPharmacy.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-600 mr-2 flex-shrink-0" />
                    <span><strong className="font-medium">Hours:</strong> {state.selectedPharmacy.hours}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Navigation className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mr-2 flex-shrink-0" />
                    <span><strong className="font-medium">Distance:</strong> {state.selectedPharmacy.distance?.toFixed(1)} km away</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Star className="h-4 w-4 md:h-5 md:w-5 text-amber-500 mr-2 fill-current flex-shrink-0" />
                    <span><strong className="font-medium">Rating:</strong> {state.selectedPharmacy.rating?.toFixed(1)}/5.0</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 md:space-x-3 pt-2">
                  <button
                    onClick={() => window.open(`tel:${state.selectedPharmacy.phone}`, '_self')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center text-sm md:text-base"
                  >
                    <Phone className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                    Call Now
                  </button>
                  <Link 
                    to={`/pharmacy/${state.selectedPharmacy.store_id}`}>
                    <button
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center text-sm md:text-base"
                    >
                      <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                      Go Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyLocator;