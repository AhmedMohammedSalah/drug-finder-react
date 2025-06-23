import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Navigation, Phone, Clock, Star, RefreshCw, AlertCircle } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

const PharmacyLocator = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(null);
  const [zoom, setZoom] = useState(15);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const pharmacyListRef = useRef(null);

  // Mapbox configuration
  const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoib21hcm9rc3RhciIsImEiOiJjbDYweWZnN2kxZDh2M2dvYWtsdWZmaXpkIn0.BgrSg2_-EDey-NBxWRKeTA';
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

  // API base URL
  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Fetch pharmacies from backend API
  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/medical_stores/`);
      
      if (!response.data || !response.data.results) {
        throw new Error('Invalid API response structure');
      }

      const transformedPharmacies = response.data.results.map(pharmacy => ({
        store_id: pharmacy.id,
        store_name: pharmacy.store_name,
        description: pharmacy.description || 'Pharmacy services',
        address: `${pharmacy.store_name}, ${pharmacy.store_type === 'pharmacy' ? 'Pharmacy' : 'Medical Devices Store'}`,
        location: {
          lat: parseFloat(pharmacy.latitude),
          lng: parseFloat(pharmacy.longitude)
        },
        phone: 'Not available', // Update if your API provides phone numbers
        hours: '9:00 AM - 9:00 PM', // Update if your API provides hours
        rating: 4.0, // Update if your API provides ratings
        store_logo_url: pharmacy.store_logo || 'https://i.pinimg.com/originals/89/70/d0/8970d0b80833a20fc173b2b86fc66c03.png',
        store_type: pharmacy.store_type,
        license_expiry_date: pharmacy.license_expiry_date
      }));

      setPharmacies(transformedPharmacies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load pharmacies. Please try again later.');
      setLoading(false);
    }
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
    useDefaultLocation();
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
            setUserLocation(newLocation);
            setMapCenter(newLocation);
            setLocationError(null);
            fetchPharmacies();
          },
          (error) => {
            handleLocationError(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        setLocationError('Geolocation is not supported by this browser.');
        setDefaultLocation();
      }
    };

    getLocation();
  }, []);

  const useDefaultLocation = () => {
    const cairoLocation = { lat: 30.0444, lng: 31.2357 };
    setUserLocation(cairoLocation);
    setMapCenter(cairoLocation);
    fetchPharmacies();
  };

  // Initialize Mapbox Map
  useEffect(() => {
    if (!mapCenter || !mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [mapCenter.lng, mapCenter.lat],
      zoom: zoom
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add user location marker
      if (userLocation) {
        new mapboxgl.Marker({
          color: '#4285F4',
          scale: 0.8
        })
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
  }, [mapCenter]);

  // Update map markers when pharmacies change
  useEffect(() => {
    if (!map.current || !mapLoaded || pharmacies.length === 0) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add pharmacy markers
    pharmacies.forEach(pharmacy => {
      const el = document.createElement('div');
      el.className = 'pharmacy-marker';
      el.style.backgroundImage = `url(${pharmacy.store_logo_url})`;
      el.style.backgroundSize = 'cover';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([pharmacy.location.lng, pharmacy.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 10px; max-width: 250px;">
                <h3 style="margin: 0 0 5px 0; color: #333;">${pharmacy.store_name}</h3>
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${pharmacy.description}</p>
                <p style="margin: 0 0 5px 0; font-size: 12px;"><strong>Address:</strong> ${pharmacy.address}</p>
                <p style="margin: 0 0 5px 0; font-size: 12px;"><strong>Hours:</strong> ${pharmacy.hours}</p>
                <p style="margin: 0 0 10px 0; font-size: 12px;"><strong>Rating:</strong> ${pharmacy.rating?.toFixed(1)}/5</p>
                <div style="text-align: center;">
                  <button onclick="window.open('tel:${pharmacy.phone}')" style="background: #10b981; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 4px; cursor: pointer;">Call</button>
                  <button onclick="window.open('https://www.mapbox.com/directions/?from=${userLocation?.lng},${userLocation?.lat}&to=${pharmacy.location.lng},${pharmacy.location.lat}')" style="background: #3b82f6; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 4px; cursor: pointer;">Directions</button>
                </div>
              </div>
            `)
        )
        .addTo(map.current);

      // Highlight selected pharmacy
      if (selectedPharmacy?.store_id === pharmacy.store_id) {
        el.style.border = '3px solid #10B981';
        marker.togglePopup();
      }

      marker.getElement().addEventListener('click', () => {
        setSelectedPharmacy(pharmacy);
      });

      markers.current.push(marker);
    });

    // Center map on selected pharmacy
    if (selectedPharmacy) {
      map.current.flyTo({
        center: [selectedPharmacy.location.lng, selectedPharmacy.location.lat],
        zoom: 17,
        essential: true
      });
    }
  }, [pharmacies, selectedPharmacy, mapLoaded]);

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
          fetchPharmacies();
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
    
    // Center map on selected pharmacy
    if (map.current) {
      map.current.flyTo({
        center: [pharmacy.location.lng, pharmacy.location.lat],
        zoom: 17,
        essential: true
      });
      
      // Open the marker's popup
      const marker = markers.current.find(m => 
        m.getLngLat().lng === pharmacy.location.lng && 
        m.getLngLat().lat === pharmacy.location.lat
      );
      if (marker) {
        marker.togglePopup();
      }
    }
  };

  const getDirections = (pharmacy) => {
    if (!userLocation) return;
    const url = `https://www.mapbox.com/directions/?from=${userLocation.lng},${userLocation.lat}&to=${pharmacy.location.lng},${pharmacy.location.lat}`;
    window.open(url, '_blank');
  };

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

  const sortedPharmacies = pharmacies
    .map(pharmacy => ({
      ...pharmacy,
      distance: calculateDistance(
        userLocation.lat, userLocation.lng,
        pharmacy.location.lat, pharmacy.location.lng
      )
    }))
    .sort((a, b) => a.distance - b.distance);

  const PharmacyCard = ({ pharmacy, selected, onClick }) => (
    <div 
      className={`bg-white rounded-xl p-4 mb-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
        selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md hover:shadow-xl'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
            <img
              src={pharmacy.store_logo_url}
              alt={pharmacy.store_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full items-center justify-center">
              <MapPin className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-md font-semibold text-gray-900 line-clamp-1">{pharmacy.store_name}</h3>
              <p className="text-xs text-gray-500 line-clamp-1">{pharmacy.description}</p>
            </div>
            <div className="flex items-center space-x-1 text-amber-500">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-xs font-medium text-gray-700">{pharmacy.rating?.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="text-xs space-y-1">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
              <span className="line-clamp-1 flex-1">{pharmacy.address}</span>
              <span className="ml-2 text-blue-600 font-medium whitespace-nowrap">
                {pharmacy.distance?.toFixed(1)} km
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                <span className="line-clamp-1">{pharmacy.hours}</span>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${pharmacy.phone}`, '_self');
                  }}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                >
                  <Phone className="h-3 w-3 mr-0.5" />
                  Call
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    getDirections(pharmacy);
                  }}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <Navigation className="h-3 w-3 mr-0.5" />
                  Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with improved spacing */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Find Nearby Pharmacies</h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Locate pharmacies near you with real-time information
          </p>
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

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden h-[400px] md:h-[500px]">
              <div 
                ref={mapContainer}
                className="w-full h-full"
              />
              
              {!mapLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center">
                  <div className="text-center p-4 md:p-6">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg">
                      <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-3 md:mb-4"></div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Loading Map...</h3>
                      <p className="text-xs md:text-sm text-gray-600">Please wait while we load the map</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* [OKS] Pharmacy List with improved scrolling */}
          <div className="h-[400px] md:h-[500px] flex flex-col">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 flex-1 flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                <MapPin className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mr-2" />
                Nearby Pharmacies
              </h2>
              
              <div 
                ref={pharmacyListRef}
                className="flex-1 overflow-y-auto pr-2 -mr-2"
                style={{ scrollbarWidth: 'thin' }}
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
                  <div className="text-center py-8 flex flex-col items-center justify-center h-full">
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
                      <PharmacyCard
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

        {/* Selected Pharmacy Details with improved layout */}
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
                  
                  <button
                    onClick={() => getDirections(selectedPharmacy)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center text-sm md:text-base"
                  >
                    <Navigation className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                    Directions
                  </button>
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