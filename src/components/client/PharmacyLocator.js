import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin,ShoppingCart ,Navigation, Phone, Clock, Star, RefreshCw, AlertCircle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DrugFinderSearchBar from '../../components/client/DrugFinderSearchBar';
import PharmacyCardLocator from '../../components/shared/PharmacyCardLocator';
import apiEndpoints from '../../services/api';
import PharmaCapsuleLoader from '../../components/PharmaCapsuleLoader';
import { Link  } from 'react-router-dom';

/* [OKS] will improve design and reusability*/ 
const PharmacyLocator = () => {
  const location = useLocation();
  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(null);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const[searchTerm, setSearchTerm] = useState('');
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const pharmacyListRef = useRef(null);

  //  [OKS] Mapbox configuration
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoib21hcm9rc3RhciIsImEiOiJjbDYweWZnN2kxZDh2M2dvYWtsdWZmaXpkIn0.BgrSg2_-EDey-NBxWRKeTA';
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

  //[OKS] Fetch pharmacies from backend API
  const fetchPharmacies = async (medicineName = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (medicineName) {
        setIsSearching(true);
        response = await apiEndpoints.pharmacies.findPharmaciesWithMedicine(medicineName);
      } else {
        setIsSearching(false);
        response = await apiEndpoints.pharmacies.getAllPharmacies();
      }

      if (!response.data || (!response.data.results && !Array.isArray(response.data))) {
        throw new Error('Invalid API response structure');
      }

      const pharmaciesData = response.data.results || response.data;
      const transformedPharmacies = pharmaciesData.map(pharmacy => ({
        store_id: pharmacy.id,
        store_name: pharmacy.store_name,
        description: pharmacy.description || 'Pharmacy services',
        address: `${pharmacy.store_name}, ${pharmacy.store_type === 'pharmacy' ? 'Pharmacy' : 'Medical Devices Store'}`,
        location: {
          lat: parseFloat(pharmacy.latitude),
          lng: parseFloat(pharmacy.longitude)
        },
        phone: 'Not available',
        hours: '9:00 AM - 9:00 PM',
        rating: 4.0,
        store_logo_url: pharmacy.store_logo || 'https://i.pinimg.com/originals/89/70/d0/8970d0b80833a20fc173b2b86fc66c03.png',
        store_type: pharmacy.store_type,
        license_expiry_date: pharmacy.license_expiry_date
      }));

      setPharmacies(transformedPharmacies);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load pharmacies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Use a regular function name, not a hook name
  const setDefaultLocation = () => {
    const cairoLocation = { lat: 30.0444, lng: 31.2357 };
    setUserLocation(cairoLocation);
    setMapCenter(cairoLocation);
    fetchPharmacies();
  };

  const handleLocationError = (error) => {
    console.error('Location error:', error);
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
      default:
        errorMessage = 'An unknown error occurred. Using default location.';
    }
    
    setLocationError(errorMessage);
    setDefaultLocation();
  };
  // Handle initial search from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const medicineParam = queryParams.get('medicine');
    if (medicineParam) {
      setSearchQuery(medicineParam);
      fetchPharmacies(medicineParam);
    } else {
      fetchPharmacies();
    }
  }, [location.search]);

  // Get user location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(newLocation);
            setMapCenter(newLocation);
            setLocationError(null);
          },
          (error) => {
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
            setLocationError(errorMessage);
            useDefaultLocation();
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setLocationError('Geolocation is not supported by this browser.');
        useDefaultLocation();
      }
    };

    getLocation();
  }, []);

  const useDefaultLocation = () => {
    const cairoLocation = { lat: 30.0444, lng: 31.2357 };
    setUserLocation(cairoLocation);
    setMapCenter(cairoLocation);
  };

  // Initialize Mapbox Map
  useEffect(() => {
    if (!mapCenter || !mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [mapCenter.lng, mapCenter.lat],
      zoom: 15
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      if (userLocation) {
        new mapboxgl.Marker({ color: '#4285F4', scale: 0.8 })
          .setLngLat([userLocation.lng, userLocation.lat])
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
  }, [mapCenter, userLocation]);

useEffect(() => {
  if (!map.current || !mapLoaded || pharmacies.length === 0) return;

  markers.current.forEach(marker => marker.remove());
  markers.current = [];

  pharmacies.forEach(pharmacy => {
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
    if (selectedPharmacy?.store_id === pharmacy.store_id) {
      markerEl.style.border = '3px solid #10B981';
      markerEl.style.transform = 'scale(1.2)';
    }

    //  [OKS] Create popup content with pharmacy details only css global;
    const createPopupContent = () => {
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

      return popupContent;
    };

    // Add global functions for popup interactions
    window.handleCall = (phoneNumber) => {
      window.open(`tel:${phoneNumber}`, '_self');
    };

    window.handleDirections = (lat, lng) => {
      if (userLocation) {
        window.open(
          `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${lat},${lng}`,
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
      setSelectedPharmacy(pharmacy);
      
      const popupContent = createPopupContent();
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

  if (selectedPharmacy) {
    map.current.flyTo({
      center: [selectedPharmacy.location.lng, selectedPharmacy.location.lat],
      zoom: 17,
      essential: true
    });
  }
}, [pharmacies, selectedPharmacy, mapLoaded, userLocation]);

  const refreshLocation = () => {
    setLoading(true);
    setLocationError(null);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setMapCenter(newLocation);
          setLocationError(null);
        },
        (error) => {
          handleLocationError(error);
        }
      );
    } else {
      setDefaultLocation();
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handlePharmacyClick = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
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
    setSearchTerm(searchQuery.trim());
    
    if (searchQuery.trim()) {
      fetchPharmacies(searchQuery.trim());
    } else {
      fetchPharmacies();
    }
  };

  const getDirections = (pharmacy) => {
    if (!userLocation) return;
    const url = `https://www.mapbox.com/directions/?from=${userLocation.lng},${userLocation.lat}&to=${pharmacy.location.lng},${pharmacy.location.lat}`;
    window.open(url, '_blank');
  };

  const sortedPharmacies = pharmacies
    .map(pharmacy => ({
      ...pharmacy,
      distance: calculateDistance(
        userLocation?.lat || 0, 
        userLocation?.lng || 0,
        pharmacy.location.lat, 
        pharmacy.location.lng
      )
    }))
    .sort((a, b) => a.distance - b.distance);

  if (!userLocation || !mapCenter) {
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
            {locationError && (
              <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                  <p className="text-amber-800">{locationError}</p>
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
        {/* Header with search */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Find Nearby Pharmacies</h1>
          
          <div className="max-w-2xl mx-auto mt-4">
            <DrugFinderSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              placeholder="Search for medicines in pharmacies..."
            />
          </div>
          
          {isSearching && (
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Showing pharmacies with "{searchQuery}" in stock
            </p>
          )}
        </div>

        {locationError && (
          <div className="mb-4 md:mb-6 bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-600 mr-2 md:mr-3" />
                <div>
                  <p className="text-xs md:text-sm text-amber-800 font-medium">{locationError}</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Showing results for: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
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
              {!mapLoaded && (
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
                 {searchTerm ? (
                  <>
                    Found <strong className="text-blue-800">{sortedPharmacies.length}</strong> pharmacies with "
                           <strong className="text-blue-800">{searchTerm}</strong>" <span className="text-blue-600">(nearest first)</span>
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
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                      <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
                      <p className="text-red-600 font-medium mb-4">{error}</p>
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
                          selected={selectedPharmacy?.store_id === pharmacy.store_id}
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
        {selectedPharmacy && (
          <div className="mt-4 md:mt-6 bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                <Star className="h-5 w-5 md:h-6 md:w-6 text-amber-500 mr-2 fill-current" />
                Pharmacy Details
              </h3>
              <button 
                onClick={() => setSelectedPharmacy(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-3 md:space-y-4">
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-gray-800">{selectedPharmacy.store_name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedPharmacy.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start text-gray-700">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{selectedPharmacy.address}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-green-600 mr-2 flex-shrink-0" />
                    <span>{selectedPharmacy.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-600 mr-2 flex-shrink-0" />
                    <span><strong className="font-medium">Hours:</strong> {selectedPharmacy.hours}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Navigation className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mr-2 flex-shrink-0" />
                    <span><strong className="font-medium">Distance:</strong> {selectedPharmacy.distance?.toFixed(1)} km away</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Star className="h-4 w-4 md:h-5 md:w-5 text-amber-500 mr-2 fill-current flex-shrink-0" />
                    <span><strong className="font-medium">Rating:</strong> {selectedPharmacy.rating?.toFixed(1)}/5.0</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 md:space-x-3 pt-2">
                  <button
                    onClick={() => window.open(`tel:${selectedPharmacy.phone}`, '_self')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center text-sm md:text-base"
                  >
                    <Phone className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                    Call Now
                  </button>
                  <Link 
                    to={`/pharmacy/${selectedPharmacy.store_id}`}>
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