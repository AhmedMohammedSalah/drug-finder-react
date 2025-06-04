import React, { useEffect, useState, useCallback } from 'react';
import { MapPin, Navigation, Phone, Clock, Star } from 'lucide-react';
import PharmacyCardLocator from '../shared/PharmacyCardLocator';
const PharmacyLocator = () => {


// [OKS *0-0*]  static pharmacies data
  const staticPharmacies = [
    {
      store_id: 1,
      store_name: "Al-Shifa Pharmacy",
     "store_logo_url": "https://i.pinimg.com/originals/89/70/d0/8970d0b80833a20fc173b2b86fc66c03.png",

      description: "24/7 Emergency pharmacy with full medical supplies",
      address: "Cairo",
      location: { lat: 30.0444, lng: 31.2357 },
      phone: "+20 2 1234 5678",
      hours: "24/7",
      rating: 4.5
    },
    {
      store_id: 2,
      store_name: "Nile Pharmacy",
      description: "Family pharmacy specializing in pediatric medicines",
      store_logo_url: "https://i.pinimg.com/originals/89/70/d0/8970d0b80833a20fc173b2b86fc66c03.png",

      address: "Cairo",
      location: { lat: 30.0461, lng: 31.2394 },
      phone: "+20 2 9876 5432",
      hours: "8:00 AM - 10:00 PM",
      rating: 4.2
    },
    {
      store_id: 3,
      store_logo_url: "https://cdn.vectorstock.com/i/1000v/27/61/medical-pharmacy-logo-design-template-vector-35392761.jpg",
      store_name: "Modern Pharmacy",
      description: "Digital pharmacy with online consultation services",
      address: "Cairo",
      location: { lat: 30.0420, lng: 31.2330 },
      phone: "+20 2 5555 1234",
      hours: "9:00 AM - 9:00 PM",
      rating: 4.7
    }
  ];

  // intializing  user location
  const [userLocation, setUserLocation] = useState({
    lat: 30.044,
    lng: 31.236
  });

  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 30.044, lng: 31.236 });
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    fetchPharmacies();
    getUserLocation();
  }, []);

  const fetchPharmacies = async () => {
    try {
      setTimeout(() => {
        setPharmacies(staticPharmacies);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error loading pharmacies:', error);
      setLoading(false);
    }
  };

  //[OKS *0-0*] Function to get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setMapCenter(newLocation);
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  };

  // [OKS *0-0*]   Function to calculate distance between two coordinates
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
  
  // [OKS *0-0*] Function to handle pharmacy click
  const handlePharmacyClick = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setMapCenter({ lat: pharmacy.location.lat, lng: pharmacy.location.lng });
    setZoom(17);
  };

  const getDirections = (pharmacy) => {
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${pharmacy.location.lat},${pharmacy.location.lng}`;
    window.open(url, '_blank');
  };

  const sortedPharmacies = pharmacies
    .filter(pharmacy => pharmacy.address.toLowerCase() === 'cairo')
    .map(pharmacy => ({
      ...pharmacy,
      distance: calculateDistance(
        userLocation.lat, userLocation.lng,
        pharmacy.location.lat, pharmacy.location.lng
      )
    }))
    .sort((a, b) => a.distance - b.distance);
 
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading pharmacies...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-96 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-500">Centered on: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</p>
                  <p className="text-xs text-gray-400 mt-2">Zoom: {zoom}x</p>
                </div>
              </div>
              
              {sortedPharmacies.map((pharmacy, index) => (
                <div
                  key={pharmacy.store_id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                    selectedPharmacy?.store_id === pharmacy.store_id ? 'scale-125 z-10' : 'hover:scale-110'
                  }`}
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`
                  }}
                  onClick={() => handlePharmacyClick(pharmacy)}
                >
                  <div className="bg-red-600 text-white rounded-full p-2 shadow-lg">
                   <img
                    src={pharmacy.store_logo_url}
                    alt={pharmacy.store_name}
                    className="h-8 w-8 rounded-full object-cover border border-gray-200 shadow"
                  />
                  </div>
                </div>
              ))}
              
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: '50%', top: '50%' }}
              >
                <div className="bg-blue-600 text-white rounded-full p-2 shadow-lg">
                  <Navigation className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

      
      <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Nearby Pharmacies</h2>
      {sortedPharmacies.length === 0 ? (
      <p className="text-gray-500 text-center py-8">No pharmacies found in Cairo</p>
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
            </div>
            <div className="text-sm text-blue-600">
              <p><strong>Distance:</strong> {selectedPharmacy.distance?.toFixed(1)} km</p>
              <p><strong>Hours:</strong> {selectedPharmacy.hours}</p>
              <p><strong>Rating:</strong> {selectedPharmacy.rating}/5</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyLocator;