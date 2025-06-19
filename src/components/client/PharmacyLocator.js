import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Phone, Clock, Star } from 'lucide-react';
import PharmacyCardLocator from '../shared/PharmacyCardLocator';
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

  //[OKS] Axios instance will be added  to api file  
  const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' }
  });

  
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
        useDefaultLocation();
      }
    };

    getLocation();
  }, []);

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

  const useDefaultLocation = () => {
    const cairoLocation = { lat: 30.0444, lng: 31.2357 };
    setUserLocation(cairoLocation);
    setMapCenter(cairoLocation);
    fetchPharmacies();
  };

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/medical_stores/');
      
      const transformedPharmacies = response.data.map(pharmacy => ({
        store_id: pharmacy.id,
        store_name: pharmacy.store_name,
        description: pharmacy.description || 'Pharmacy services',
        address: pharmacy.address || 'Cairo',
        location: {
          lat: pharmacy.latitude || 30.0444 + (Math.random() * 0.01 - 0.005),
          lng: pharmacy.longitude || 31.2357 + (Math.random() * 0.01 - 0.005)
        },
        phone: pharmacy.phone || '+20 2 1234 5678',
        hours: pharmacy.hours || '9:00 AM - 9:00 PM',
        rating: 4.0 + (Math.random() * 0.5),
        store_logo_url: pharmacy.store_logo || 'https://i.pinimg.com/originals/89/70/d0/8970d0b80833a20fc173b2b86fc66c03.png'
      }));

      setPharmacies(transformedPharmacies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      setError('Failed to load pharmacies. Please try again later.');
      setLoading(false);
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
    setMapCenter({ lat: pharmacy.location.lat, lng: pharmacy.location.lng });
    setZoom(17);
  };

  const getDirections = (pharmacy) => {
    if (!userLocation) return;
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${pharmacy.location.lat},${pharmacy.location.lng}`;
    window.open(url, '_blank');
  };

  if (!userLocation || !mapCenter) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Getting your location...</span>
        </div>
        {locationError && (
          <div className="text-center text-yellow-600 mt-4">
            {locationError}
          </div>
        )}
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

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {locationError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>{locationError}</p>
          <p>Showing results centered at: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</p>
          <button 
            onClick={refreshLocation}
            className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
       <div className="h-96 bg-gray-200 relative">

      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
       <div className="text-center">
       <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <p className="text-gray-700 font-medium">Interactive Map</p>
        <p className="text-sm text-gray-500">
            Centered on: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
        </p>
         <p className="text-xs text-gray-400 mt-2">Zoom: {zoom}x</p>
        </div>
       </div>

{/* User Location Marker */}
      {userLocation && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            left: '50%',
            top: '50%'
          }}
        >
          <div className="bg-blue-600 text-white rounded-full p-2 shadow-lg">
            <Navigation className="h-4 w-4" />
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-blue-600"></div>
        </div>
      )}

      {sortedPharmacies.map((pharmacy) => {
        const latDiff = pharmacy.location.lat - mapCenter.lat;
        const lngDiff = pharmacy.location.lng - mapCenter.lng;
        
        const left = 50 + (lngDiff * 5000); 
        const top = 50 - (latDiff * 5000);

        return (
          <div
            key={pharmacy.store_id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
              selectedPharmacy?.store_id === pharmacy.store_id ? 'scale-125 z-10' : 'z-0 hover:scale-110'
            }`}
            style={{
              left: `${left}%`,
              top: `${top}%`
            }}
            onClick={() => handlePharmacyClick(pharmacy)}
          >
            <div className="bg-red-600 text-white rounded-full p-2 shadow-lg relative">
              <img
                src={pharmacy.store_logo_url}
                alt={pharmacy.store_name}
                className="h-8 w-8 rounded-full object-cover border border-gray-200 shadow"
              />
              {selectedPharmacy?.store_id === pharmacy.store_id && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-600"></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Nearby Pharmacies</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : sortedPharmacies.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pharmacies found near you</p>
          ) : (
            sortedPharmacies.map(pharmacy => (
              <PharmacyCardLocator
                key={pharmacy.store_id}
                pharmacy={pharmacy}
                selected={selectedPharmacy?.store_id === pharmacy.store_id}
                onClick={() => handlePharmacyClick(pharmacy)}
                getDirections={getDirections}
              />
            ))
          )}
        </div>
      </div>

      {selectedPharmacy && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-lg text-blue-800 mb-2">Selected Pharmacy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-700">{selectedPharmacy.store_name}</h4>
              <p className="text-sm text-blue-600">{selectedPharmacy.description}</p>
              <p className="text-sm text-blue-600 mt-2">
                <Phone className="inline h-4 w-4 mr-1" />
                {selectedPharmacy.phone}
              </p>
            </div>
            <div className="text-sm text-blue-600">
              <p>
                <MapPin className="inline h-4 w-4 mr-1" />
                <strong>Distance:</strong> {selectedPharmacy.distance?.toFixed(1)} km
              </p>
              <p>
                <Clock className="inline h-4 w-4 mr-1" />
                <strong>Hours:</strong> {selectedPharmacy.hours}
              </p>
              <p>
                <Star className="inline h-4 w-4 mr-1" />
                <strong>Rating:</strong> {selectedPharmacy.rating}/5
              </p>
              <button
                onClick={() => getDirections(selectedPharmacy)}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyLocator;